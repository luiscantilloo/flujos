### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear producto secundario |
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
| Descripción | Texto largo | Sí | Recortado; no vacío | Vacío | No | — | — | La descripción es obligatoria. | Front |
| Proveedor | Selección | Sí | Proveedores de la cuenta; si el valor actual no está en la lista se agrega | Vacío | No | — | Opciones desde `listProveedoresAdmin` | El proveedor es obligatorio. | Front |
| Categoría producto | Selección | Sí | CARNICOS, PESCADOS, AVES, EMBUTIDOS, MARISCOS, LACTEOS, CONGELADOS, GENERAL, más categorías ya usadas en el catálogo | Vacío | No | — | Opciones base + categorías del catálogo | La categoría es obligatoria. | Front |
| Estado | Selección | Sí | BUEN ESTADO / NO DISPONIBLE / draft | BUEN ESTADO | No | — | — | El estado es obligatorio. | Front |
| Tipo | Texto (solo lectura) | Sí | Fijo Secundario | Secundario | No | — | Siempre Secundario; no editable | — | Front |
| Unidad | Selección | Sí | kg, g, und, caja, pieza, paquete, bolsa, lb, oz, l, ml | kg | No | — | — | La unidad es obligatoria. | Front |
| Unidad de visualización | Picker | Sí | Catálogo CATALOGO_UNIDAD_VISUALIZACION_LIST | cantidad | No | — | Se elige en `CatalogoUnidadVisualizacionPickerModal` | — | Front |
| Base primario | Texto (solo lectura) | Sí | Fijo 1000 g | 1000 g | No | — | Constante `CATALOGO_BASE_PRIMARIO_LABEL` | — | Front |
| G por unidad | Número decimal | Sí | Mayor a cero; acepta coma o punto | 200 | No | — | Unidades por kg = 1000 / g por unidad | Los gramos por unidad deben ser mayores a cero. / No se pudo calcular la relación de conversión. | Front |
| Merma (%) | Número decimal | No | 0 a 100 inclusive; acepta coma o punto | 0 | No | — | Si está fuera de rango no se puede guardar | El % de merma debe estar entre 0 y 100. | Front |
| Incluido primario | Picker UUID | Sí | Primarios activos de la cuenta | Vacío | No | — | Se elige en `CatalogoPrimarioPickerModal` | Selecciona el producto primario incluido. | Front |

SKU no se muestra: se genera del título. Si la generación falla: `No se pudo generar el SKU del producto secundario.` Unicidad por cuenta en BD (`uq_producto_cuenta_sku`).

Errores de contexto: `No se encontró la cuenta activa.` / `No se pudo crear el producto secundario.`

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Título | 1 | Sí mientras carga opciones o se envía | Sí, al abrir el modal |
| Descripción | 2 | Sí mientras carga opciones o se envía | — |
| Proveedor | 3 | Sí mientras carga opciones o se envía | — |
| Categoría producto | 4 | Sí mientras carga opciones o se envía | — |
| Estado | 5 | Sí mientras carga opciones o se envía | — |
| Tipo | 6 | Sí siempre (readOnly + disabled) | — |
| Unidad | 7 | Sí mientras carga opciones o se envía | — |
| Unidad de visualización | 8 | Sí mientras carga opciones o se envía | — |
| Base primario | 9 | Sí siempre (solo lectura) | — |
| G por unidad | 10 | Sí mientras carga opciones o se envía | — |
| Merma (%) | 11 | Sí mientras carga opciones o se envía | — |
| Incluido primario | 12 | Sí mientras carga opciones o se envía | — |

### Notas y justificaciones

La vista previa de conversión (u/kg y merma) es calculada, no es un campo editable. El SKU se genera del título y no hay input. Proveedor y categoría cargan opciones de BD al abrir, sin prellenar el valor elegido.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
