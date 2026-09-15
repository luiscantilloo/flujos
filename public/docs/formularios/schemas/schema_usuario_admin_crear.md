### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Asignar usuario |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nombre | Texto | Sí | varchar(255); se recorta al guardar; genera el username (5 caracteres A-Z0-9) | — | Sí (username derivado, global: uq_usuario_username) | — | El username se genera con generateCodigoCuentaFromNombre(nombre) y no se muestra | El nombre es obligatorio. / El username ya está en uso | Front, Back, BD |
| Rol | Texto (solo lectura) | Sí | Fijo: Operador de cuenta | Operador de cuenta | No | — | El alta siempre envía idRol = operador_cuenta | No se puede crear un usuario configurador desde este endpoint / Rol no permitido para administración de cuenta | Front, Back, BD |
| Asignado | Texto (solo lectura) | Sí | Razón social de la empresa de sesión, o código de empresa | session.razonSocialEmpresa o codigoEmpresa o "—" | No | Sesión / empresa activa | Se toma de la sesión WMS; el POST usa el contexto tenant (empresa + cuenta) | No se encontró el contexto de cuenta o empresa. / No se encontró la empresa activa. / El contexto tenant debe incluir empresa y cuenta activas | Front, Back, BD |
| Correo | Correo electrónico | Sí | citext; type=email; se recorta y en API se pasa a minúsculas | — | Sí (global: uq_usuario_correo) | — | — | El correo es obligatorio. / El correo ya está en uso | Front, Back, BD |
| Teléfono | Teléfono internacional E.164 | No | varchar(32); países PHONE_INPUT_COUNTRIES; default CO; opcional | — | No | — | Si hay valor, debe pasar isValidInternationalPhone; se normaliza con normalizeInternationalPhone | Ingresa un número de teléfono válido. | Front, Back, BD |
| Clave | Contraseña | Sí | Mín. 8 caracteres; 1 mayúscula; 1 minúscula; 1 número; 1 especial [!@#$%^&*()_\-+=[\]{};:,.?/]; no puede ser una contraseña común; se recortan espacios | — | No | — | analyzePassword debe ser válido antes de llamar al API; el servicio exige clave.length >= 8 | La contraseña es obligatoria. / Debe tener al menos 8 caracteres. / Debe incluir al menos una mayúscula. / Debe incluir al menos una minúscula. / Debe incluir al menos un número. / Debe incluir al menos un carácter especial. / Esa contraseña es demasiado común. / La contraseña no es válida. / La clave debe tener al menos 8 caracteres. | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Nombre | 1 | No | Sí, al abrir el modal |
| Rol | 2 | Sí (siempre, readOnly) | — |
| Asignado | 3 | Sí (siempre, readOnly) | — |
| Correo | 4 | No | — |
| Teléfono | 5 | No | — |
| Clave | 6 | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Asignado | Sí | Información de BD | No |

### Notas y justificaciones

El modal no marca HTML required en Nombre, Correo ni Clave: la obligatoriedad vive en el servicio web, analyzePassword y el API Nest (`POST /administracion/usuarios`). Si falla la mutación se muestra el mensaje del DomainServiceError o "No se pudo asignar el usuario.". El username (código) no es un campo visible en el alta.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
