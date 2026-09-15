### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Solicitar integración |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bodega externa | Picker UUID | Sí | Bodegas externas ya vinculadas a la cuenta | Vacío | No | — | Se elige en `IntegracionBodegaExternaPickerModal`; exige id y nombre | Selecciona una bodega externa. / Selecciona una bodega externa válida. / Selecciona una bodega externa válida | Front, Back, BD |
| Tipo de integración | Picker enum | Sí | scraping / api / csv_plano (labels Scraping / API / CSV plano) | scraping | No | — | Se elige en `IntegracionTipoPickerModal`; el Back exige `@IsEnum` | — | Front, Back, BD |

Errores de contexto: `No se encontró la cuenta activa.` / `No se encontró el usuario solicitante.` / `No se pudieron cargar las bodegas externas.` / `No se pudo registrar la solicitud de integración.` / `No hay clientes activos en la cuenta para registrar la solicitud`

El solicitante (`idSolicitante`) no es un campo visible: sale de la sesión.

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Bodega externa | 1 | Sí mientras carga bodegas o se envía, o si no hay bodegas | — |
| Tipo de integración | 2 | Sí mientras se envía | — |

### Notas y justificaciones

`SolicitudIntegracionCreateModal`. Tipo arranca en scraping por constante de UI, no por un registro de BD. La API Nest resuelve el cliente de la cuenta en servidor (no se pide en el formulario).

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
