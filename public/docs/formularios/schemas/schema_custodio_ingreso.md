# Ingreso en muelle (custodio)

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Ingreso en muelle (custodio) |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | No |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Orden de compra | UUID (`id_orden_compra`) | Sí para mostrar el formulario de líneas | OC en transporte (`emitida` o `parcialmente_recibida`) de la bodega | Vacío | No | `listOrdenesCompra` filtrado | Sin OC seleccionada no se renderiza el form de líneas. | No hay órdenes en transporte para esta bodega. / No se pudieron cargar las líneas de la orden. | Front/Back/BD |
| Incluida (por línea) | Booleano | No | — | `true` si hay cantidad pendiente (pedida menos recibida mayor a 0); si no, `false` | No | Línea de OC | El payload solo envía líneas con `incluida`. Hace falta al menos una incluida al parsear. | Selecciona al menos una línea para registrar el ingreso. | Front/Back/BD |
| Temperatura (°C) (por línea incluida) | Decimal (`parseDecimalEs`) | Sí si la línea está incluida | Número finito; mismo rango de producto en back que recepción OC | Vacío | No | Incluida = true | `isTemperaturaIngresoValida`. Back: temperatura obligatoria si hay inventario. | La temperatura de la línea 1 es obligatoria. / La temperatura es obligatoria para registrar inventario en recepción / {sku}: La temperatura {n}°C está por debajo del mínimo permitido ({min}°C) / {sku}: La temperatura {n}°C supera el máximo permitido ({max}°C) | Front/Back/BD |
| Peso recibido (kg) (por línea incluida) | Decimal | Sí si la línea está incluida | Front habilita submit solo si peso mayor a 0. Parser acepta mayor o igual a 0 finito. Back `@Min(0)` y no superar lo pedido acumulado. | Vacío | No | Incluida = true | Conciliación ciega. | El peso recibido de la línea 1 no es válido. / Las cantidades recibidas no pueden ser negativas / La cantidad recibida supera lo pedido en la línea {idLineaOrdenCompra} | Front/Back/BD |
| Producto del catálogo (adicional) | UUID (`id_producto`) | No | Catálogo admin de la cuenta | Vacío (`Sin producto adicional`) | No | `listCatalogoProductosAdmin` | Si no hay líneas incluidas, `canSubmit` exige producto adicional completo; el parser igual exige al menos una línea OC y entonces falla. | Selecciona al menos una línea para registrar el ingreso. | Front |
| Temperatura (°C) (producto adicional) | Decimal | Sí si hay producto adicional elegido (para considerarlo completo) | Número finito | Vacío | No | Producto adicional | Solo se persiste si peso mayor a 0 y temperatura válida, como texto en `notas`. | — | Front/Back/BD |
| Peso (kg) (producto adicional) | Decimal | Sí si hay producto adicional elegido (para considerarlo completo) | Peso mayor a 0 para armar la nota | Vacío | No | Producto adicional | Nota con formato `Producto adicional: etiqueta; N kg; temp N°C`. No usa `lineasAdicionales` del API. | — | Front/Back/BD |
| Slot de ingreso | UUID (resuelto, no hay input) | Sí | Slot libre de zona ingreso | `resolveUbicacionIngreso()` | No | Layout muelle | Si no hay slot: no llama al API. | Esta bodega no tiene slots de ingreso configurados. / No hay slots libres en la zona de ingreso. / No se pudo registrar el ingreso. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Orden de compra | 1 | Sí mientras carga órdenes | Al abrir el picker: foco en buscar OC |
| Incluida | Por línea, antes de temp/peso | Sí si `isSubmitting` | — |
| Temperatura (°C) | Visible solo si incluida | Sí si `isSubmitting` | — |
| Peso recibido (kg) | Después de temperatura de la misma línea | Sí si `isSubmitting` | — |
| Producto del catálogo | Después de las líneas | Sí si `isSubmitting` o cargando catálogo | — |
| Temperatura / peso adicional | Solo si hay producto adicional | Sí si `isSubmitting` | — |
| Registrar ingreso y cerrar orden. | Último | Sí si `!canSubmit` o `isSubmitting` o cargando líneas | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Orden de compra (opciones) | Sí | Información de BD | Sí |
| Título / SKU de línea | Sí | Información de BD | No |
| Incluida | Sí | Información de BD | Sí |
| Catálogo de producto adicional | Sí | Información de BD | Sí |
| Slot de ingreso | Sí | Información de BD | No |

### Notas y justificaciones

Vive en el panel lateral de `/dashboard/custodio/ingreso`, no en modal (el picker de OC sí es modal). Mismo cierre de recepción que `schema_recepcion_compra.md`, pero conciliación ciega con checkbox, peso y temperatura, y producto extra solo en `notas`. Los mensajes de línea interpolan el índice 1-based de las líneas marcadas como incluidas.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
