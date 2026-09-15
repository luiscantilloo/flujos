### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear bodega externa |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cuenta_destino | enumeración (código de cuenta) | Sí | Cuenta existente resuelta en schemas `emp_*` | — | No | — | Picker de cuentas activas | Selecciona la cuenta destino. Carga: No se pudieron cargar las cuentas. Servicio: La cuenta seleccionada no es válida. | Front/Back/BD |
| nombre | texto | Sí | Trim no vacío; Back `@IsNotEmpty`; BD `varchar(255)` NOT NULL | — | No | — | — | El nombre de la bodega es obligatorio. Fallo genérico: No se pudo crear la bodega externa. | Front/Back/BD |
| capacidad | número entero | Sí (en este formulario) | Front: `Number(capacidad) > 0` y finito; input `min={1}`; Back el DTO marca `capacidadSlots` opcional pero si viaja `@Min(1)` `@Max(500)`; se envía siempre `Math.trunc`; BD `capacidad_slots` Int nullable | — | No | — | — | La capacidad debe ser un número mayor a cero. | Front/Back/BD |
| codigo | texto alfanumérico | Sí | Generado con `generateCodigoCuentaFromNombre` (5 caracteres); único por cuenta (`uq_bodega_cuenta_codigo`); BD `varchar(32)` | Hash derivado de `nombre` (oculto) | Sí (por cuenta) | nombre | No hay input visible | No se pudo generar el código de la bodega. Duplicado Back: Ya existe una bodega con ese código en la cuenta. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| cuenta_destino | 1 | Sí, mientras `isSubmitting` o `isLoadingOptions` | — |
| nombre | 2 | Sí, mientras `isSubmitting` o `isLoadingOptions` | Al abrir el modal (`autoFocus`) |
| capacidad | 3 | Sí, mientras `isSubmitting` o `isLoadingOptions` | — |
| codigo | — | Sí (no se muestra; no tabula) | — |

### Notas y justificaciones

Sin omisiones de capa. `tipo` se fija a `externa` (no es campo de UI). A diferencia de la interna, no hay bootstrap de layout. El DTO Nest documenta capacidad como obligatoria para internas y opcional para externas, pero el modal externo igual exige número > 0 en Front y siempre envía `capacidadSlots`. `nombre`/`capacidad` no tienen `required` HTML (el protocolo espera mensaje explícito de campo).

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
