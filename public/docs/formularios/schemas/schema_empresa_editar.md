### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar empresa |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| razon_social | texto | Sí | Trim no vacío; BD `varchar(255)` NOT NULL | — | No | — | — | La razón social es obligatoria. Fallo genérico: No se pudo actualizar la empresa. | Front/Back/BD |
| codigo_empresa | texto | Sí (solo lectura) | PK existente `varchar(32)`; no se envía en el PATCH de datos | — | Sí | — | Identifica el recurso; no editable | El código de empresa es obligatorio. (si se pierde el código al guardar) | Front/Back/BD |
| telefono | teléfono E.164 | No | Opcional; si hay valor, internacional válido; BD `varchar(32)` nullable | — | No | — | — | Front UI: Ingresa un número de teléfono válido. Front servicio: El teléfono de la empresa no es válido. | Front/Back/BD |
| estado | enumeración (`activa` / `inactiva`) | Sí | Mapea a `estaActiva` boolean; BD NOT NULL default true | activa | No | — | — | — (no hay mensaje de campo; el select siempre tiene valor) | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| razon_social | 1 | Sí, mientras `isSubmitting` | Al abrir el modal (`autoFocus`) |
| codigo_empresa | — | Sí (siempre: `disabled` + `readOnly`) | — |
| telefono | 2 | Sí, mientras `isSubmitting` | — |
| estado | 3 | Sí, mientras `isSubmitting` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| razon_social | Sí | Información de BD | Sí |
| codigo_empresa | Sí | Información de BD | No |
| telefono | Sí | Información de BD | Sí |
| estado | Sí | Información de BD | Sí |

### Notas y justificaciones

Sin omisiones de capa. `codigo_empresa` no se modifica (solo lectura). `estado` no tiene mensaje de error propio porque el select no puede quedar vacío. UpdateEmpresaDto no declara `@MaxLength` de razón social (sí el create); el límite visible en edición es el de BD.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
