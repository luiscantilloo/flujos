# Asignar retiro en bodega

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Asignar retiro en bodega |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Orden de procesamiento | UUID (`id_solicitud_procesamiento`) + texto de solo lectura | Sí | Solicitud pendiente elegida en el panel de procesamiento | Prefill del panel | Sí (una solicitud por envío) | Panel de procesamiento | Sin `prefill.idSolicitudProcesamiento` no hay submit. Muestra código, primario → secundario y kg. | Selecciona una solicitud pendiente desde el panel de procesamiento. | Front/Back/BD |
| Operario | UUID (`id_usuario` / `idOperario`) | Sí | Operarios de la bodega con sesión activa | Primer operario disponible (si hay) | No | Cuenta activa, bodega activa | Submit llama `PATCH /procesamiento/solicitudes/:id/asignar-operario` con `idOperario` UUID. | Selecciona un operario. / No hay operarios asignados a esta bodega. / Ningún operario tiene sesión activa. Espera a que un operario inicie sesión. / El operario no tiene sesión activa. / No se pudo asignar el operario a la orden. | Front/Back/BD |
| codigoCuenta | Texto | Sí (contexto) | Tenant activo | Cuenta de sesión | No | Sesión | Trim no vacío. | — | Front/Back/BD |
| idBodega | UUID | Sí (contexto) | Bodega activa | Bodega de sesión | No | Sesión | Trim no vacío. | — | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Orden de procesamiento | — (bloque de solo lectura) | Sí (no es input) | — |
| Operario | 1 | Sí mientras carga o si no hay elegibles | — |
| Cancelar | 2 | Sí si `isSubmitting` | — |
| Asignar operario | 3 | Sí si `!canSubmit` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Orden de procesamiento | Sí | Información de BD | No |
| Operario | Sí | Información de BD | Sí |

### Notas y justificaciones

El jefe no elige la solicitud dentro del modal: llega del panel. La acción crea el retiro de insumo hacia zona de procesamiento en la cola del operario. No hay extracción IA.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
