### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Nuevo producto |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Título | Texto | Sí | Recortado; no vacío | Vacío | No | — | — | El título es obligatorio. | Front, BD |
| Identificador URL | Texto | No | — | Vacío | No | — | — | — | Front |
| Descripción | Texto largo | Sí | Recortado; no vacío | Vacío | No | — | — | La descripción es obligatoria. | Front |
| Proveedor | Texto | Sí | Recortado; no vacío | Vacío | No | — | — | El proveedor es obligatorio. | Front |
| Categoría producto | Texto | Sí | Recortado; no vacío | Vacío | No | — | — | La categoría es obligatoria. | Front |
| Tipo | Selección | Sí | Primario / Secundario | Primario | No | — | Si el valor contiene "secund", exige Incluido primario | El tipo es obligatorio. / Selecciona el producto primario incluido. | Front |
| Etiquetas | Texto | No | — | Vacío | No | — | — | — | Front |
| Publicado en tienda online | Booleano | No | true / false | false | No | — | — | — | Front |
| Estado | Selección | Sí | BUEN ESTADO / NO DISPONIBLE / draft | BUEN ESTADO | No | — | — | El estado es obligatorio. | Front |
| SKU | Texto | No en UI; Sí al persistir | Recortado; si queda vacío se genera con `generateCodigoCuentaFromNombre(título)` (5 caracteres base 36) | Vacío (se genera al guardar) | Sí, por cuenta (`uq_producto_cuenta_sku`) | Título | Si el usuario no escribe SKU, se deriva del título | El SKU es obligatorio. / No se pudo crear el producto. | Front, BD |
| Código de barras | Texto | No | — | Vacío | No | — | — | — | Front |
| Nombre opción 1 | Texto | No | — | Vacío | No | — | — | — | Front |
| Valor opción 1 | Texto | No | — | Vacío | No | — | — | — | Front |
| Vinculado a opción 1 | Texto | No | — | Vacío | No | — | — | — | Front |
| Cobrar impuesto | Booleano | No | true / false | false | No | — | — | — | Front |
| Rastreador inventario | Texto | No | — | Vacío | No | — | — | — | Front |
| Cantidad inventario | Texto | No | — | 0 | No | — | — | — | Front |
| Continuar vendiendo sin stock | Booleano | No | true / false | false | No | — | — | — | Front |
| Valor peso (g) | Texto | No | — | Vacío | No | — | — | — | Front |
| Unidad | Selección | Sí | kg, g, und, caja, pieza, paquete, bolsa, lb, oz, l, ml | kg | No | — | — | La unidad es obligatoria. | Front |
| Unidad de visualización | Selección | Sí | Catálogo CATALOGO_UNIDAD_VISUALIZACION_LIST (cantidad, und, pieza, par, docena, caja, paquete, bolsa, bandeja, pallet, bulto, peso, g, kg, lb, oz, ton, ml, l, gal, m, cm) | cantidad | No | — | — | — | Front |
| Incluido primario | Selección UUID | Condicional | Productos primarios activos de la cuenta | Vacío (placeholder — Sin vínculo —) | No | Tipo | Obligatorio si Tipo es Secundario | Selecciona el producto primario incluido. | Front |
| Requiere envío | Booleano | No | true / false | true | No | — | — | — | Front |
| Servicio logística | Texto | No | — | Vacío | No | — | — | — | Front |
| Incluido internacional | Booleano | No | true / false | false | No | — | — | — | Front |
| URL imagen producto | Texto | No | — | Vacío | No | — | — | — | Front |
| Posición imagen | Texto | No | — | Vacío | No | — | — | — | Front |
| Texto alt imagen | Texto | No | — | Vacío | No | — | — | — | Front |
| URL imagen variante | Texto | No | — | Vacío | No | — | — | — | Front |
| Tarjeta regalo | Booleano | No | true / false | false | No | — | — | — | Front |
| Título SEO | Texto | No | — | Vacío | No | — | — | — | Front |
| Descripción SEO | Texto largo | No | — | Vacío | No | — | — | — | Front |
| Google shopping categoría producto | Texto | No | — | Vacío | No | — | — | — | Front |
| Metacampos | Texto largo | No | — | Vacío | No | — | — | — | Front |

Errores de contexto (no son de un campo): `No se encontró la cuenta activa.` / `No se pudo crear el producto.`

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Título | 1 | Sí mientras se envía | Sí, al abrir el modal |
| Identificador URL | 2 | Sí mientras se envía | — |
| Descripción | 3 | Sí mientras se envía | — |
| Proveedor | 4 | Sí mientras se envía | — |
| Categoría producto | 5 | Sí mientras se envía | — |
| Tipo | 6 | Sí mientras se envía | — |
| Etiquetas | 7 | Sí mientras se envía | — |
| Publicado en tienda online | 8 | Sí mientras se envía | — |
| Estado | 9 | Sí mientras se envía | — |
| SKU | 10 | Sí mientras se envía | — |
| Código de barras | 11 | Sí mientras se envía | — |
| Nombre opción 1 | 12 | Sí mientras se envía | — |
| Valor opción 1 | 13 | Sí mientras se envía | — |
| Vinculado a opción 1 | 14 | Sí mientras se envía | — |
| Cobrar impuesto | 15 | Sí mientras se envía | — |
| Rastreador inventario | 16 | Sí mientras se envía | — |
| Cantidad inventario | 17 | Sí mientras se envía | — |
| Continuar vendiendo sin stock | 18 | Sí mientras se envía | — |
| Valor peso (g) | 19 | Sí mientras se envía | — |
| Unidad | 20 | Sí mientras se envía | — |
| Unidad de visualización | 21 | Sí mientras se envía | — |
| Incluido primario | 22 | Sí mientras se envía | — |
| Requiere envío | 23 | Sí mientras se envía | — |
| Servicio logística | 24 | Sí mientras se envía | — |
| Incluido internacional | 25 | Sí mientras se envía | — |
| URL imagen producto | 26 | Sí mientras se envía | — |
| Posición imagen | 27 | Sí mientras se envía | — |
| Texto alt imagen | 28 | Sí mientras se envía | — |
| URL imagen variante | 29 | Sí mientras se envía | — |
| Tarjeta regalo | 30 | Sí mientras se envía | — |
| Título SEO | 31 | Sí mientras se envía | — |
| Descripción SEO | 32 | Sí mientras se envía | — |
| Google shopping categoría producto | 33 | Sí mientras se envía | — |
| Metacampos | 34 | Sí mientras se envía | — |

### Notas y justificaciones

Formulario Shopify-like de `ProductoCatalogoCreateModal`. El SKU vacío se genera del título; la unicidad es por `codigo_cuenta` + `sku` en BD. `precio`, `basePrimario`, `gramosPorUnidad` y `mermaPct` existen en metadatos pero no se renderizan aquí. Opciones de Incluido primario se cargan de BD al abrir, sin prellenar el valor.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
