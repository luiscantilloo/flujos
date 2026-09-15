# Recepción de mercancía (OC)

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Recepción de mercancía (OC) |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Orden de compra | UUID (`id_orden_compra`) + código en título | Sí | OC `emitida` o `parcialmente_recibida` sin recepción cerrada | La OC desde la que se abre el modal | Sí (una recepción cerrada por OC) | Listado de ingreso | Back: no recepcionar si ya hay recepción o estado inválido. | Esta orden de compra ya tiene recepción cerrada / Solo se puede recepcionar una OC emitida o parcialmente recibida / Orden de compra no encontrada / La cuenta o bodega del request no coinciden con la orden de compra | Front/Back/BD |
| Líneas de la OC | Lista (título de producto) | Sí (al menos una línea en el draft) | Líneas de la OC | `buildDraftLineas(orden.lineas)` | Sí por `id_linea_orden_compra` en el payload | OC | Submit exige `lineas.length` mayor a 0 junto con cuenta y bodega. | La orden no tiene líneas para recepcionar. / Hay líneas de recepción duplicadas / La línea {idLineaOrdenCompra} no pertenece a la orden de compra | Front/Back/BD |
| Cantidad recibida (kg) | Decimal (coma o punto, `parseDecimalEs`) | Sí por línea | Número finito mayor o igual a 0. Back `@Min(0)`. No puede hacer que lo recibido acumulado supere lo pedido. | Vacío (conciliación ciega: no muestra lo pedido como valor) | No | Línea de OC | Front rechaza null, no finito o menor a 0. | La cantidad recibida de la línea 1 no es válida. / Las cantidades recibidas no pueden ser negativas / La cantidad recibida supera lo pedido en la línea {idLineaOrdenCompra} | Front/Back/BD |
| Temperatura (°C) | Decimal (coma o punto) | Sí si cantidad recibida mayor a 0 | Número finito. Back compara con rango del producto; máximo global frío 5 °C si el producto no tiene máximo. | Vacío | No | Cantidad recibida de la misma línea; catálogo del producto | Obligatorio cuando hay kg recibidos (front y back al crear inventario). | La temperatura de la línea 1 es obligatoria cuando hay cantidad recibida. / La temperatura de la línea 1 no es válida. / La temperatura es obligatoria para registrar inventario en recepción / {sku}: La temperatura {n}°C está por debajo del mínimo permitido ({min}°C) / {sku}: La temperatura {n}°C supera el máximo permitido ({max}°C) / Producto no encontrado en el catálogo | Front/Back/BD |
| Ubicación de ingreso (UUID, opcional) | UUID | No | UUID de slot de zona ingreso de la bodega | Vacío; si hay kg y no se envía, el back elige el siguiente slot libre | No | Bodega, layout zona ingreso | Si hay entradas de inventario y no hay slot libre: error. Si se envía UUID inválido: error. | Esta bodega no tiene slots de ingreso configurados. / No hay slots libres en la zona de ingreso. / La ubicación de ingreso no existe, no es de recepción o no pertenece a la bodega / Debe recibir al menos una cantidad positiva para registrar inventario | Front/Back/BD |
| Notas (opcional) | Texto | No | Sin `MaxLength` en DTO | Vacío | No | — | Se recorta; se omite si queda vacío. | — | Front/Back/BD |
| codigoCuenta / idBodega | Texto / UUID | Sí (contexto) | Tenant y bodega activos | Sesión | No | Sesión | — | Falta cuenta o bodega activa. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Cantidad recibida (kg) (por línea, orden de líneas) | 1, 3, 5, … | Sí si `isSubmitting` | — |
| Temperatura (°C) (por línea) | 2, 4, 6, … | Sí si `isSubmitting` | — |
| Ubicación de ingreso (UUID, opcional) | Después de las líneas | Sí si `isSubmitting` | — |
| Notas (opcional) | Siguiente | Sí si `isSubmitting` | — |
| Cancelar | Penúltimo | Sí si `isSubmitting` | — |
| Registrar recepción | Último | Sí si `!canSubmit` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Orden de compra | Sí | Información de BD | No |
| Título de cada línea | Sí | Información de BD | No |
| Cantidad recibida (kg) | No | — | Sí |
| Temperatura (°C) | No | — | Sí |
| Ubicación de ingreso | Sí | Información de BD | Sí |

### Notas y justificaciones

Usado en `RecepcionCompraModal` (página de ingreso) por jefe de bodega, administrador de bodega y roles de `ROLES_RECEPCION_ESCRITURA`. El custodio de muelle usa otro formulario (`schema_custodio_ingreso.md`) contra el mismo POST de cierre de recepción. No hay extracción IA. Los mensajes de línea interpolan el índice 1-based o el UUID de `id_linea_orden_compra`. El número 1 en los ejemplos es el índice; para la línea 2 el texto usa 2.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
