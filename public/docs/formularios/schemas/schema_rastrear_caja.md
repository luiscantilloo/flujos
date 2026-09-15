# Rastrear caja

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Rastrear caja |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Caja | UUID (`id_lote`) + etiqueta código lote · producto | Sí para consultar el recorrido | Cajas rastreables de la bodega activa (en bodega, despachadas o sin ubicación) | Vacío | Sí (un lote por consulta) | Cuenta activa, bodega activa | Sin cuenta/bodega no carga lista. Al seleccionar llama `getCajaRastreoDetalle`. No persiste. | Selecciona una bodega activa para rastrear cajas. / No se pudieron cargar las cajas de la bodega. / No se pudo cargar el recorrido de la caja. / Sin cajas en la bodega / Falta codigo_cuenta del tenant activo. / Falta id_bodega del tenant activo. | Front/Back/BD |
| Buscar caja | Texto (filtro del picker) | No | Tokens separados por espacio; comparación sin acentos ni mayúsculas sobre código, paquete, producto, ubicación y estado | Vacío | No | Lista de cajas | Solo filtra en cliente. | No hay cajas que coincidan con la búsqueda o el filtro. / No hay cajas registradas en esta bodega. | Front |
| Estado | Enum (`en_bodega`, `despachada`, `sin_ubicacion`) o vacío = Todos | No | Valores del select: En bodega, Despachadas, Sin ubicación | Todos (vacío) | No | Lista de cajas | Filtra en cliente. | No hay cajas que coincidan con la búsqueda o el filtro. | Front |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Caja | 1 | Sí mientras `isLoadingCajas` o `cajas.length === 0`; el modal no cierra si `isLoadingDetalle` | — |
| Buscar caja | 1 del picker anidado | No | Sí, al abrir el picker (`requestAnimationFrame` → foco en el input de búsqueda) |
| Estado | 2 del picker | No | — |
| Filas de resultado | Siguiente (tabla con `tabIndex=0`) | No | — |
| Cerrar (picker) | Pie del picker | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Caja (opciones) | Sí | Información de BD | Sí |
| Ubicación actual / estado / peso / producto | Sí | Información de BD | No |
| Recorrido / historial | Sí | Información de BD | No |

### Notas y justificaciones

Consulta de lookup: `asForm={false}`, `hideFooter`, `onSubmit` solo hace `preventDefault`. No crea ni actualiza registros. Los campos Buscar y Estado viven en el picker, no se guardan.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
