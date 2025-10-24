Ejecución del Código – Protocolo de Capa de Enlace de Datos

Para el desarrollo del protocolo de capa de enlace de datos, diseñamos un programa en JavaScript que simula la transmisión de mensajes entre distintas VLAN de una clínica odontológica. El objetivo del programa es demostrar cómo un medio de transmisión puede entregar mensajes libres de errores gracias a técnicas de enmarcado de tramas, secuencia de números y verificación de errores (CRC).

El proyecto está disponible en GitHub y se ejecuta de manera local utilizando Node.js. Para ejecutar el programa, se utilizó el siguiente comando desde la carpeta donde se encuentra el archivo principal:

node .\redes.js

Descripción del Proceso

Configuración del medio: El programa simula un medio de transmisión compuesto por UTP Cat 6 + Fibra Óptica OM3, para emular distintas VLAN dentro de la clínica.

Transmisión de mensajes: Se envían 5 mensajes distintos entre VLAN de administración, clínica y servidores. Cada mensaje se empaqueta en una trama, se le asigna un número de secuencia y se calcula un CRC para detectar errores.

Recepción y validación: El receptor procesa cada trama recibida, verifica el CRC y confirma la recepción mediante un ACK. Si el CRC coincide, se considera que el mensaje fue recibido correctamente.

Resumen final: Al terminar la transmisión de todos los mensajes, se muestra un resumen con la cantidad de mensajes enviados, fallidos y la tasa de éxito.

Ejemplo de Salida del Programa
PROTOCOLO DE CAPA DE ENLACE DE DATOS
Clínica Odontológica Coronel Rodríguez
Medio: UTP Cat 6 + Fibra óptica OM3
======================================================================

[*] Iniciando transmision de mensajes...

vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
[>>] Comunicacion 1/5: VLAN 10 (Administración)
======================================================================
[>>] TRANSMISOR - Enviando trama con SEQ=0
Mensaje: "Solicitud de historial clínico paciente #4521"
Trama (51 bytes): 7E 00 53 6F 6C 69 63 69 74 75 64 20 64 65 20 68 69 73 74 6F 72 69 61 6C 20 63 6C C3 AD 6E 69 63 6F 20 70 61 63 69 65 6E 74 65 20 23 34 35 32 31 E1 BD 7E
[<<] RECEPTOR - Procesando trama recibida
Número de secuencia: 0
CRC recibido: 0xE1BD
CRC calculado: 0xE1BD
[OK] Trama valida recibida
Mensaje: "Solicitud de historial clínico paciente #4521"
[OK] ACK recibido - Trama 0 confirmada

vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
[>>] Comunicacion 2/5: VLAN 20 (Clínica)
======================================================================
[>>] TRANSMISOR - Enviando trama con SEQ=1
Mensaje: "Confirmación de turno para tratamiento de conducto"
Trama (56 bytes): 7E 01 43 6F 6E 66 69 72 6D 61 63 69 C3 B3 6E 20 64 65 20 74 75 72 6E 6F 20 70 61 72 61 20 74 72 61 74 61 6D 69 65 6E 74 6F 20 64 65 20 63 6F 6E 64 75 63 74 6F 2F A6 7E
[<<] RECEPTOR - Procesando trama recibida
Número de secuencia: 1
CRC recibido: 0x2FA6
CRC calculado: 0x2FA6
[OK] Trama valida recibida
Mensaje: "Confirmación de turno para tratamiento de conducto"
[OK] ACK recibido - Trama 1 confirmada

... (mensajes 3, 4 y 5 similares) ...

======================================================================
[*] RESUMEN DE TRANSMISION
======================================================================
[OK] Mensajes exitosos: 5/5
[X] Mensajes fallidos: 0/5
[%] Tasa de exito: 100.0%
======================================================================
> Demostracion completada

Interpretación de la Salida

Trama: Cada mensaje se convierte en una secuencia de bytes, comenzando y terminando con el byte de bandera 7E.

Número de secuencia (SEQ): Permite al receptor identificar y confirmar cada trama.

CRC: Es el valor de verificación que asegura que el mensaje no sufrió errores en la transmisión. Si el CRC calculado coincide con el recibido, la trama es válida.

ACK: Confirmación que envía el receptor al transmisor indicando que la trama fue recibida correctamente.

Resumen final: Permite verificar la tasa de éxito de la transmisión, mostrando la eficiencia del protocolo implementado.
