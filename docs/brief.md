# Brief — Validación de formularios Nivel 2 (portal flujos)

**Issue:** [POL-261](https://linear.app/polaria/issue/POL-261) — Preparar JSON en flujos, Tabla 4 del MVP y datos de staging  
**Fecha comprometida (T017):** 2026-09-28  
**Repo:** `luiscantilloo/flujos` / `eldani13/flujos` (portal flujos)

## Alcance MVP

Formularios cubiertos en esta entrega:

| id | Schema MD | JSON exportado | Prellenado |
|---|---|---|---|
| `camion_crear` | `public/docs/formularios/schemas/schema_camion_crear.md` | `public/docs/formularios/schemas-json/schema_camion_crear.json` | No |
| `camion_editar` | `public/docs/formularios/schemas/schema_camion_editar.md` | `public/docs/formularios/schemas-json/schema_camion_editar.json` | Información de BD |
| `pedido_venta` | `public/docs/formularios/schemas/schema_pedido_venta.md` | `public/docs/formularios/schemas-json/schema_pedido_venta.json` | Ambas (IA + BD) |

Cada uno incluye **Tabla 4 — Prueba automatizada del Nivel 2** (acceso, botones, localizadores y valores de prueba).

## Conversor portable

- Archivo único: [`scripts/schema-a-json.mjs`](../scripts/schema-a-json.mjs)
- Sin dependencias locales del portal (apto para copiar al plugin de validación)
- Formato de salida: **Formato 1.0** — [FORMATO_JSON_EXPORTACION_SCHEMAS_FORMULARIOS_v1.0.md](https://github.com/PolariaTech/validacion-formularios/blob/main/FORMATO_JSON_EXPORTACION_SCHEMAS_FORMULARIOS_v1.0.md)
- Salida por defecto: `public/docs/formularios/schemas-json/schema_<id>.json`

```bash
node scripts/schema-a-json.mjs public/docs/formularios/schemas/schema_camion_crear.md
node scripts/schema-a-json.mjs --mvp
node scripts/schema-a-json.mjs --all
node scripts/schema-a-json.mjs --self-check
node scripts/schema-a-json.test.mjs
```

## Staging / workflows

Ver [`docs/workflows/configuracion.md`](workflows/configuracion.md). La rama fija de staging quedó invalidada por [POL-268](https://linear.app/polaria/issue/POL-268) (preview por rama en Vercel).
