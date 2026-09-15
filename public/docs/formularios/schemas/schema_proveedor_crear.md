### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear proveedor |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Proveedor | Texto | Sí | Se recorta; se concatena con Nombre en razon_social (varchar(255)) como "Proveedor — Nombre" | — | No | — | El código interno se genera con generateCodigoCuentaFromNombre(proveedor o nombre); no se muestra | El proveedor es obligatorio. | Front, Back, BD |
| Nombre | Texto | Sí | Nombre de contacto; se recorta | — | No | — | Si Nombre === Proveedor, razon_social guarda solo Proveedor | El nombre es obligatorio. | Front, Back, BD |
| Teléfono | Teléfono internacional E.164 | Sí | varchar(32); isValidInternationalPhone obligatorio (no vacío) | — | No | — | Se normaliza a E.164 antes del insert | Ingresa un número de teléfono válido. / El teléfono del proveedor no es válido. | Front, Back, BD |
| Email | Correo electrónico | No | citext; type=email; vacío se guarda null; si hay valor debe coincidir con /^[^\s@]+@[^\s@]+\.[^\s@]+$/ | — | No | — | — | El correo electrónico no es válido. | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Proveedor | 1 | No | Sí, al abrir el modal |
| Nombre | 2 | No | — |
| Teléfono | 3 | No | — |
| Email | 4 | No | — |

### Notas y justificaciones

Sin cuenta activa: "No se encontró la cuenta activa.". El código (varchar(32), único por cuenta: uq_proveedor_cuenta_codigo) no es campo de UI. Si el insert falla: DomainServiceError o "No se pudo crear el proveedor.". No hay mensaje de aplicación para colisión de código.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
