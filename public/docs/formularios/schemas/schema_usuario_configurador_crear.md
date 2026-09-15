### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear usuario (plataforma) |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nombre | texto | Sí | Trim no vacío; debe producir username vía `generateCodigoCuentaFromNombre`; BD `varchar(255)` NOT NULL | — | No | — | — | El nombre es obligatorio. | Front/Back/BD |
| rol | enumeración (`WmsRol`) | Sí | Uno de los roles WMS del picker; Back `@IsEnum(WmsRol)` | — | No | — | Al cambiar se limpian `codigo_cuenta` e `id_bodega` | Selecciona un rol. Carga: No se pudieron cargar roles, cuentas o bodegas. Back si eliges Configurador / plataforma: No se puede crear un usuario configurador desde este endpoint / No se puede crear un usuario de plataforma desde este endpoint / Rol no válido. | Front/Back/BD |
| asignado | texto o enumeración (según rol) | Condicional | Si el rol es de cuenta: `codigo_cuenta` obligatorio. Si es de bodega: `id_bodega` UUID obligatorio (y `codigo_cuenta` se toma de la bodega). Si es Configurador: valor fijo «Administrativo», no editable. Sin rol: placeholder | — | No | rol | Tipo de control: `USUARIO_ASIGNACION_POR_ROL`. Labels: Cuenta / Bodega / Administrativo / Asignado | Front cuenta: Selecciona la cuenta a asignar. Front bodega: Selecciona la bodega a asignar. Front servicio: La cuenta seleccionada no es válida. / La bodega seleccionada no es válida. Back: codigoEmpresa y codigoCuenta son obligatorios para roles de cuenta / …para roles de bodega; idBodega es obligatorio para roles de bodega; idBodega no aplica para roles de nivel cuenta; Cuenta no encontrada; La bodega no pertenece a la cuenta indicada; La empresa está inactiva; La cuenta está inactiva; La bodega está inactiva. | Front/Back/BD |
| correo | correo electrónico | Sí | Trim no vacío; input `type="email"`; Back `@IsEmail`; BD UNIQUE | — | Sí | — | — | Front servicio: El correo es obligatorio. Back duplicado: El correo ya está en uso. Si `type="email"` con valor no vacío inválido, mensaje nativo HTML5 del navegador. | Front/Back/BD |
| telefono | teléfono E.164 | No | Opcional; si hay valor se normaliza y debe ser internacional válido; BD `varchar(32)` nullable | — (país por defecto CO) | No | — | — | Ingresa un número de teléfono válido. | Front/Back/BD |
| clave | contraseña | Sí | `analyzePassword`: mín. 8; 1 mayúscula; 1 minúscula; 1 número; 1 especial `[!@#$%^&*()_\-+=[\]{};:,.?/]`; no lista de comunes. Front servicio extra: clave.trim() ≥ 8. Back `@MinLength(8)` | — | No | — | — | Primer error de `analyzePassword`: La contraseña es obligatoria. / Debe tener al menos 8 caracteres. / Debe incluir al menos una mayúscula. / Debe incluir al menos una minúscula. / Debe incluir al menos un número. / Debe incluir al menos un carácter especial. / Esa contraseña es demasiado común. Fallback UI: La contraseña no es válida. Servicio: La clave debe tener al menos 8 caracteres. | Front/Back |
| codigo | texto (username) | Sí | Hash 5 caracteres desde `nombre`; Back `username` `@IsNotEmpty`; BD UNIQUE | Hash derivado de `nombre` (oculto) | Sí | nombre | No hay input visible | El código es obligatorio. Back duplicado: El username ya está en uso. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| nombre | 1 | Sí, mientras `isSubmitting` o `isLoadingOptions` | Al abrir el modal (`autoFocus`) |
| rol | 2 | Sí, mientras `isSubmitting` o `isLoadingOptions` | — |
| asignado | 3 si el control está habilitado; — si está `disabled`/`readOnly` (sin rol o Administrativo) | Sí si no hay rol, si el rol es Administrativo, o mientras carga/envía | — |
| correo | 4 | Sí, mientras `isSubmitting` o `isLoadingOptions` | — |
| telefono | 5 | Sí, mientras `isSubmitting` o `isLoadingOptions` | — |
| clave | 6 | Sí, mientras `isSubmitting` o `isLoadingOptions` | — |
| codigo | — | Sí (no se muestra; no tabula) | — |

### Notas y justificaciones

`clave` omite BD: el secreto vive en Supabase Auth, no en `usuario`. `correo` y `nombre` no usan `required` HTML (el protocolo espera mensaje explícito de campo; hoy sale al submit). El picker incluye el rol Configurador, pero el endpoint Nest lo rechaza. Fallo genérico del modal: No se pudo crear el usuario.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
