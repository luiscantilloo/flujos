### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Lista de precio |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | No |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí, información de BD |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Búsqueda | Texto | No | Filtra filas en cliente | Vacío | No | — | No se persiste; filtra Código / Producto / Unidad | — | Front |
| Código | Texto (solo lectura) | — | — | Código de almacén / SKU del producto | No | Producto | Columna de tabla | — | Front |
| Producto | Texto (solo lectura) | — | — | Título del catálogo | No | Producto | Columna de tabla | — | Front |
| Unidad | Texto (solo lectura) | — | — | Unidad del producto o — | No | Producto | Columna de tabla | — | Front |
| Precio default | Decimal | Sí, en cada fila editada | ≥ 0; acepta coma o punto (`parseDecimalEs`); vacío no permitido en filas sucias | Precio vigente de `precio_producto` o vacío (placeholder Sin precio) | No | Producto de la fila | Solo se envían filas con valor distinto al vigente | Todos los precios editados deben tener un valor (0 o mayor). / Ingresa un precio válido (0 o mayor). / No se pudo guardar la lista de precios. | Front, BD |
| Estado | Texto (solo lectura) | — | Activo / Inactivo | `esta_activo` del producto | No | Producto | Columna de tabla | — | Front |

Error de contexto: `No se encontró la cuenta activa.`

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Búsqueda | 1 | No | — |
| Precio default (por fila) | 2…n según el orden de filas visibles | No (el clic no abre otra pantalla; `stopPropagation` en el input) | — |
| Guardar | Después de los precios | Sí si no hay filas sucias, si se está guardando, o si no hay cuenta | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Código | Sí | Información de BD | No |
| Producto | Sí | Información de BD | No |
| Unidad | Sí | Información de BD | No |
| Precio default | Sí | Información de BD | Sí |
| Estado | Sí | Información de BD | No |

### Notas y justificaciones

Pantalla `ListaPrecioListView`, no modal. Guardar inserta un nuevo registro de precio vigente (historial); no actualiza in-place. Las equivalencias de comprador no modifican estos precios.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
