### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Bodegas asignadas / default |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| id_bodega_default | UUID (radio por fila de bodega asignada) | Sí (si hay bodegas; si la lista está vacía no hay submit) | Debe ser `id_bodega` de una bodega activa con `codigo_cuenta` igual a la cuenta abierta; BD `id_bodega_default` UUID nullable FK | Si hay `idBodegaDefault` vigente y sigue en la lista, esa; si hay exactamente una bodega, esa; si no, — | No (una default por cuenta) | codigo_cuenta (contexto del modal, no input) | Solo se listan bodegas ya asignadas a la cuenta. Guardar exige una selección. Nombre/tipo/capacidad de la tabla son solo lectura | Selecciona una bodega por defecto. Servicio: La bodega por defecto debe estar activa y asignada a esta cuenta. / Cuenta no encontrada. / El código de la cuenta es obligatorio. Fallo genérico: No se pudo guardar la bodega por defecto. Lista vacía (copy, no error de campo): No hay bodegas asignadas a esta cuenta. | Front/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| id_bodega_default | 1…N radios `name="bodega-default"` en el orden visual de la tabla (una parada por bodega) | No los radios; el botón Guardar bodega por defecto se deshabilita si no hay selección o no hay bodegas | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| id_bodega_default | Sí | Información de BD | Sí |

### Notas y justificaciones

`id_bodega_default` omite Back: `updateCuentaBodegaDefaultConfigurator` escribe en Supabase (`cuenta.id_bodega_default`) y no llama al PATCH Nest, aunque `UpdateCuentaDto` sí declara `idBodegaDefault`. BD: columna UUID nullable + FK a `bodega`. Las columnas Nombre, Tipo y Capacidad no son campos editables. `codigo_cuenta` llega como prop del listado.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
