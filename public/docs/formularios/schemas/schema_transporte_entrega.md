# Registrar entrega

### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Registrar entrega |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí (Información de BD) |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Verificado (por línea de OV) | Booleano | Sí todas las líneas en el paso 1 | Una casilla por línea de `getOrdenVentaDetalle` | `false` | No | Detalle de la venta del viaje | `canGoNext` paso 0 exige todas en true y cantidad parseable. | Verificá todos los productos e indicá la cantidad entregada. | Front |
| Cantidad entregada (por línea) | Número (`type=number`, min 0, coma o punto) | Sí | Finito mayor o igual a 0. Back `@Min(0)` por línea. Debe cubrir todas las líneas de la OV. | `String(linea.cantidad_pedida)` | No | Línea de OV | `parseCantidad`: vacío o no finito o menor a 0 → inválido. | Verificá todos los productos e indicá la cantidad entregada. / Revisá las cantidades entregadas: hay un valor inválido. / Debés indicar la cantidad entregada de todas las líneas / Una línea de entrega no pertenece a la venta | Front/Back/BD |
| Evidencia de la entrega (foto) | Archivo imagen | Sí | `image/*`, tamaño máximo 10 MB (`MAX_EVIDENCIA_BYTES`) | Ninguno | No | Paso 2 | Se sube a Cloudinary (`/api/evidencia-transporte`) y se envía `evidenciaFotoUrl` (`@IsUrl`). | La foto de evidencia es obligatoria. / La imagen supera 10 MB. / Solo se permiten imágenes. / No se pudo subir la evidencia (Error de red). / Error al subir la evidencia. / Cloudinary no devolvió URL de evidencia. | Front/Back/BD |
| Firma de quien recibe | Imagen JPEG (canvas → data URL) | Sí | Canvas 400×160, JPEG calidad 0.82 | Vacía | No | Paso 3 | Debe haber trazo (`firmaDibujadaRef` o `firmaDataUrl`). Se sube como `firma-entrega.jpg`. | La firma de quien recibe es obligatoria. | Front/Back/BD |
| Conformidad | Booleano (`entregaConforme`) | Sí | Sí, conforme / No conforme | `null` (sin elegir) | No | Paso 4 | No se cierra si sigue `null`. | Indicá si el pedido fue conforme (sí o no). | Front/Back/BD |
| ¿Por qué no? (`descripcionIncidencia`) | Texto | Sí si conformidad = no | Trim no vacío. Back: mismo criterio. | Vacío; se limpia si pasa a conforme | No | Conformidad = no | Front y back. | Si no estás conforme, describí el motivo antes de cerrar. / Si la entrega no es conforme, describí el motivo | Front/Back/BD |
| Viaje / guía / OV | UUID de contexto | Sí | El viaje debe tener `idGuia` e `idOrdenVenta` | Del `ViajeEntregaRow` | Sí por guía | Viaje abierto | — | Falta información del viaje o de la bodega. / El viaje no tiene guía u orden de venta asociada. / Completá todos los pasos antes de cerrar la entrega. / Viaje no encontrado / Guía de envío no encontrada / Orden de venta no encontrada / El viaje no está en un estado entregable / Esta guía ya fue entregada / La orden de venta ya está cerrada / Usuario no autenticado / No se pudo cerrar la entrega. | Front/Back/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Verificado | Por línea, paso 1 | No (salvo `saving`) | — |
| Cantidad entregada | Por línea, después del checkbox | No | — |
| Siguiente | Pie paso 1–3 | Sí si `saving`, `loadingDetalle` o no hay detalle | — |
| Evidencia de la entrega (foto) | Paso 2 | Input file cubre el dropzone | — |
| Firma de quien recibe | Paso 3 (canvas pointer) | No | — |
| Limpiar firma | Después del canvas | No | — |
| Conformidad (Sí / No) | Paso 4 | No | — |
| ¿Por qué no? | Después de No conforme | Oculto si conforme o sin elegir | — |
| Anterior | Pie si el paso es mayor a 0 | Sí si `saving` | — |
| Cerrar entrega | Pie paso 4 | Sí si `saving`, `loadingDetalle` o no hay detalle | — |
| Cancelar | Siempre en pie | Sí si `saving` (el modal no cierra) | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Producto / pedido kg | Sí | Información de BD | No (etiqueta); la cantidad entregada sí |
| Cantidad entregada | Sí | Información de BD | Sí |
| Viaje / OV / cliente (título) | Sí | Información de BD | No |

### Notas y justificaciones

Wizard de 4 pasos (`PASOS_ENTREGA = 4`) en `TransporteEntregaModal`. `asForm={false}`; el cierre es el botón Cerrar entrega. El resultado `ok` / `no_ok` combina conformidad y coincidencia de cantidades en back. No hay extracción IA.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
