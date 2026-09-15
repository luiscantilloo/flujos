# Transferir cajas

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Transferir cajas |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Zona de origen | Enum (`almacenamiento` o `procesamiento`) | Sí | Solo esas dos zonas | almacenamiento | No | Picker de origen | Cambia las opciones del casillero origen. | No hay cajas en la zona seleccionada. Abrí la lupa y cambiá a almacenamiento o procesamiento. / No hay casilleros con producto en almacenamiento. / No hay cajas disponibles en procesamiento. | Front |
| Origen | UUID (`id_ubicacion`) | Sí | Slot con stock en almacenamiento (no bloqueado por OT `bodega_a_bodega`) o caja en procesamiento (sobrante / procesado / en_proceso / stock) | Vacío | No | Zona de origen, `warehouse_state`, solicitudes de procesamiento, OT | `idUbicacionOrigen` distinto de `idUbicacionDestino`. Rol `sobrante` o `procesado` agrega observación de devolución y ref. de solicitud. | Selecciona origen y destino para crear la transferencia. / Las transferencias bodega a bodega requieren origen y destino | Front/Back/BD |
| Destino | UUID (`id_ubicacion` almacenamiento) | Sí | Casilleros de almacenamiento; el slot de origen queda `disabled` | Vacío; si rol origen = sobrante, la caja de primario resuelta por OT | No | Origen | Si origen es sobrante, el destino queda fijo a la caja del primario. Si no se resuelve, no se puede enviar. | Selecciona origen y destino para crear la transferencia. / No se encontró la caja de almacenamiento del primario para devolver el sobrante. / No hay casilleros de almacenamiento configurados en esta bodega. / No hay casilleros de almacenamiento. / Las transferencias bodega a bodega requieren origen y destino | Front/Back/BD |
| Operario | UUID (`id_usuario`) | Sí | Operarios de la bodega con sesión activa | Primer operario disponible (si hay) | No | Cuenta activa, bodega activa | Igual que el resto de OT de jefe. | No hay operarios asignados a esta bodega. / Ningún operario tiene sesión activa. Espera a que un operario inicie sesión. / El operario no tiene sesión activa. / Selecciona un operario. / El operario no existe o no pertenece a esta bodega / El operario no está activo en el sistema | Front/Back/BD |
| Producto / cantidad | UUID + número | No (derivados) | Sobrante: kg sobrante y `id_producto_primario`. Procesado: unidades secundario y `id_producto_secundario`. Otro: omitidos | Según rol del origen | No | Origen en procesamiento | Solo se envían si el rol es sobrante o procesado. | No se pudo crear la orden. | Front/Back/BD |
| tipoFlujo | Enum | Sí (oculto) | `bodega_a_bodega` | bodega_a_bodega | No | — | Fijo al crear la OT. | — | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Origen | 1 | No (salvo `isSubmitting`) | — |
| Zona de origen | 2 (toolbar del picker de origen) | No | — |
| Destino | 3 | Sí cuando `destinoFijo` (sobrante) o no hay casilleros; el slot origen del picker destino está `disabled` | — |
| Operario | 4 | Sí mientras carga o si no hay elegibles | — |
| Cancelar | 5 | Sí si `isSubmitting` | — |
| Crear orden | 6 | Sí si `!canSubmit` o `isSubmitting` | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Zona de origen | No | — | Sí |
| Origen | Sí | Información de BD | Sí |
| Destino | Sí | Información de BD | Sí, excepto sobrante |
| Operario | Sí | Información de BD | Sí |
| Producto / cantidad | Sí | Información de BD | No |

### Notas y justificaciones

El destino del sobrante se reintegra a la misma caja del primario (no crea otra). Las observaciones concatenan rol de devolución y referencia de solicitud. No hay extracción IA.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
