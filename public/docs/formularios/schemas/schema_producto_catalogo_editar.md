### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar producto |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí, información de BD |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Título | Texto | Sí | Recortado; no vacío | Vacío hasta cargar BD | No | — | — | El título es obligatorio. | Front, BD |
| Identificador URL | Texto | No | — | Vacío hasta cargar BD | No | — | — | — | Front |
| Descripción | Texto largo | Sí | Recortado; no vacío | Vacío hasta cargar BD | No | — | — | La descripción es obligatoria. | Front |
| Proveedor | Texto | Sí | Recortado; no vacío | Vacío hasta cargar BD | No | — | — | El proveedor es obligatorio. | Front |
| Categoría producto | Texto | Sí | Recortado; no vacío | Vacío hasta cargar BD | No | — | — | La categoría es obligatoria. | Front |
| Tipo | Selección | Sí | Primario / Secundario | Primario hasta cargar BD | No | — | Si el valor contiene "secund", exige Incluido primario | El tipo es obligatorio. / Selecciona el producto primario incluido. | Front |
| Etiquetas | Texto | No | — | Vacío hasta cargar BD | No | — | — | — | Front |
| Publicado en tienda online | Booleano | No | true / false | false hasta cargar BD | No | — | — | — | Front |
| Estado | Selección | Sí | BUEN ESTADO / NO DISPONIBLE / draft; si el valor guardado no está en la lista se agrega como opción extra | BUEN ESTADO hasta cargar BD | No | — | — | El estado es obligatorio. | Front |
| SKU | Texto | No en UI; Sí al persistir | Recortado; si queda vacío se genera con `generateCodigoCuentaFromNombre(título)` | Vacío hasta cargar BD | Sí, por cuenta (`uq_producto_cuenta_sku`) | Título | Si el usuario borra el SKU, se regenera del título | El SKU es obligatorio. / No se pudo actualizar el producto. | Front, BD |
| Código de barras | Texto | No | — | Vacío hasta cargar BD | No | — | — | — | Front |
| Cobrar impuesto | Booleano | No | true / false | false hasta cargar BD | No | — | — | — | Front |
| Rastreador inventario | Texto | No | — | Vacío hasta cargar BD | No | — | — | — | Front |
| Cantidad inventario | Texto | No | — | 0 hasta cargar BD | No | — | — | — | Front |
| Unidad | Selección | Sí | kg, g, und, caja, pieza, paquete, bolsa, lb, oz, l, ml; valor guardado fuera de lista se agrega como opción | kg hasta cargar BD | No | — | — | La unidad es obligatoria. | Front |
| Unidad de visualización | Selección | Sí | Catálogo CATALOGO_UNIDAD_VISUALIZACION_LIST | cantidad hasta cargar BD | No | — | — | — | Front |
| Incluido primario | Selección UUID | Condicional | Productos primarios activos de la cuenta | Vacío (placeholder — Sin vínculo —) | No | Tipo | Obligatorio si Tipo es Secundario | Selecciona el producto primario incluido. | Front |

Errores de contexto: `No se encontró la cuenta o el producto.` / `No se encontró el producto.` / `No se pudo cargar el producto.` / `No se pudo actualizar el producto.`

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Título | 1 | Sí mientras carga o se envía | Sí, al terminar la carga y mostrar el formulario |
| Identificador URL | 2 | Sí mientras carga o se envía | — |
| Descripción | 3 | Sí mientras carga o se envía | — |
| Proveedor | 4 | Sí mientras carga o se envía | — |
| Categoría producto | 5 | Sí mientras carga o se envía | — |
| Tipo | 6 | Sí mientras carga o se envía | — |
| Etiquetas | 7 | Sí mientras carga o se envía | — |
| Publicado en tienda online | 8 | Sí mientras carga o se envía | — |
| Estado | 9 | Sí mientras carga o se envía | — |
| SKU | 10 | Sí mientras carga o se envía | — |
| Código de barras | 11 | Sí mientras carga o se envía | — |
| Cobrar impuesto | 12 | Sí mientras carga o se envía | — |
| Rastreador inventario | 13 | Sí mientras carga o se envía | — |
| Cantidad inventario | 14 | Sí mientras carga o se envía | — |
| Unidad | 15 | Sí mientras carga o se envía | — |
| Unidad de visualización | 16 | Sí mientras carga o se envía | — |
| Incluido primario | 17 | Sí mientras carga o se envía | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Título | Sí | Información de BD | Sí |
| Identificador URL | Sí | Información de BD | Sí |
| Descripción | Sí | Información de BD | Sí |
| Proveedor | Sí | Información de BD | Sí |
| Categoría producto | Sí | Información de BD | Sí |
| Tipo | Sí | Información de BD | Sí |
| Etiquetas | Sí | Información de BD | Sí |
| Publicado en tienda online | Sí | Información de BD | Sí |
| Estado | Sí | Información de BD | Sí |
| SKU | Sí | Información de BD | Sí |
| Código de barras | Sí | Información de BD | Sí |
| Cobrar impuesto | Sí | Información de BD | Sí |
| Rastreador inventario | Sí | Información de BD | Sí |
| Cantidad inventario | Sí | Información de BD | Sí |
| Unidad | Sí | Información de BD | Sí |
| Unidad de visualización | Sí | Información de BD | Sí |
| Incluido primario | Sí | Información de BD | Sí |

### Notas y justificaciones

`ProductoCatalogoEditModal` renderiza un subconjunto del alta: no muestra opción 1, peso, checkboxes de stock/envío/internacional/regalo, imágenes, SEO ni metacampos. Mientras carga muestra "Cargando producto…".

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
