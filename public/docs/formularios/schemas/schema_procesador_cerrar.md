# Declarar merma y cerrar

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Declarar merma y cerrar |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Orden | Texto de solo lectura (código, primario → secundario, kg, ud. estimadas) | Sí (contexto) | Solicitud `en_proceso` abierta en el modal | Prefill `solicitud` | Sí | Panel del procesador | Sin solicitud, cuenta o bodega no hay submit. Back: solo procesador y estado en curso. | Solo el procesador puede cerrar una solicitud en curso / Solicitud de procesamiento no encontrada / Indicá los kg de merma (desperdicio) al cerrar el procesamiento. | Front/Back/BD |
| Merma (kg) | Decimal (coma o punto → `Number`) | Sí | Finito y mayor o igual a 0. Back `@IsNumber` `@Min(0)` (`kilosMerma`) | `0`, o el sugerido `stringKgInicialDesperdicio(desperdicioKg)` | No | Solicitud; % pérdida del secundario | Front: Indica la merma en kg (puede ser 0). Back: `desperdicio_requerido` si no es número mayor o igual a 0. | Indica la merma en kg (puede ser 0). / Indicá los kg de merma (desperdicio) al cerrar el procesamiento. / No se pudo cerrar la orden de procesamiento. | Front/Back/BD |
| codigoCuenta / idBodega | Texto / UUID | Sí (contexto) | Tenant y bodega activos | Sesión | No | Sesión | Trim no vacío. | — | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Orden | — (solo lectura) | Sí | — |
| Merma (kg) | 1 | Sí mientras `loadingSugerido` o `isSubmitting` | — |
| Cancelar | 2 | Sí si `isSubmitting` | — |
| Confirmar cierre | 3 | Sí si `!canSubmit` (incluye carga del sugerido) | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Orden | Sí | Información de BD | No |
| Merma (kg) | Sí | Información de BD | Sí |

### Notas y justificaciones

Tras un cierre OK el front llama `crearOrdenesPostCierre`. El sugerido es editable. No hay extracción IA.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
