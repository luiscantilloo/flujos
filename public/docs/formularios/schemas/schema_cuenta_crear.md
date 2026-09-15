### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear cuenta |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| empresa | enumeración (código de empresa activa) | Sí | Debe ser una empresa `esta_activa = true` del picker | — | No | — | El picker lista solo empresas activas (`listEmpresasAssignOptions`) | Selecciona la empresa a asociar. Carga: No se pudieron cargar las empresas. | Front/BD |
| nombre | texto | Sí | Trim no vacío; BD `nombre_comercial varchar(255)` NOT NULL | — | No | — | — | El nombre de la cuenta es obligatorio. Fallo genérico: No se pudo crear la cuenta. | Front/BD |
| codigo_cuenta | texto alfanumérico | Sí | Generado con `generateCodigoCuentaFromNombre` (5 caracteres); normalizado A-Z0-9 máx. 32; BD PK `varchar(32)` | Hash derivado de `nombre` (oculto) | Sí | nombre | Se recalcula al cambiar el nombre; no hay input visible | El código de la cuenta es obligatorio. Si el insert choca el PK, Supabase: el `error.message` de Postgres (p. ej. duplicate key) o Error al guardar en Supabase. | Front/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| empresa | 1 | Sí, mientras `isSubmitting` o `isLoadingOptions`; el botón buscar tiene `tabIndex=-1` | — |
| nombre | 2 | Sí, mientras `isSubmitting` o `isLoadingOptions` | Al abrir el modal (`autoFocus`) |
| codigo_cuenta | — | Sí (no se muestra; no tabula) | — |

### Notas y justificaciones

`empresa`, `nombre` y `codigo_cuenta` omiten Back: el alta no usa DTO/controller Nest; `createCuentaConfigurator` inserta en `cuenta` vía Supabase (schema `emp_*`). BD aplica PK `codigo_cuenta`, `codigo_empresa` NOT NULL (FK a `empresa`) y `nombre_comercial` NOT NULL. `nombre` no tiene `required` HTML (el protocolo espera mensaje explícito de campo; hoy el texto sale al submit). `idCreador` sale de la sesión, no es campo de UI. `esta_activa` se fija en true al insertar.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
