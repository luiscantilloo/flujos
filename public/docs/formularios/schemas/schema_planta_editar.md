### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar planta |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Código | Texto (solo lectura) | Sí | varchar(32) | planta.codigo | Sí (por cuenta: uq_planta_cuenta_codigo) | Planta abierta | No se envía en el update | — | Front, BD |
| Nombre | Texto | Sí | varchar(255) | planta.nombre | No | Planta abierta | — | El nombre de la planta es obligatorio. | Front, Back, BD |
| Dirección | Texto | Sí | text | planta.direccion | No | Planta abierta | — | La dirección de la planta es obligatoria. | Front, Back, BD |
| Cap. pallets | Número entero | No | min=0; step=1; vacío → null; si hay valor entero > 0 | String(planta.capacidadPallets) o "" | No | Planta abierta | — | La capacidad de pallets debe ser un entero mayor a cero. | Front, Back, BD |
| Rango térmico | Texto | No | varchar(64); vacío → null | planta.rangoTemperatura o "" | No | Planta abierta | — | — | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Código | 1 | Sí (siempre, readOnly) | — |
| Nombre | 2 | No | Sí, al abrir el modal |
| Dirección | 3 | No | — |
| Cap. pallets | 4 | No | — |
| Rango térmico | 5 | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Código | Sí | Información de BD | No |
| Nombre | Sí | Información de BD | Sí |
| Dirección | Sí | Información de BD | Sí |
| Cap. pallets | Sí | Información de BD | Sí |
| Rango térmico | Sí | Información de BD | Sí |

### Notas y justificaciones

El código es de solo lectura. Sin cuenta: "No se encontró la cuenta activa.". Si falla: DomainServiceError o "No se pudo actualizar la planta.".

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
