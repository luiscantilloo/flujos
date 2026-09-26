### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Gestión de precios de compradores (exportar / importar / imprimir) |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.1.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Campos nuevos o modificados | Filtros de exportación (grupos + productos), alcance de impresión, archivo Excel de importación |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 25/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Archivo Excel (importar) | Archivo (.xlsx / .xls) | Sí al importar | Filas parseadas por comprador-precios-import | — | No | — | Validación en cliente; aplica a todos los compradores del grupo | Mensajes de import (filas inválidas / sin filas) del util de import | Front, Back, BD |
| Grupos pertenecientes (exportar) | Selección múltiple | Sí al exportar | Nombres desde `tmp_grupo_perteneciente` (+ grupos ya usados en compradores) | Todos los del catálogo | No | Catálogo BD / tmp | Al menos un grupo | — | Front |
| Productos (exportar) | Selección múltiple | Sí al exportar | idProducto de `tmp_producto_mas_vendido` | Todos los de la tmp | No | Lista tmp productos | Al menos un producto | No hay productos más vendidos cargados. | Front |
| Fecha inicio / Fecha final (exportar) | Fecha | Sí al exportar | ISO date | Mes en curso → hoy | No | — | inicio ≤ fin | La fecha inicio no puede ser posterior a la fecha final. | Front |
| Grupos pertenecientes (imprimir) | Selección múltiple | Sí al imprimir | Igual que exportar | Todos | No | Catálogo BD / tmp | Al menos un grupo | — | Front |
| Comprador (imprimir) | Selección | Sí al imprimir | Todos del grupo o codigoComprador filtrado | Todos los de los grupos | No | Grupos seleccionados | mode grupos \| one | — | Front |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Acciones (Exportar / Importar / Imprimir) | 1–3 | Sí mientras isBusy o flags *Disabled | — |
| Grupos / Productos | 1–N (paso exportar) | Sí mientras isExporting | — |
| Alcance de impresión | 1 (paso imprimir) | Sí mientras isPrinting | — |

### Notas y justificaciones

No es un formulario de campos de dominio clásico: orquesta export/import/print. La exportación genera una fila por **comprador × producto** (columnas: grupo, código comprador, comprador, código/nombre producto, equivalencia, precio actual, precio nuevo). `Precio nuevo` sale en gris (fondo + número); al cambiarlo, fondo verde suave y número blanco; solo acepta números con coma. La importación aplica por código de comprador.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.1 |
| Fecha de aprobación | 25/09/2026 |
| Aprobado por | Desarrollador frontend |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
