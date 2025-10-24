// ============================================================================
// REDES.JS - Simulación de Protocolo de Capa de Enlace de Datos
// ============================================================================

// ==================== CONSTANTES ====================
const DELIMITADOR_TRAMA = 0x7E; // Delimitador de inicio/fin de trama

// ==================== FUNCIONES AUXILIARES ====================
function textoABytes(texto) {
    return Buffer.from(texto, 'utf-8');
}

function bytesATexto(bytes) {
    return Buffer.from(bytes).toString('utf-8');
}

function calcularCRC16(datos) {
    let crc = 0xFFFF;
    for (let b of datos) {
        crc ^= b << 8;
        for (let i = 0; i < 8; i++) {
            if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
            else crc <<= 1;
        }
        crc &= 0xFFFF;
    }
    return crc;
}

function aplicarStuffing(datos) {
    const resultado = [];
    for (let b of datos) {
        if (b === 0x7E) {
            resultado.push(0x7D, 0x5E);
        } else if (b === 0x7D) {
            resultado.push(0x7D, 0x5D);
        } else {
            resultado.push(b);
        }
    }
    return resultado;
}

function removerStuffing(datos) {
    const resultado = [];
    for (let i = 0; i < datos.length; i++) {
        if (datos[i] === 0x7D) {
            if (datos[i + 1] === 0x5E) resultado.push(0x7E);
            else if (datos[i + 1] === 0x5D) resultado.push(0x7D);
            i++;
        } else {
            resultado.push(datos[i]);
        }
    }
    return resultado;
}

