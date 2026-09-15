# Registrar salida

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Registrar salida |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Origen (orden de venta) | UUID (`id_orden_venta`) | Sí | OV confirmadas disponibles para salida en la cuenta/bodega | Vacío, o prefill del panel de ventas | No | `listOrdenesVentaParaSalida` | Si hay `prefillOrdenVenta` y ya hay id, el picker se bloquea. | Selecciona la orden de venta y el slot de salida. / No hay órdenes de venta confirmadas disponibles para registrar salida. | Front/Back/BD |
| Casillero de origen en almacenamiento | UUID (`id_ubicacion` origen) | Sí | Debe resolverse a un slot de almacenamiento con stock reservado de la OV | Resuelto al elegir la OV | No | OV, detalle de líneas, `warehouse_state`, `prefill.idUbicacionOrigen` | `resolveSalidaOrigenUbicacion`. Sin resolución no hay submit. Back: Las órdenes a salida requieren idUbicacionOrigen. | No se pudo determinar el casillero de almacenamiento con stock reservado para esta venta. / No se encontró casillero de origen en almacenamiento para esta venta. / Las órdenes a salida requieren idUbicacionOrigen | Front/Back/BD |
| Productos de la venta | Lista de solo lectura (SKU, kg, total) | No (informativo; el payload usa producto/cantidad derivados) | Líneas de `getOrdenVentaDetalle` | Cargadas al elegir la OV | No | Orden de venta | `resolveSalidaProductoDesdeOrden`: 1 línea, o varias del mismo producto (suma kg), o la primera línea. Exige `id_producto` y cantidad mayor a 0. | No se pudo determinar el producto y la cantidad de la venta. / Selecciona una orden de venta para ver los productos. / La orden no tiene líneas registradas. | Front/Back/BD |
| Destino (salida) | UUID (`id_ubicacion` zona picking/salida) | Sí | Slots de zona de salida de la bodega | Vacío | No | Layout zona salida | — | Selecciona la orden de venta y el slot de salida. / No hay slots de salida configurados en esta bodega. / No hay slots de salida configurados. | Front/Back/BD |
| Operario | UUID (`id_usuario`) | Sí | Operarios de la bodega con sesión activa | Primer operario disponible (si hay) | No | Cuenta activa, bodega activa | Igual que otras OT de jefe. | No hay operarios asignados a esta bodega. / Ningún operario tiene sesión activa. Espera a que un operario inicie sesión. / El operario no tiene sesión activa. / Selecciona un operario. / El operario no existe o no pertenece a esta bodega / El operario no está activo en el sistema | Front/Back/BD |
| idLote | UUID | No | Lote del `warehouse_state` en origen + producto | Del stock coincidente; si falla la consulta se omite | No | Casillero origen + producto de la OV | Lookup al submit. | No se pudo crear la salida. | Front/Back/BD |
| observaciones | Texto | No | Prefijo `OV ` más el código de la venta | Código de la venta | No | OV seleccionada | — | — | Front/Back/BD |
| tipoFlujo | Enum | Sí (oculto) | `a_salida` | a_salida | No | — | Fijo. | — | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Origen (orden de venta) | 1 | Sí si `prefillOrdenVenta` ya dejó un id (`origenBloqueado`) o no hay OV | — |
| Productos de la venta | — (tabla, no enfocable) | Sí (solo lectura) | — |
| Destino (salida) | 2 | Sí si no hay slots de salida o `isSubmitting` | — |
| Operario | 3 | Sí mientras carga o si no hay elegibles | — |
| Cancelar | 4 | Sí si `isSubmitting` | — |
| Crear salida | 5 | Sí si `!canSubmit` o `isSubmitting` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Origen (orden de venta) | Sí | Información de BD | Sí, excepto con prefill del panel |
| Casillero de origen en almacenamiento | Sí | Información de BD | No |
| Productos de la venta | Sí | Información de BD | No |
| Producto / cantidad / lote del payload | Sí | Información de BD | No |
| Destino (salida) | Sí | Información de BD | Sí |
| Operario | Sí | Información de BD | Sí |

### Notas y justificaciones

El usuario no elige el casillero de almacenamiento: se resuelve desde la OV. El listado de productos es informativo. No hay extracción IA.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
