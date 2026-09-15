### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Login — contraseña |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | No |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| contrasena | contraseña | Sí | No vacío; Back `@IsNotEmpty` y `@MinLength(1)`; no hay reglas de complejidad en este paso | — | No | correo_electronico del paso 1 (y `codigo_empresa` si el flow es tenant) | Solo se muestra tras un prelogin exitoso; el submit reenvía identificador y, si `flow === "tenant"`, código de empresa | Vacío: el botón Iniciar sesión queda deshabilitado (no hay mensaje de campo). 401: Credenciales inválidas. 404: Usuario no encontrado o inactivo. 403: No autorizado para esta empresa/cuenta (o el texto de API: La empresa está inactiva / La cuenta está inactiva / El usuario no pertenece a la empresa indicada). 422: Debes ingresar código de empresa. Red: Ocurrió un error inesperado. Rate limit: Hay demasiadas peticiones en poco tiempo. Espera 1 minuto e inténtalo de nuevo. | Front/Back |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| contrasena | 1 | Sí, mientras `isLoading` | — |

### Notas y justificaciones

`contrasena` omite BD: no se persiste en tablas WMS; Supabase Auth valida el secreto y la API responde `Credenciales inválidas`. El input no tiene `required` HTML; el vacío solo deshabilita el submit (el protocolo espera un mensaje explícito de obligatorio). No hay chequeo de fortaleza en login (eso aplica al alta de usuario).

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
