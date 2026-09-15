### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Nueva solicitud de compra |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Proveedor | Picker UUID | Sí | Proveedores de la cuenta | Vacío | No | — | Se elige en `SolicitudProveedorPickerModal` | Selecciona un proveedor para la solicitud. | Front, Back, BD |
| Producto (subformulario de línea) | Picker UUID | Sí para agregar línea | Productos del catálogo de la cuenta | Vacío; se limpia al agregar | No | — | Se elige en `SolicitudProductoPickerModal` | Selecciona un producto del catálogo. / Selecciona un producto en la línea N. | Front, Back, BD |
| Peso (kg) (subformulario de línea) | Decimal | Sí para agregar línea | Mayor a 0; acepta coma (`parseDecimalEs`) | Vacío; se limpia al agregar | No | Producto | Solo se habilita si hay productos | Ingresa un peso en kg mayor a 0 (podés usar coma: 15,6). / La cantidad de la línea N debe ser mayor a cero. | Front, Back, BD |
| Líneas | Lista | Sí (≥ 1) | Cada línea: idProducto + pesoKg > 0 | Lista vacía | No (Back rechaza productos duplicados) | Producto + Peso (kg) | Se arma con Agregar; se quita con el icono de basura | Agrega al menos una línea con productos del catálogo. / Agrega al menos una línea de producto. / Hay productos duplicados en las líneas | Front, Back, BD |

Bodega interna no se muestra: se toma `activeBodegaId` o la primera vinculada. Errores: `No hay bodega interna disponible para registrar la solicitud.` / `No se encontró la cuenta activa.` / `No se encontró la bodega activa.` / `No se pudieron cargar productos o proveedores.` / `No se pudo guardar la solicitud.`

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Proveedor | 1 | Sí mientras carga o se envía, o si no hay proveedores | — |
| Producto (subformulario de línea) | 2 | Sí mientras carga o se envía, o si no hay productos | — |
| Peso (kg) (subformulario de línea) | 3 | Sí mientras carga o se envía, o si no hay productos | — |
| Agregar | 4 | Sí mientras carga o se envía, o si no hay productos | — |
| Quitar línea | Por fila, después de Agregar | No (salvo envío en curso del modal padre) | — |

### Notas y justificaciones

SOL de `SolicitudCompraCreateModal`. La bodega no es un campo visible. Si el proveedor tiene teléfono, tras guardar se notifica a n8n (best-effort; el fallo de n8n no revierte la SOL). El Back además valida que no haya productos duplicados en las líneas.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
