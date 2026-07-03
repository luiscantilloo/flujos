import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const p = path.resolve(__dirname, '../src/data/bodegaDatabaseSchema.js')
const s = fs.readFileSync(p, 'utf8')
const start = s.indexOf('export const ENTITIES = [')
const end = s.indexOf('export { PRISMA_TO_ENTITY }')
const head = s.slice(0, start)
const tail = s.slice(end).replace("export { PRISMA_TO_ENTITY } from './polariaWmsMeta.js'\n\n", '')

const mid = `import { ENTITIES as _SUPABASE_ENTITIES, SUPABASE_ENTITY_COUNT } from './supabaseEntities.generated.js'
import { PRISMA_TO_ENTITY, PRISMA_MODEL_COUNT } from './prismaEntityManifest.js'

/** 40 tablas public.* — sincronizado con polaria-wms-db + Supabase */
export const ENTITIES = _SUPABASE_ENTITIES

export { PRISMA_TO_ENTITY, PRISMA_MODEL_COUNT, SUPABASE_ENTITY_COUNT }

`

let notes = head.replace(
  "import { POLARIA_WMS, PRISMA_TO_ENTITY } from './polariaWmsMeta.js'",
  "import { POLARIA_WMS } from './polariaWmsMeta.js'",
)
notes = notes.replace('prismaModelCount: POLARIA_WMS.prismaModelCount,', 'prismaModelCount: 40,')
notes = notes.replace(
  'Legacy Dev Hub: slot/caja ≈ ubicacion/lote en Prisma; historial_movimiento ≈ movimiento_inventario.',
  'Fuente: polaria-wms-db migrations + prisma/schema.prisma. Auth en auth.users (Supabase).',
)

fs.writeFileSync(p, notes + mid + tail)
console.log('spliced bodegaDatabaseSchema.js')
