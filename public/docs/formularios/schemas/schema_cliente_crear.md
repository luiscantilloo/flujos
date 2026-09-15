### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear cliente |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nombre | Texto | Sí | varchar(255); se recorta; genera el código interno | — | No | — | El código se genera con generateCodigoCuentaFromNombre(nombre); no se muestra | El nombre del cliente es obligatorio. / No se pudo generar el código del cliente. | Front, Back, BD |
| NIT | Texto | Sí | varchar(32); se quitan espacios; debe cumplir /^[\d-]+$/ y al menos 5 dígitos | — | No | — | normalizeNitInput + isValidNit en el servicio | El NIT del cliente es obligatorio. / El NIT del cliente no es válido. | Front, Back, BD |
| Teléfono | Teléfono internacional E.164 | No | Si hay valor, isValidInternationalPhone; se normaliza; vacío → null | — | No | — | — | Ingresa un número de teléfono válido. / El teléfono del cliente no es válido. | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Nombre | 1 | No | Sí, al abrir el modal |
| NIT | 2 | No | — |
| Teléfono | 3 | No | — |

### Notas y justificaciones

Sin cuenta: "No se encontró la cuenta activa.". El código (varchar(32), único por cuenta: uq_cliente_cuenta_codigo) no es campo de UI. Hint del teléfono: "Opcional. Formato internacional.". Si falla: DomainServiceError o "No se pudo crear el cliente.".

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
