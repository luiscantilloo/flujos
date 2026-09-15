# Revisar posición

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Revisar posición |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Posición | UUID (`id_ubicacion` destino, almacenamiento) | Sí | Casilleros de almacenamiento no bloqueados por OT `revisar` (libres u ocupados) | Vacío | No | Bodega activa, layout, OT pendientes de tipo `revisar` | Una posición con tarea de revisión pendiente no aparece. No se envía origen ni producto. | Selecciona la posición a revisar. / No hay casilleros disponibles para revisar. Puede haber tareas de revisión pendientes en esas posiciones. / No hay casilleros disponibles para revisar. | Front/Back/BD |
| Operario | UUID (`id_usuario`) | Sí | Operarios de la bodega con sesión activa | Primer operario disponible (si hay) | No | Cuenta activa, bodega activa | `canAssign` exige operario asignable. | No hay operarios asignados a esta bodega. / Ningún operario tiene sesión activa. Espera a que un operario inicie sesión. / El operario no tiene sesión activa. / Selecciona un operario. / El operario no existe o no pertenece a esta bodega / El operario no está activo en el sistema | Front/Back/BD |
| tipoFlujo | Enum | Sí (oculto) | `revisar` | revisar | No | — | Fijo al crear la OT. Back no exige origen para este flujo. | No se pudo crear la orden. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Posición | 1 | Sí si no hay casilleros disponibles o `isSubmitting` | — |
| Operario | 2 | Sí mientras carga o si no hay elegibles | — |
| Cancelar | 3 | Sí si `isSubmitting` | — |
| Crear revisión | 4 | Sí si `!canSubmit` o `isSubmitting` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Posición | Sí | Información de BD | Sí |
| Operario | Sí | Información de BD | Sí |

### Notas y justificaciones

La OT de revisión no mueve inventario: el operario marca el conteo como completado. No hay extracción IA.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
