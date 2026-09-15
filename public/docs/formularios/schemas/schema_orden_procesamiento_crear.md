### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Nueva orden de procesamiento |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí, información de BD |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fecha | Fecha | No para el POST | Input `type=date` | Hoy (YYYY-MM-DD local) | No | — | Se muestra también como DD/MM/YYYY; no viaja en `createSolicitudProcesamiento` | — | Front |
| Mapa | Picker UUID | Sí | Bodegas internas vinculadas | Bodega activa de sesión si está en la lista; si no, la primera vinculada | No | — | Se elige en `ProcesamientoMapaPickerModal`; al cambiar se limpian Insumo, Resultado y cantidad | Selecciona una bodega interna (mapa) válida. | Front, Back, BD |
| Insumo | Picker UUID | Sí | Primarios con al menos un secundario vinculado | Vacío | No | Mapa | Picker deshabilitado sin mapa; stock se consulta en el mapa | Completa insumo y resultado válidos. / Selecciona insumo y resultado válidos. / Sin stock disponible en el mapa para el insumo seleccionado. / No se pudo consultar el stock del mapa. | Front, Back, BD |
| Resultado | Picker UUID | Sí | Secundarios del primario elegido | Vacío | No | Insumo | Picker deshabilitado sin insumo; `ProcesamientoResultadoPickerModal` | Completa insumo y resultado válidos. / Selecciona insumo y resultado válidos. | Front, Back, BD |
| Conversión (ud. por 1 kg) | Decimal | Sí | Mayor a 0; acepta coma | 0 hasta elegir Resultado; luego u/kg del catálogo | No | Resultado | Deshabilitado sin Resultado | Indicá cuántas unidades de secundario obtenés con 1 kg de primario. / Indica una conversión válida. / No se pudo calcular el estimado del secundario. Revisá la conversión. | Front, Back, BD |
| Cantidad a procesar (kg) | Entero (slider) | Sí | 1 … stock entero del mapa (`maxCantidadProcesamientoDesdeStock`) | 1 (se recorta al máximo de stock) | No | Insumo + Mapa + stock | Slider solo si hay stock; step 1 | Elegí una cantidad válida en primario. / La cantidad supera el stock disponible en bodega para este primario. / La cantidad a procesar supera el stock del mapa. / Indica una cantidad a procesar mayor a cero. | Front, Back, BD |
| Estimado | Texto calculado | — | Ud. netas, sobrante kg, merma (si hay % catálogo) | — | No | Conversión + Cantidad + merma del secundario | Solo lectura; si falta conversión muestra Indicá conversión. | No se pudo aplicar la pérdida al estimado. Revisá los valores. | Front |

Errores de contexto: `No se encontró el usuario solicitante.` / `No se pudieron cargar los datos del formulario.` / `No se pudo registrar la orden de procesamiento.` / `No hay bodegas internas vinculadas a la cuenta.` El solicitante no es un campo visible.

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Fecha | 1 | Sí mientras se envía | — |
| Mapa | 2 | Sí mientras carga, se envía, o no hay bodegas | — |
| Insumo | 3 | Sí mientras carga o se envía, o sin mapa, o sin primarios | — |
| Resultado | 4 | Sí mientras carga o se envía, o sin insumo | — |
| Conversión (ud. por 1 kg) | 5 | Sí mientras se envía o sin Resultado | — |
| Cantidad a procesar (kg) | 6 | Sí mientras se envía o si no hay stock listo | — |
| Estimado | — | Sí siempre (calculado) | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Mapa | Sí | Información de BD | Sí |
| Conversión (ud. por 1 kg) | Sí | Información de BD | Sí |
| Cantidad a procesar (kg) | Sí | Información de BD | Sí |
| Estimado | Sí | Información de BD | No |

### Notas y justificaciones

`OrdenProcesamientoCreateModal`. Fecha es UI local y no se envía al crear la solicitud. Insumo exige stock > 0 en casilleros de almacenamiento del mapa. El estimado aplica la merma del catálogo (`mermaPct`) sobre el teórico 1 kg → N ud.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
