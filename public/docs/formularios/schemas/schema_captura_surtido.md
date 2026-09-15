### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Captura de surtido (QR) |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | No |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| foto | archivo imagen (`image/*`; cámara o galería) | Sí | Selección/envío máx. 10 MB. Tras comprimir, objetivo 3.5 MB (`maxEdge` 1800, `quality` 0.72, timeout 10 s). FormData clave `foto` (también acepta `file` / `image` en la ruta). | — | No | `id_orden_venta` de la URL (no es input del formulario) | La página pública `/captura-orden/[idOrdenVenta]` fija la orden; sin id válido la API no procesa | Front sin archivo: Selecciona una foto de la hoja llenada. Front > 10 MB tras comprimir: La foto supera 10 MB y no se pudo comprimir lo suficiente. Front red: Error de red al subir. Revisa la conexión e inténtalo de nuevo. Front HTTP: el `error` del JSON o No se pudo procesar la foto ({status}). Back sin archivo: Adjunta una foto de la hoja llenada. Back peso: La foto es demasiado pesada (máx. 10 MB). Vuelve a tomarla; en el celular se comprime sola si hace falta. Back no imagen: No se pudo leer la imagen. Prueba JPG desde la galería (no HEIC). Back sin orden: Orden no encontrada. Back sin id: Falta id de orden. Back sin OpenAI: Falta configurar OPENAI_API_KEY en el servidor. | Front/Back |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| foto | 1 Tomar foto (cámara); 2 Elegir de galería | Sí, mientras `submitting` o tras éxito (`done`); pointer-events none en esos estados | — |

### Notas y justificaciones

`foto` omite BD: no hay CHECK/UNIQUE/NOT NULL sobre el archivo; `orden_venta_surtido_captura` guarda `url_foto` (nullable) y `payload` JSON. La unicidad `uq_orden_venta_surtido_captura_orden` aplica a `id_orden_venta` (parámetro de ruta, no campo de UI). Ruta pública sin auth: validación en React (`CapturaOrdenUploadForm.tsx`) y en `api/route.ts` (Next, no DTO Nest). La extracción IA corre en servidor después del upload; no pre-llena este formulario.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
