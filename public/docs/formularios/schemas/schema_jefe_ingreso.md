# Registrar entrada

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Registrar entrada |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Origen | Texto (solo lectura) | Sí | Fijo: Ingresos | Ingresos | No | — | No editable. Representa la zona de ingreso de la bodega activa. | — | Front |
| Producto en ingreso | UUID (`id_warehouse_state` → `id_ubicacion` origen + `id_producto` + `id_lote`) | Sí | Solo cajas con cantidad mayor a 0 en zona de ingreso, no bloqueadas por OT `a_bodega` | Vacío | No | Cuenta activa, bodega activa, `warehouse_state`, ubicaciones de ingreso | Debe existir stock en un slot de ingreso. Envía `idUbicacionOrigen`, `idProducto`, `idLote` y `cantidad` parseada del stock. | Completa destino y producto para crear el ingreso. / No hay cajas en zona de ingreso. Cuando el custodio registre mercancía, podrás seleccionar el producto a trasladar. / No hay slots con producto en zona de ingreso. | Front/Back/BD |
| Posición en bodega | UUID (`id_ubicacion` destino, almacenamiento) | Sí | Casilleros de almacenamiento de la bodega activa | Vacío | No | Bodega activa, layout de almacenamiento | Obligatorio para `tipoFlujo = a_bodega`. | Completa destino y producto para crear el ingreso. / No hay casilleros de almacenamiento disponibles para destino. / No hay casilleros de almacenamiento. / Las órdenes a bodega requieren idUbicacionDestino | Front/Back/BD |
| Operario | UUID (`id_usuario`) | Sí | Operarios asignados a la bodega con sesión activa | Primer operario disponible (si hay) | No | Cuenta activa, bodega activa, sesión de operario | `canAssign` exige `idAsignado` y ausencia de `blockReason`. Back valida que el operario exista, pertenezca a la bodega y esté activo. | No hay operarios asignados a esta bodega. / Ningún operario tiene sesión activa. Espera a que un operario inicie sesión. / El operario no tiene sesión activa. / Selecciona un operario. / El operario no existe o no pertenece a esta bodega / El operario no está activo en el sistema | Front/Back/BD |
| Cantidad | Número decimal (mínimo 0) | No (derivada) | `Number.parseFloat(producto.cantidad)`; si no es finito se omite | Cantidad del `warehouse_state` elegido | No | Producto en ingreso | No hay input. Se toma del stock de la caja. Back: `@Min(0)`. | No se pudo crear la orden. | Front/Back/BD |
| tipoFlujo | Enum | Sí (oculto) | `a_bodega` | a_bodega | No | — | Fijo al crear la OT. | — | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Origen | 1 | Sí (readOnly) | — |
| Producto en ingreso | 2 | Sí si no hay cajas en ingreso o mientras `isSubmitting` | — |
| Posición en bodega | 3 | Sí si no hay casilleros de almacenamiento o mientras `isSubmitting` | — |
| Operario | 4 | Sí mientras carga operarios (`Cargando operarios…`) o si no hay elegibles | — |
| Botón lupa (pickers) | Fuera de tab (`tabIndex=-1`); Enter/Espacio en el input abre el picker | Sí si no hay `onSearchClick` | — |
| Cancelar | 5 | Sí si `isSubmitting` | — |
| Crear ingreso | 6 | Sí si `!canSubmit` o `isSubmitting` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Origen | No | — | No |
| Producto en ingreso | Sí | Información de BD | Sí |
| Posición en bodega | Sí | Información de BD | Sí |
| Operario | Sí | Información de BD | Sí |
| Cantidad / lote / producto | Sí | Información de BD | No |

### Notas y justificaciones

El modal crea una orden de trabajo `a_bodega` (`createJefeOrdenTrabajo` → `POST /operaciones/ordenes-trabajo`). No hay extracción IA. El origen de zona es informativo; el origen real de inventario es el slot de la caja elegida. Submit deshabilitado hasta destino, producto con `id_producto` y operario asignable.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
