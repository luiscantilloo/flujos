### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar usuario |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Código | Texto (solo lectura) | Sí | username citext; no se envía en el PATCH | usuario.codigo | Sí (global: uq_usuario_username) | Usuario abierto | Se muestra el username persistido; no es editable | — | Front, BD |
| Nombre | Texto | Sí | varchar(255); se recorta al guardar | usuario.nombre | No | Usuario abierto | — | El nombre es obligatorio. | Front, Back, BD |
| Rol | Texto (solo lectura) | Sí | Fijo: Operador de cuenta | Operador de cuenta | No | — | El panel admin solo edita operadores de cuenta; el rol no viaja en el PATCH | No se puede administrar un usuario configurador desde este endpoint / No puedes administrar este usuario desde este endpoint | Front, Back, BD |
| Asignado | Texto (solo lectura) | Sí | Razón social o código de empresa de sesión | session.razonSocialEmpresa o codigoEmpresa o "—" | No | Sesión / empresa activa | No se envía en el PATCH | Usuario no encontrado | Front, Back, BD |
| Correo | Correo electrónico | Sí | citext; type=email; se recorta y en API se pasa a minúsculas | usuario.correo | Sí (global: uq_usuario_correo) | Usuario abierto | Si cambia, Auth también actualiza el email | El correo es obligatorio. / El correo ya está en uso | Front, Back, BD |
| Teléfono | Teléfono internacional E.164 | No | varchar(32); si el listado trae "—" se abre vacío | usuario.telefono, o "" si era "—" | No | Usuario abierto | Si hay valor, debe pasar isValidInternationalPhone; vacío se guarda null | Ingresa un número de teléfono válido. | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Código | 1 | Sí (siempre, readOnly) | — |
| Nombre | 2 | No | Sí, al abrir el modal |
| Rol | 3 | Sí (siempre, readOnly) | — |
| Asignado | 4 | Sí (siempre, readOnly) | — |
| Correo | 5 | No | — |
| Teléfono | 6 | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Código | Sí | Información de BD | No |
| Nombre | Sí | Información de BD | Sí |
| Asignado | Sí | Información de BD | No |
| Correo | Sí | Información de BD | Sí |
| Teléfono | Sí | Información de BD | Sí |

### Notas y justificaciones

La descripción del modal dice: "Puedes cambiar cualquier dato excepto el código.". El PATCH es `PATCH /administracion/usuarios/:idUsuario` con nombre, correo y telefono. Si falla se muestra el DomainServiceError o "No se pudo actualizar el usuario.". Falta el identificador del usuario. no aparece en UI porque el modal no abre sin fila.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
