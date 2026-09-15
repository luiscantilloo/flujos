# Paquete de despacho

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Paquete de despacho |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | No |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ventas para el mismo camión | Lista de UUID (`id_orden_venta`) | Sí (al menos una para armar paquete) | OV en `confirmada`, `en_preparacion`, `parcialmente_despachada` o `despachada` | Vacío | No (varias OV) | Listado de ventas de la bodega | Todas las seleccionadas deben ser de la misma cuenta. Front recorta duplicados al enviar. Back: `@ArrayMinSize(1)`. | Las ventas del mismo envío deben ser de la misma cuenta. / Buscá y agregá al menos una venta para armar el paquete. / Seleccioná al menos una orden de venta para el paquete / Faltan datos para armar el paquete de despacho. | Front/Back/BD |
| Venta para detalle (opcional) | UUID (`id_orden_venta`) | No | Misma lista de ventas activas | Vacío | No | Ventas activas | Solo UI de detalle; no viaja en `crearPaqueteDespachoApi`. | — | Front |
| Camión asignado | UUID (`id_camion`) | Sí para enviar el paquete | Camiones `disponible` de la cuenta | Vacío; se limpia al armar paquete | No | Paquete armado; `listCamionesAdmin` filtrado a disponibles | Botón enviar exige `selectedCamion`. Back valida existencia y disponibilidad. | Sin camiones disponibles / No hay camiones disponibles. / No se encontró el camión indicado / El camión ya no está disponible. Elegí otro. | Front/Back/BD |
| Cajas en zona de salida | Entero (condición, no input) | Sí de facto para enviar | `cajasEnSalida` mayor a 0 | Conteo del layout muelle | No | Ventas del paquete, `warehouse_state` zona salida | Front bloquea envío si es 0 o menos. Back: SIN_CAJAS_EN_SALIDA / SIN_ZONA_SALIDA. | No hay cajas en zona de salida para las ventas del paquete. / No hay cajas en zona de salida para estas ventas. / No hay cajas en zona de salida para despachar / La bodega no tiene zona de salida configurada | Front/Back/BD |
| codigoCuenta / idBodega | Texto / UUID | Sí | Tenant y bodega activos | Sesión | No | Sesión | — | Seleccioná cuenta y bodega activas para enviar el paquete. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Ventas para el mismo camión | 1 (fase armar) | Sí mientras `isLoading`; no se quitan chips si el paquete ya está armado | — |
| Venta para detalle (opcional) | 2 (fase armar) | Sí mientras `isLoading` | — |
| Armar paquete de despacho | 3 | Sí si mezcla de cuentas o `isLoading` | — |
| Camión asignado | 1 (fase paquete listo) | Sí si `enviando`, cargando camiones o lista vacía | Al abrir picker de camión: foco en buscar (`CamionCatalogTablePickerModal`) |
| Enviar paquete al transporte | 2 (fase paquete listo) | Sí si `enviando` o `cajasEnSalida` menor o igual a 0 o no hay camión | — |
| Cancelar paquete | 3 | Sí si `enviando` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Ventas para el mismo camión | Sí | Información de BD | Sí hasta armar el paquete |
| Camión asignado | Sí | Información de BD | Sí |
| Previsualización de productos | Sí | Información de BD | No |

### Notas y justificaciones

Panel lateral en la página de custodio (no es el modal principal; pickers de OV, camión y previsualización sí son modales). `POST /transporte/paquetes-despacho` crea viaje + guías. Errores de toast de front y de back listados en Tabla 1. No hay extracción IA. Otros errores de back: Una o más órdenes de venta no pertenecen a esta bodega/cuenta / La orden de venta no está en un estado válido para despacho / El despacho excedería lo pedido en la orden de venta / La venta {codigo} no está en un estado válido para despacho / La venta {codigo} no tiene líneas de producto / La venta {codigo} ya tiene guía de transporte / No se pudo enviar el paquete / Error al crear el viaje de transporte.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
