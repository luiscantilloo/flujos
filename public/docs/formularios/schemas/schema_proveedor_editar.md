### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar proveedor |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Código | Texto (solo lectura) | Sí | varchar(32) | proveedor.codigo | Sí (por cuenta: uq_proveedor_cuenta_codigo) | Proveedor abierto | No se envía en el update | — | Front, BD |
| Proveedor | Texto | Sí | Parte empresa de razon_social (varchar(255)) | proveedor.proveedor | No | Proveedor abierto | Se recompone razon_social = "Proveedor — Nombre" | El proveedor es obligatorio. | Front, Back, BD |
| Nombre | Texto | Sí | Nombre de contacto | proveedor.nombre | No | Proveedor abierto | — | El nombre es obligatorio. | Front, Back, BD |
| Teléfono | Teléfono internacional E.164 | Sí | varchar(32); isValidInternationalPhone obligatorio | proveedor.telefono o "" | No | Proveedor abierto | Se normaliza a E.164 | Ingresa un número de teléfono válido. / El teléfono del proveedor no es válido. | Front, Back, BD |
| Email | Correo electrónico | No | citext; vacío → null; si hay valor /^[^\s@]+@[^\s@]+\.[^\s@]+$/ | proveedor.email o "" | No | Proveedor abierto | — | El correo electrónico no es válido. | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Código | 1 | Sí (siempre, readOnly) | — |
| Proveedor | 2 | No | Sí, al abrir el modal |
| Nombre | 3 | No | — |
| Teléfono | 4 | No | — |
| Email | 5 | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Código | Sí | Información de BD | No |
| Proveedor | Sí | Información de BD | Sí |
| Nombre | Sí | Información de BD | Sí |
| Teléfono | Sí | Información de BD | Sí |
| Email | Sí | Información de BD | Sí |

### Notas y justificaciones

El código no se modifica (solo lectura). Sin cuenta: "No se encontró la cuenta activa.". Si falla: DomainServiceError o "No se pudo actualizar el proveedor.". Falta el identificador del proveedor. no se muestra en UI porque el modal no abre sin fila.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
