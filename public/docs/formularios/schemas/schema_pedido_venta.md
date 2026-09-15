### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Pedido de venta (nuevo / editar) |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí, ambos |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cliente (paso documentos) | Picker UUID | Sí para leer con IA | Compradores de la cuenta | Vacío | No | — | Se elige en `OrdenVentaCompradorPickerModal` | Selecciona un cliente. | Front |
| Texto del pedido | Texto largo | Condicional | — | Vacío | No | — | Obligatorio junto con Archivos: al menos uno para "Leer y llenar el formulario" | Pega el texto del pedido o adjunta al menos un archivo. | Front |
| Archivos | Archivos múltiples | Condicional | PDF, Excel, CSV, Word, eml, html, imágenes; otros se guardan sin leerse | Lista vacía | No | — | Misma regla que Texto del pedido | Pega el texto del pedido o adjunta al menos un archivo. / No se pudo leer el pedido. Intenta de nuevo. | Front |
| Cliente | Picker UUID | Sí | Compradores de la cuenta | Vacío (en edición: comprador de la OV) | No | — | Precios y alias dependen del cliente | Selecciona un cliente. / Se seleccionó el cliente, pero no se pudieron cargar sus datos de alta. | Front, Back, BD |
| Orden de compra del hotel | Texto | Condicional | Recortado | Vacío | No | Ficha del cliente (`exigeOc`) | Obligatorio si la ficha tiene exige OC = Sí | Este cliente exige orden de compra para facturar. Captúrala en el pedido. | Front |
| Centro de consumo / cocina | Texto | No | — | Vacío | No | Cliente / IA | — | — | Front |
| Vendedor | Texto (solo lectura) | No | Nombre de la sesión | Nombre de `session.nombre` o — | No | Sesión | No editable | — | Front |
| Fecha de entrega | Fecha | Sí | `min` = hoy ISO; no anterior a hoy | Vacío (IA: fecha extraída o mañana) | No | — | `validatePedidoCabecera` | Ingresa la fecha de entrega. / La fecha de entrega no puede ser anterior a hoy. | Front |
| Ventana de entrega — desde | Hora | No | `type=time`; no mayor que hasta si ambos tienen valor | Vacío | No | Ventana de entrega — hasta | `isVentanaDesdeMayorQueHasta` | La ventana "desde" no puede ser mayor que "hasta". | Front |
| Ventana de entrega — hasta | Hora | No | `type=time`; no menor que desde si ambos tienen valor | Vacío | No | Ventana de entrega — desde | Misma regla | La ventana "desde" no puede ser mayor que "hasta". | Front |
| Prioridad | Selección | No | Normal / Urgente / Programado | Normal | No | — | — | — | Front |
| Moneda | Selección | No | MXN / USD | MXN | No | Cliente | Prefill desde ficha si MXN o USD | — | Front |
| Bodega destino | Selección UUID | Sí | Bodegas internas y externas vinculadas | Bodega default de la cuenta, o la única disponible, o vacía | No | Cuenta | Placeholder Selecciona una bodega | Selecciona una bodega destino. / La bodega destino no está activa | Front, Back, BD |
| Observaciones | Texto | No | Placeholder Notas para almacén | Vacío | No | Cliente / IA | En IA, si hay ficha e IA distintas se concatenan | — | Front |
| Dirección de entrega | Texto | No | — | Vacío | No | Cliente / IA | — | — | Front |
| Andén / punto de recepción | Texto | No | — | Vacío | No | Cliente / IA | — | — | Front |
| Contacto en el hotel | Texto | No | — | Vacío | No | Cliente / IA | — | — | Front |
| Teléfono del contacto | Teléfono | No | — | Vacío | No | Cliente / IA | — | — | Front |
| Producto (línea) | Picker UUID | Sí (≥ 1 línea) | Productos de venta de la cuenta; no se duplica el mismo `idProducto` | — | Único dentro del pedido (no se agrega si ya está) | Catálogo de venta | Se agrega con "Agregar producto" / `OrdenVentaProductoPickerModal` | Agrega al menos un producto a la venta. | Front, Back, BD |
| Cantidad (línea) | Decimal | Sí por línea | Mayor a 0; `parseDecimalEs`; placeholder 0 | Vacío | No | Producto | Tras elegir producto, el foco va a cantidad | Ingresa una cantidad válida para {nombre}. | Front |
| Unidad (línea) | Texto (solo lectura) | No | Unidad del catálogo | kg (`UNIDAD_MEDIDA_VENTA_DEFAULT`) si el producto no trae unidad | No | Producto | `disabled` + `tabIndex=-1` | — | Front |
| Especificación (línea) | Texto | No | — | Vacío | No | Producto / IA | Se persiste en `notas_lineas` | — | Front |
| Desc% (línea) | Decimal | No | 0–100 en el cálculo de importe | 0 (o vacío mostrado como 0) | No | — | Input deshabilitado; no se captura en UI | — | Front |
| Precio (línea) | Decimal | Sí por línea | Mayor a 0 | Precio de lista / override de alias del comprador | No | Producto y Cliente | Override de `listCompradorProductoAliasAdmin` si existe | Ingresa un precio mayor a cero para {nombre}. | Front, BD |
| IVA (línea) | Selección | No | 0% / 8% / 16% | 0 | No | — | Se anota en `notas_lineas` si ≠ 0 | — | Front |
| Importe (línea) | Decimal (calculado) | — | cantidad × precio − descuento | 0 | No | Cantidad, Precio, Desc% | Solo lectura | — | Front |
| Peso total (kg) | Decimal (calculado) | — | Suma de cantidades | 0 | No | Cantidades | Solo lectura | — | Front |
| Razón social | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |
| RFC | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |
| Régimen | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |
| CP fiscal | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |
| Uso CFDI | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |
| Método de pago | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |
| Forma de pago | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |
| Correos CFDI | Texto (solo lectura) | — | — | Ficha del comprador o — | No | Cliente | Sección Datos fiscales | — | Front |

