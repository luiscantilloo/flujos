### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear planta |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nombre | Texto | Sí | varchar(255); se recorta; genera el código interno | — | No | — | El código se genera con generateCodigoCuentaFromNombre(nombre); no se muestra | El nombre de la planta es obligatorio. / No se pudo generar el código de la planta. | Front, Back, BD |
| Dirección | Texto | Sí | text; se recorta | — | No | — | — | La dirección de la planta es obligatoria. | Front, Back, BD |
| Cap. pallets | Número entero | No | type=number; min=0; step=1; vacío → null; si hay valor debe ser entero > 0 | — | No | — | parseOptionalIntegerInput en el modal; parseOptionalPositiveInteger en el servicio | La capacidad de pallets debe ser un entero mayor a cero. | Front, Back, BD |
| Rango térmico | Texto | No | varchar(64); vacío → null | — | No | — | — | — | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Nombre | 1 | No | Sí, al abrir el modal |
| Dirección | 2 | No | — |
| Cap. pallets | 3 | No | — |
| Rango térmico | 4 | No | — |

### Notas y justificaciones

Sin cuenta: "No se encontró la cuenta activa.". El código (varchar(32), único por cuenta: uq_planta_cuenta_codigo) no es campo de UI. Si falla: DomainServiceError o "No se pudo crear la planta.". Placeholder de rango: "Ej. -18°C a 4°C".

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
