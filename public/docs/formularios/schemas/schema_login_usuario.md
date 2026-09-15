### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Login — correo y empresa |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | No |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| correo_electronico | correo electrónico | Sí | No vacío; regex Front `^[^\s@]+@[^\s@]+\.[^\s@]+$`; input `type="email"` | — | No | — | — | Vacío: el botón Continuar queda deshabilitado (no hay mensaje de campo). Formato: Ingresa un correo electrónico válido. Si `type="email"` bloquea el submit antes del JS, el navegador muestra su mensaje nativo HTML5. Back WMS: El identificador debe ser un correo electrónico válido. No encontrado: Usuario no encontrado o inactivo. Red: Ocurrió un error inesperado. Rate limit: Hay demasiadas peticiones en poco tiempo. Espera 1 minuto e inténtalo de nuevo. | Front/Back |
| codigo_empresa | enumeración (código de empresa) | Condicional | Código existente de empresa activa asociada al correo | — | No | correo_electronico | El selector Empresa solo se muestra si `/login/resolve-tenant` devuelve más de una empresa. Con exactamente una, el código se toma solo (campo oculto). Con cero (p. ej. configurador), no se envía. Si hay varias y no hay selección: no avanza. | Selecciona la empresa a la que perteneces. Carga fallida: No se pudo contactar el servicio de resolución de empresa. / No se pudo resolver la empresa. Intenta de nuevo más tarde. Back 422 (mapeado en cliente): Debes ingresar código de empresa. 403: El usuario no pertenece a la empresa indicada / La empresa está inactiva / La cuenta está inactiva (según respuesta). | Front/Back |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| correo_electronico | 1 | Sí, mientras `isLoading` | — |
| codigo_empresa | 2 (solo si el selector está visible; si no, —) | Sí, mientras `isLoading`; no tabula si el selector está oculto | — |

### Notas y justificaciones

`correo_electronico` y `codigo_empresa` omiten BD en Capas: el paso 1 no inserta ni actualiza filas; consulta `usuario`/`empresa` y llama `POST /auth/prelogin`. `usuario.correo` es UNIQUE en Prisma, pero aquí es clave de búsqueda, no regla de alta. El input de correo no tiene `required` HTML; el vacío solo deshabilita Continuar (el protocolo espera un mensaje explícito de obligatorio). `codigo_empresa` no se persiste en este paso.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
