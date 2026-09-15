### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Restablecer contraseña |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nueva contraseña | Contraseña | Sí | Mín. 8 caracteres; 1 mayúscula; 1 minúscula; 1 número; 1 especial [!@#$%^&*()_\-+=[\]{};:,.?/]; no puede ser una contraseña común; se recortan espacios | — | No | Usuario abierto | El submit no corre si no hay usuario; analyzePassword debe ser válido; el servicio exige clave.length >= 8 | La contraseña es obligatoria. / Debe tener al menos 8 caracteres. / Debe incluir al menos una mayúscula. / Debe incluir al menos una minúscula. / Debe incluir al menos un número. / Debe incluir al menos un carácter especial. / Esa contraseña es demasiado común. / La contraseña no es válida. / La clave debe tener al menos 8 caracteres. | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Nueva contraseña | 1 | No | — |

### Notas y justificaciones

El título descriptivo usa el nombre del usuario (`Define una nueva contraseña para ${usuario.nombre}.`) pero no es un campo editable. El POST es `/administracion/usuarios/:idUsuario/password` con `{ password }`. Modal apilado (`stackLevel="elevated"`). Si falla: DomainServiceError o "No se pudo restablecer la contraseña.". El campo se vacía cada vez que se abre el modal.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
