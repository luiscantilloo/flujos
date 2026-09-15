### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Vincular bodega interna |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cuenta | Texto (solo lectura) | Sí | Código de cuenta de la sesión | Código de cuenta activa o — | No | Sesión / tenant | Se muestra; no se edita | No se encontró el contexto de cuenta o empresa. | Front |
| Listado (bodega interna) | Selección UUID (lista de botones) | Sí | Bodegas internas disponibles no vinculadas a la cuenta | Ninguna seleccionada | Sí para el vínculo cuenta-bodega | Cuenta y empresa | Solo aparecen bodegas de `listBodegasInternasDisponiblesAdmin` | Selecciona una bodega del listado. / No se pudieron cargar las bodegas disponibles. / No se pudo vincular la bodega. | Front, BD |

Vacío de opciones: `No hay bodegas internas disponibles para vincular.`

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Cuenta | — | Sí siempre (solo lectura) | — |
| Listado (bodega interna) | 1…n según el orden del listado | Sí mientras carga opciones o se envía | — |

### Notas y justificaciones

No hay input de texto: el usuario elige una fila del listado y confirma con "Vincular ahora". La cuenta se muestra como contexto.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