function formatearHex(datos) {
    return datos.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

// ============================================================================
// CÓDIGO DEL TRANSMISOR
// ============================================================================
class Transmisor {
    constructor() {
        this.numeroSecuencia = 0;
    }

    crearTrama(payload) {
        const datosConSeq = [this.numeroSecuencia, ...payload];
        const crc = calcularCRC16(datosConSeq);
        const crcByte1 = (crc >> 8) & 0xFF;
        const crcByte2 = crc & 0xFF;
        const datosConCRC = [...datosConSeq, crcByte1, crcByte2];
        const datosConStuffing = aplicarStuffing(datosConCRC);
        const tramaCompleta = [DELIMITADOR_TRAMA, ...datosConStuffing, DELIMITADOR_TRAMA];
        return tramaCompleta;
    }

    enviarMensaje(mensaje, receptor) {
        const payload = textoABytes(mensaje);
        const trama = this.crearTrama(payload);

        console.log(`\n${'='.repeat(70)}`);
        console.log(`[>>] TRANSMISOR - Enviando trama con SEQ=${this.numeroSecuencia}`);
        console.log(`Mensaje: "${mensaje}"`);
        console.log(`Trama (${trama.length} bytes): ${formatearHex(trama)}`);

        const respuesta = receptor.recibirTrama(trama);

        if (respuesta.tipo === 'ACK') {
            console.log(`[OK] ACK recibido - Trama ${this.numeroSecuencia} confirmada`);
            this.numeroSecuencia = (this.numeroSecuencia + 1) % 256;
            return { exito: true, mensaje: 'Transmision exitosa' };
        } else {
            console.log(`[X] NAK recibido - Error en trama ${this.numeroSecuencia}`);
            return { exito: false, mensaje: 'Error detectado, requiere retransmision' };
        }
    }

    enviarConRetransmision(mensaje, receptor, maxReintentos = 3) {
        let intentos = 0;
        let exitoso = false;

        while (!exitoso && intentos < maxReintentos) {
            if (intentos > 0) {
                console.log(`\n[!] RETRANSMISION - Intento ${intentos + 1} de ${maxReintentos}`);
            }
            const resultado = this.enviarMensaje(mensaje, receptor);
            exitoso = resultado.exito;
            intentos++;
            if (!exitoso && intentos < maxReintentos) {
                console.log('[...] Esperando antes de reintentar...');
            }
        }

        if (!exitoso) {
            console.log(`\n[X] FALLO - No se pudo transmitir despues de ${maxReintentos} intentos`);
        }

        return exitoso;
    }
}

// ============================================================================
// CÓDIGO DEL RECEPTOR
// ============================================================================
class Receptor {
    constructor(tasaErrorSimulada = 0.15) {
        this.ultimaSecuenciaRecibida = -1;
        this.tasaErrorSimulada = tasaErrorSimulada;
    }

    recibirTrama(trama) {
        console.log(`\n[<<] RECEPTOR - Procesando trama recibida`);

        if (trama[0] !== DELIMITADOR_TRAMA || trama[trama.length - 1] !== DELIMITADOR_TRAMA) {
            console.log(`[X] Error: Delimitadores incorrectos`);
            return { tipo: 'NAK', razon: 'Delimitadores incorrectos' };
        }

        const datosConStuffing = trama.slice(1, -1);
        const datos = removerStuffing(datosConStuffing);

        if (datos.length < 3) {
            console.log(`[X] Error: Trama demasiado corta`);
            return { tipo: 'NAK', razon: 'Trama incompleta' };
        }

        const secuencia = datos[0];
        const crcRecibido = (datos[datos.length - 2] << 8) | datos[datos.length - 1];
        const payload = datos.slice(1, -2);

        console.log(`Número de secuencia: ${secuencia}`);
        console.log(`CRC recibido: 0x${crcRecibido.toString(16).toUpperCase()}`);

        const errorSimulado = Math.random() < this.tasaErrorSimulada;
        if (errorSimulado) {
            console.log(`[!] Error simulado del medio fisico (${(this.tasaErrorSimulada * 100).toFixed(0)}% probabilidad)`);
            return { tipo: 'NAK', razon: 'Error en el medio de transmision' };
        }

        const crcCalculado = calcularCRC16([secuencia, ...payload]);
        console.log(`CRC calculado: 0x${crcCalculado.toString(16).toUpperCase()}`);

        if (crcRecibido !== crcCalculado) {
            console.log(`[X] Error: CRC no coincide - Trama corrupta`);
            return { tipo: 'NAK', razon: 'Error de CRC' };
        }

        if (secuencia === this.ultimaSecuenciaRecibida) {
            console.log(`[!] Trama duplicada detectada (SEQ=${secuencia})`);
            return { tipo: 'ACK', razon: 'Duplicado descartado' };
        }

        const mensajeRecibido = bytesATexto(payload);
        console.log(`[OK] Trama valida recibida`);
        console.log(`Mensaje: "${mensajeRecibido}"`);
        this.ultimaSecuenciaRecibida = secuencia;

        return { tipo: 'ACK', mensaje: mensajeRecibido, secuencia: secuencia };
    }
}

// ============================================================================
// CÓDIGO DE LA DEMO
// ============================================================================
function ejecutarDemo() {
    console.log('\n' + '='.repeat(70));
    console.log('PROTOCOLO DE CAPA DE ENLACE DE DATOS');
    console.log('Clínica Odontológica Coronel Rodríguez');
    console.log('Medio: UTP Cat 6 + Fibra óptica OM3');
    console.log('='.repeat(70));

    const transmisor = new Transmisor();
    const receptor = new Receptor(0.20); // 20% de probabilidad de error

    const mensajesPrueba = [
        { vlan: 'VLAN 10 (Administración)', mensaje: 'Solicitud de historial clínico paciente #4521' },
        { vlan: 'VLAN 20 (Clínica)', mensaje: 'Confirmación de turno para tratamiento de conducto' },
        { vlan: 'VLAN 30 (Servidores)', mensaje: 'Backup de base de datos completado exitosamente' },
        { vlan: 'VLAN 10 → VLAN 30', mensaje: 'Actualización de datos de facturación mensual' },
        { vlan: 'VLAN 20 → VLAN 30', mensaje: 'Registro de nuevo paciente en sistema' }
    ];

    console.log('\n[*] Iniciando transmision de mensajes...\n');

    let exitos = 0;
    let fallos = 0;

    for (let i = 0; i < mensajesPrueba.length; i++) {
        const { vlan, mensaje } = mensajesPrueba[i];
        console.log(`\n${'v'.repeat(35)}`);
        console.log(`[>>] Comunicacion ${i + 1}/${mensajesPrueba.length}: ${vlan}`);
        const resultado = transmisor.enviarConRetransmision(mensaje, receptor, 3);
        if (resultado) exitos++;
        else fallos++;
    }

    console.log('\n' + '='.repeat(70));
    console.log('[*] RESUMEN DE TRANSMISION');
    console.log('='.repeat(70));
    console.log(`[OK] Mensajes exitosos: ${exitos}/${mensajesPrueba.length}`);
    console.log(`[X] Mensajes fallidos: ${fallos}/${mensajesPrueba.length}`);
    console.log(`[%] Tasa de exito: ${((exitos / mensajesPrueba.length) * 100).toFixed(1)}%`);
    console.log('='.repeat(70));
    console.log('\n>>> Demostracion completada');
    console.log('El protocolo garantiza:');
    console.log(' - Deteccion de errores mediante CRC-16');
    console.log(' - Control de flujo con ACK/NAK');
    console.log(' - Prevencion de duplicados con numeros de secuencia');
    console.log(' - Enmarcado correcto con byte stuffing');
}

// Ejecutar la demo
ejecutarDemo();
