Ejecución del Código – Protocolo de Capa de Enlace de Datos

Se desarrolló un programa en JavaScript que simula la transmisión de mensajes entre distintas VLAN de una clínica odontológica, aplicando enmarcado de tramas, números de secuencia y verificación de errores (CRC).

El programa se ejecuta con el siguiente comando:

node .\redes.js

Salida del Programa
PROTOCOLO DE CAPA DE ENLACE DE DATOS
Clínica Odontológica Coronel Rodríguez
Medio: UTP Cat 6 + Fibra óptica OM3
======================================================================

[*] Iniciando transmision de mensajes...

vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
[>>] Comunicacion 1/5: VLAN 10 (Administración)
[>>] TRANSMISOR - Enviando trama con SEQ=0
Mensaje: "Solicitud de historial clínico paciente #4521"
[<<] RECEPTOR - Procesando trama recibida
[OK] Trama valida recibida
[OK] ACK recibido - Trama 0 confirmada

vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
[>>] Comunicacion 2/5: VLAN 20 (Clínica)
[>>] TRANSMISOR - Enviando trama con SEQ=1
Mensaje: "Confirmación de turno para tratamiento de conducto"
[<<] RECEPTOR - Procesando trama recibida
[OK] Trama valida recibida
[OK] ACK recibido - Trama 1 confirmada

vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
[>>] Comunicacion 3/5: VLAN 30 (Servidores)
[>>] TRANSMISOR - Enviando trama con SEQ=2
Mensaje: "Backup de base de datos completado exitosamente"
[<<] RECEPTOR - Procesando trama recibida
[OK] Trama valida recibida
[OK] ACK recibido - Trama 2 confirmada

vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
[>>] Comunicacion 4/5: VLAN 10 → VLAN 30
[>>] TRANSMISOR - Enviando trama con SEQ=3
Mensaje: "Actualización de datos de facturación mensual"
[<<] RECEPTOR - Procesando trama recibida
[OK] Trama valida recibida
[OK] ACK recibido - Trama 3 confirmada

vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
[>>] Comunicacion 5/5: VLAN 20 → VLAN 30
[>>] TRANSMISOR - Enviando trama con SEQ=4
Mensaje: "Registro de nuevo paciente en sistema"
[<<] RECEPTOR - Procesando trama recibida
[OK] Trama valida recibida
[OK] ACK recibido - Trama 4 confirmada

======================================================================
[*] RESUMEN DE TRANSMISION
[OK] Mensajes exitosos: 5/5
[X] Mensajes fallidos: 0/5
[%] Tasa de exito: 100.0%
======================================================================
> Demostracion completada


Notas sobre la salida:

Cada mensaje se envía como una trama con número de secuencia y CRC.

El receptor valida el CRC y confirma la recepción con un ACK.

Al final, el resumen muestra que todas las transmisiones fueron exitosas, con 100% de tasa de éxito.
