### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar cuenta |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nombre | texto | Sí | Trim no vacío; BD `nombre_comercial varchar(255)` NOT NULL | — | No | — | — | El nombre de la cuenta es obligatorio. Fallo genérico: No se pudo actualizar la cuenta. | Front/Back/BD |
| codigo | texto | Sí (solo lectura) | PK existente `varchar(32)` | — | Sí | — | Identifica el recurso; no editable | El código de la cuenta es obligatorio. (si se pierde el código al guardar) | Front/Back/BD |
| credenciales_auth | texto (Sí/No) | No (informativo) | Derivado de si la cuenta tiene usuarios con auth; no se envía | — | No | — | Solo lectura | — | Front |
| acceso | enumeración (`activo` / `inactivo`) | Sí | Mapea a `estaActiva` boolean; BD NOT NULL default true. Inactivo bloquea login de usuarios de la cuenta | activo | No | — | — | — (el select siempre tiene valor) | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| nombre | 1 | Sí, mientras `isSubmitting` | Al abrir el modal (`autoFocus`) |
| codigo | — | Sí (siempre: `disabled` + `readOnly`) | — |
| credenciales_auth | — | Sí (siempre: `disabled` + `readOnly`) | — |
| acceso | 2 | Sí, mientras `isSubmitting` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| nombre | Sí | Información de BD | Sí |
| codigo | Sí | Información de BD | No |
| credenciales_auth | Sí | Información de BD | No |
| acceso | Sí | Información de BD | Sí |

### Notas y justificaciones

`credenciales_auth` omite Back y BD: es un indicador de UI (`tieneCredenciales`) que no se persiste ni viaja en el PATCH. `codigo` no se modifica. `nombre` no usa `required` HTML; el obligatorio lo aplica el servicio Front y `UpdateCuentaDto` + Prisma.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
