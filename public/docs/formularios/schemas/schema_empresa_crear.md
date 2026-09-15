### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear empresa |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| razon_social | texto | Sí | Trim no vacío; Back `@MinLength(1)` `@MaxLength(255)`; BD `varchar(255)` NOT NULL | — | No | — | — | La razón social es obligatoria. Fallo genérico del modal: No se pudo crear la empresa. | Front/Back/BD |
| telefono | teléfono E.164 | No | Opcional; si hay valor debe ser número internacional válido (`libphonenumber-js`); Back `@MaxLength(32)`; BD `varchar(32)` nullable | — (selector de país por defecto CO) | No | — | — | Front UI: Ingresa un número de teléfono válido. Front servicio: El teléfono de la empresa no es válido. | Front/Back/BD |
| codigo_empresa | texto alfanumérico | Sí | Generado en cliente con `generateCodigoCuentaFromNombre` (5 caracteres base 36); normalizado a A-Z0-9 máx. 32; Back `@MinLength(1)` `@MaxLength(32)`; BD PK `varchar(32)` | Hash derivado de `razon_social` (oculto) | Sí | razon_social | Se recalcula en cada cambio de razón social; no hay input visible | El código de empresa es obligatorio. Duplicado Front: Ya existe una empresa con ese código. Duplicado Back: Ya existe una empresa con ese código. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| razon_social | 1 | Sí, mientras `isSubmitting` | Al abrir el modal (`autoFocus`) |
| telefono | 2 (selector de país + número) | Sí, mientras `isSubmitting` | — |
| codigo_empresa | — | Sí (no se muestra; no tabula) | — |

### Notas y justificaciones

Sin omisiones de capa en los campos de alta. `codigo_empresa` no tiene control visible: el usuario no puede editarlo; si el hash choca, ve el mensaje de duplicado. `razon_social` no usa `required` HTML; el obligatorio lo aplica el servicio Front y el DTO/API (el protocolo espera un mensaje explícito en el campo, no solo al submit). `idCreador` se toma de la sesión y no es campo de UI.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
