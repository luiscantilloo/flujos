### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear equivalencia de producto |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Comprador | Texto (solo lectura) | Sí | Muestra "codigo — comprador" | formatCompradorLabel(comprador) | No | Comprador del modal padre | El modal no abre si comprador es null | No se encontró el comprador. / Selecciona un comprador. | Front, Back, BD |
| Buscar producto | Texto (filtro; no se envía) | No | Filtra código, nombre, equivalencia, precio y unidad (NFD, tokens) | — | No | Lista de productos | Solo se renderiza si hay más de 4 productos | No hay productos que coincidan con la búsqueda. / No hay productos en el catálogo. | Front |
| Código | Texto (columna de grilla) | — | Código de catálogo; no editable | producto.codigo | No | Producto de fila | — | — | Front, BD |
| Nombre | Texto (columna de grilla) | — | Título de catálogo; no editable | producto.titulo | No | Producto de fila | — | — | Front, BD |
| Equivalencia | Texto | Sí (al menos una fila nueva con texto) | varchar(255); placeholder "—" | "" en productos sin alias; alias existente si ya hay fila | Sí (id_comprador + id_producto: uq_comprador_producto_alias) | Producto de fila | Solo se guardan filas sin alias previo cuyo draft.alias tenga texto; productos con alias existente quedan bloqueados | Escribe al menos una equivalencia nueva. / La equivalencia de {codigo} supera 255 caracteres. / La equivalencia es obligatoria. / La equivalencia no puede superar 255 caracteres. / Este comprador ya tiene una equivalencia para ese producto. / Selecciona un producto del catálogo. | Front, Back, BD |
| Precio | Número decimal (texto, inputMode=decimal) | No | numeric(12,4); ≥ 0; vacío en create con cambio respecto a lista → null (usar lista default); parseDecimalEs acepta coma o punto | Precio vigente de lista (precio_producto) de ese producto | No | Producto de fila; lista de precios | Si el valor coincide con la lista (1e-9) se guarda null (sin override) | Ingresa un precio válido para {codigo}. / Ingresa un precio válido (0 o mayor). | Front, Back, BD |
| Unidad | Texto (columna de grilla) | — | Unidad de catálogo; no editable | producto.unidad | No | Producto de fila | — | — | Front, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Comprador | 1 | Sí (siempre, readOnly) | — |
| Buscar producto | 2 | No | — |
| Equivalencia (por fila) | 3+ (por producto visible) | Sí si el producto ya tiene alias; No si es alta nueva | — |
| Precio (por fila) | Sigue a Equivalencia de la misma fila | Sí si el producto ya tiene alias; No si es alta nueva | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Comprador | Sí | Información de BD | No |
| Código | Sí | Información de BD | No |
| Nombre | Sí | Información de BD | No |
| Equivalencia (existente) | Sí | Información de BD | No |
| Precio | Sí | Información de BD | Sí |
| Unidad | Sí | Información de BD | No |

### Notas y justificaciones

Modal elevado sobre Editar comprador (`stackLevel="elevated"`). Guardar está deshabilitado si pendingCreates.length === 0 o aún cargan las listas. Sin cuenta: "No se encontró la cuenta activa.". Carga fallida: "No se pudieron cargar los productos.". Mutación: DomainServiceError o "No se pudo guardar la equivalencia.". El submit recorre cada equivalencia nueva y llama createCompradorProductoAliasAdmin. Descripción: "Equivalencia y precio solo de este comprador. Si no cambias el precio, se usa la lista default."

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