Errores de contexto: `No hay cuenta activa.` / `No se pudieron cargar los datos del formulario.` / `No se pudo crear la orden de venta.` / `No se pudieron guardar los cambios.` / `No se pudo enviar el pedido a la bodega destino.` / `La orden de venta no es válida.` Avisos IA: `No se reconocieron productos del catálogo. Revisa el pedido y agrégalos a mano.` / `No se pudieron leer: {archivos}. Se guardan como respaldo.`

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Cliente (paso documentos) | 1 (paso docs) | No (salvo envío/lectura IA) | — |
| Texto del pedido | 2 (paso docs) | No | — |
| Archivos | 3 (paso docs) | No | — |
| Cliente | 1 (formulario) | No | — |
| Orden de compra del hotel | 2 | No | — |
| Centro de consumo / cocina | 3 | No | — |
| Vendedor | 4 | Sí siempre (readOnly) | — |
| Fecha de entrega | 5 | No | — |
| Ventana de entrega — desde | 6 | No | — |
| Ventana de entrega — hasta | 7 | No | — |
| Prioridad | 8 | No | — |
| Moneda | 9 | No | — |
| Bodega destino | 10 | No | — |
| Observaciones | 11 | No | — |
| Dirección de entrega | 12 | No | — |
| Andén / punto de recepción | 13 | No | — |
| Contacto en el hotel | 14 | No | — |
| Teléfono del contacto | 15 | No | — |
| Producto (línea) | Picker; no tabula en la fila | No si hay catálogo | — |
| Cantidad (línea) | Primera celda editable de cada fila | No | Sí, al agregar un producto desde el picker (`orden-venta-cantidad-{idProducto}`) |
| Unidad (línea) | Fuera de tab (`tabIndex=-1`) | Sí siempre | — |
| Especificación (línea) | Tras cantidad | No | — |
| Desc% (línea) | Fuera de tab (`tabIndex=-1`) | Sí siempre | — |
| Precio (línea) | Tras especificación | No | — |
| IVA (línea) | Tras precio | No | — |
| Importe (línea) | — | Sí (calculado) | — |
| Peso total (kg) | Tras líneas | Sí (readOnly) | — |
| Campos fiscales | Tras expandir Datos fiscales | Sí siempre (readOnly) | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Cliente | Sí | Información de BD | Sí |
| Orden de compra del hotel | Sí | Ambas | Sí |
| Centro de consumo / cocina | Sí | Ambas | Sí |
| Vendedor | Sí | Información de BD | No |
| Fecha de entrega | Sí | Ambas | Sí |
| Ventana de entrega — desde | Sí | Ambas | Sí |
| Ventana de entrega — hasta | Sí | Ambas | Sí |
| Prioridad | Sí | Información de BD | Sí |
| Moneda | Sí | Información de BD | Sí |
| Bodega destino | Sí | Información de BD | Sí |
| Observaciones | Sí | Ambas | Sí |
| Dirección de entrega | Sí | Ambas | Sí |
| Andén / punto de recepción | Sí | Ambas | Sí |
| Contacto en el hotel | Sí | Ambas | Sí |
| Teléfono del contacto | Sí | Ambas | Sí |
| Producto (línea) | Sí | Ambas | Sí (quitar / agregar) |
| Cantidad (línea) | Sí | Ambas | Sí |
| Unidad (línea) | Sí | Información de BD | No |
| Especificación (línea) | Sí | Ambas | Sí |
| Precio (línea) | Sí | Información de BD | Sí |
| IVA (línea) | No | — | Sí |
| Razón social | Sí | Información de BD | No |
| RFC | Sí | Información de BD | No |
| Régimen | Sí | Información de BD | No |
| CP fiscal | Sí | Información de BD | No |
| Uso CFDI | Sí | Información de BD | No |
| Método de pago | Sí | Información de BD | No |
| Forma de pago | Sí | Información de BD | No |
| Correos CFDI | Sí | Información de BD | No |

Si Origen incluye Extracción IA, Editable = Sí (campos de captura). Los fiscales son solo BD y no editables.

### Notas y justificaciones

`OrdenVentaCreateModal` cubre alta y edición. El paso inicial ofrece "Venta nueva" o "Tengo el mensaje o archivos" (OpenAI / surtido). Están en el DOM pero ocultos (`hidden` + `aria-hidden`) y no se documentan como visibles: Turno que prepara, Hora sugerida de salida, Chofer, Unidad (vehículo), Cajas, Presentación, ¿Acepta sustituciones?, Requiere lote / trazabilidad, Registrar temperatura al entregar. Esos ocultos sí pueden prellenarse desde ficha/IA/edición y se persisten en observaciones. El WMS no timbra CFDI.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
