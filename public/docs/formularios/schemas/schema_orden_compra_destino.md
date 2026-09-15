### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Destino de orden de compra |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí, información de BD |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Llegada estimada | Fecha | No | Input `type=date`; vacío se envía como null | Fecha de la OC (`fecha_entrega_estimada`) | No | Estado borrador | Editable solo si `orden.estado === "borrador"` y hay `onDestinoChange` | No se pudo actualizar el destino. | Front, Back, BD |
| Tipo | Selección | Sí para persistir bodega | interna / externa (labels Bodega interna / Bodega externa) | `destino_tipo` de la OC (parseado; fallback interna) | No | Estado borrador | Al cambiar el tipo se limpia Bodega destino y se pide lista del nuevo tipo | Selecciona el tipo de bodega destino. / Debe indicar el tipo de destino (interna o externa) | Front, Back, BD |
| Bodega destino | Selección UUID | Sí para guardar destino | Bodegas del tipo elegido con slots libres (`listBodegasDestinoCompraApi`) | `id_bodega` de la OC si sigue en la lista; si no, vacío | No | Tipo | Opciones según Tipo; si la bodega actual no está en la lista se limpia | Selecciona una bodega destino. / Debe indicar la bodega destino / La bodega destino está inactiva / La bodega destino no pertenece a la cuenta de la orden / La bodega destino no tiene capacidad disponible (sin slots libres) / No se pudo actualizar el destino. | Front, Back, BD |

Aviso de lista vacía: `No hay bodegas internas con capacidad disponible en tu cuenta.` o `No hay bodegas externas con capacidad disponible en tu cuenta.` Carga: `No se pudieron cargar las bodegas destino.` Front no valida fecha; el PATCH ocurre al cambiar un campo (no hay botón Guardar de destino). Si Tipo cambia y bodega queda vacía, el PATCH de tipo no llama al API hasta que haya `idBodega`.

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Llegada estimada | 1 | Sí si no es borrador, o mientras `isSavingDestino` | — |
| Tipo | 2 | Sí si no es borrador, o mientras `isSavingDestino` | — |
| Bodega destino | 3 | Sí si no es borrador, mientras guarda, o mientras carga bodegas | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Llegada estimada | Sí | Información de BD | Sí (solo borrador) |
| Tipo | Sí | Información de BD | Sí (solo borrador) |
| Bodega destino | Sí | Información de BD | Sí (solo borrador) |

### Notas y justificaciones

Vive en la sección Destino de `OrdenCompraDetalleModal`. Proveedor, Fecha de emisión, Estado, productos y observaciones son solo lectura en el mismo modal y no forman parte de este schema de destino. El guardado es inmediato (PATCH `/compras/ordenes/:id/destino`).

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
