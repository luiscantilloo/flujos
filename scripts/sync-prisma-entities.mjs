/**
 * Genera ENTITIES alineadas a Supabase/Prisma.
 * Uso: node scripts/sync-prisma-entities.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const manifestPath = path.resolve(__dirname, '../src/data/prismaEntityManifest.js')
const entitiesPath = path.resolve(__dirname, '../src/data/supabaseEntities.generated.js')

/** Orden: env → clone local (dev) → copia embebida (Vercel/CI) */
const PRISMA_SCHEMA_CANDIDATES = [
  process.env.POLARIA_WMS_API_SCHEMA,
  path.resolve(__dirname, '../../polaria-wms-api/prisma/schema.prisma'),
  path.resolve(__dirname, '../vendor/polaria-wms-api/prisma/schema.prisma'),
].filter(Boolean)

function resolvePrismaSchemaPath() {
  for (const candidate of PRISMA_SCHEMA_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

const DOMAIN_BY_TABLE = {
  rol: 'rbac',
  empresa: 'platform',
  cuenta: 'platform',
  bodega: 'platform',
  solicitud_alta_bodega: 'platform',
  asignacion_bodega: 'rbac',
  usuario: 'rbac',
  solicitud_integracion: 'platform',
  tarea_cuenta: 'platform',
  proveedor: 'catalog',
  cliente: 'catalog',
  producto: 'catalog',
  comprador: 'catalog',
  planta: 'catalog',
  camion: 'catalog',
  solicitud_compra: 'purchase',
  solicitud_compra_linea: 'purchase',
  orden_compra: 'purchase',
  orden_compra_linea: 'purchase',
  recepcion_compra: 'purchase',
  recepcion_compra_linea: 'purchase',
  tipo_ubicacion: 'warehouse',
  zona: 'warehouse',
  ubicacion: 'warehouse',
  lote: 'warehouse',
  warehouse_state: 'warehouse',
  movimiento_inventario: 'warehouse',
  orden_trabajo: 'warehouse',
  orden_trabajo_linea: 'warehouse',
  alerta_operativa: 'warehouse',
  tarea_cola: 'warehouse',
  solicitud_procesamiento: 'processing',
  registro_merma: 'processing',
  orden_venta: 'sales',
  orden_venta_linea: 'sales',
  viaje_transporte: 'sales',
  guia_envio: 'sales',
  evidencia_transporte: 'sales',
  contador: 'system',
  auditoria_operacion: 'system',
}

const STATUS_ICON = { done: '✅', partial: '🟡', design: '🔵' }

const STATUS_BY_TABLE = {
  rol: 'done', empresa: 'done', cuenta: 'done', bodega: 'done',
  solicitud_alta_bodega: 'done', asignacion_bodega: 'done', usuario: 'done',
  solicitud_integracion: 'done', solicitud_compra: 'done', solicitud_compra_linea: 'done',
  orden_compra: 'done', orden_compra_linea: 'done',
  proveedor: 'done', cliente: 'done', producto: 'done', comprador: 'done', planta: 'done', camion: 'done',
}

const DISPLAY_NAMES = {
  rol: 'Rol WMS',
  empresa: 'Empresa (cliente SaaS)',
  cuenta: 'Tenant (cuenta)',
  bodega: 'Bodega',
  solicitud_alta_bodega: 'Solicitud alta bodega',
  asignacion_bodega: 'Asignación bodega',
  usuario: 'Usuario',
  tipo_ubicacion: 'Tipo ubicación',
  zona: 'Zona',
  ubicacion: 'Ubicación (slot)',
  proveedor: 'Proveedor',
  cliente: 'Cliente',
  producto: 'Producto',
  comprador: 'Comprador',
  planta: 'Planta',
  camion: 'Camión',
  solicitud_compra: 'Solicitud compra (SOL)',
  solicitud_compra_linea: 'Línea SOL',
  orden_compra: 'Orden compra (OC)',
  orden_compra_linea: 'Línea OC',
  recepcion_compra: 'Recepción compra',
  recepcion_compra_linea: 'Línea recepción',
  lote: 'Lote',
  warehouse_state: 'Inventario en vivo (warehouse_state)',
  movimiento_inventario: 'Movimiento inventario',
  contador: 'Contador documentos',
  auditoria_operacion: 'Auditoría operación',
  orden_trabajo: 'Orden trabajo',
  orden_trabajo_linea: 'Línea OT',
  orden_venta: 'Orden venta (OV)',
  orden_venta_linea: 'Línea OV',
  viaje_transporte: 'Viaje transporte',
  guia_envio: 'Guía envío',
  evidencia_transporte: 'Evidencia transporte',
  solicitud_procesamiento: 'Solicitud procesamiento',
  registro_merma: 'Registro merma',
  alerta_operativa: 'Alerta operativa',
  tarea_cola: 'Tarea cola',
  solicitud_integracion: 'Solicitud integración',
  tarea_cuenta: 'Tarea cuenta',
}

const SCOPE_C_ONLY = new Set([
  'proveedor', 'cliente', 'producto', 'comprador', 'planta', 'camion',
  'contador', 'auditoria_operacion', 'solicitud_integracion', 'tarea_cuenta',
])

const DESC_BY_TABLE = {
  rol: 'Catálogo de 9 roles WMS (seed). Scope plataforma / cuenta / bodega.',
  empresa: 'Cliente jurídico SaaS. Creada por configurador TI.',
  cuenta: 'Tenant operativo (codigo_cuenta). Scope C en catálogos y documentos.',
  bodega: 'Bodega interna/externa. Alta vía POST /configuracion/bodegas (API).',
  solicitud_alta_bodega: 'Admin cuenta solicita bodega; configurador atiende.',
  usuario: 'Perfil WMS; id_auth → Supabase auth.users (no tabla en public).',
  warehouse_state: 'Stock en vivo por ubicación+producto+lote. Escritura solo API.',
  movimiento_inventario: 'Historial append-only. Escritura solo API (Prisma bypass RLS).',
  contador: 'Numeración OC/OV/TV. Escritura solo API.',
  auditoria_operacion: 'Log operativo. INSERT solo backend.',
  solicitud_integracion: 'Operador solicita integración bodega externa → configurador.',
}

function prismaTypeToFieldType(raw) {
  if (raw.includes('String')) return 'varchar'
  if (raw.includes('Int') || raw.includes('BigInt')) return 'int'
  if (raw.includes('Decimal')) return 'decimal'
  if (raw.includes('Boolean')) return 'boolean'
  if (raw.includes('DateTime')) return 'timestamptz'
  if (raw.includes('Json')) return 'jsonb'
  if (/^[A-Z]\w+$/.test(raw.trim()) && !['String', 'Int', 'Boolean', 'DateTime', 'Decimal', 'BigInt', 'Json'].includes(raw.trim())) {
    return 'enum'
  }
  return 'varchar'
}

function parseModels(src) {
  const blocks = [...src.matchAll(/^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm)]
  return blocks.map(([, name, body]) => {
    const mapMatch = body.match(/@@map\("([^"]+)"\)/)
    const table = mapMatch?.[1] ?? name
    const fields = []
    const relations = []

    for (const line of body.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue

      const scalar = trimmed.match(/^(\w+)\s+([\w\[\]?]+)([\s\S]*?)$/)
      if (!scalar) continue
      const [, fname, ftype, rest] = scalar
      if (['model', 'enum'].includes(fname)) continue
      // relation array field
      if (ftype.endsWith('[]') && /^[A-Z]/.test(ftype.replace('[]', ''))) continue

      const colMatch = rest.match(/@map\("([^"]+)"\)/)
      const column = colMatch?.[1] ?? fname.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
      const isPk = rest.includes('@id')
      const isOptional = ftype.endsWith('?')
      const fkMatch = rest.match(/@relation\([\s\S]*?fields:\s*\[(\w+)\][\s\S]*?references:\s*\[(\w+)\]/)
      const fkEntityMatch = rest.match(/^\s*(\w+)\s+\w+.*@relation/)

      if (ftype.match(/^[A-Z]/) && !['String', 'Int', 'Boolean', 'DateTime', 'Decimal', 'BigInt', 'Json'].includes(ftype.replace('?', ''))) {
        if (!rest.includes('@relation')) continue
      }

      fields.push({
        name: column,
        type: prismaTypeToFieldType(ftype.replace('?', '')),
        pk: isPk,
        nullable: isOptional,
        ...(fkMatch
          ? { fk: `${inferTableFromField(fkMatch[1], table)}.${snakeField(fkMatch[2])}` }
          : {}),
      })
    }

    // infer relations from FK fields pointing to other tables
    for (const f of fields) {
      if (f.fk) {
        const [refTable] = f.fk.split('.')
        if (refTable !== table) {
          relations.push({ card: 'N', entity: refTable, label: f.name })
        }
      }
    }

    return { prisma: name, table, fields, relations }
  })
}

function snakeField(camel) {
  return camel.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
}

function inferTableFromField(fieldName, _self) {
  const map = {
    codigoEmpresa: 'empresa',
    codigoCuenta: 'cuenta',
    idBodega: 'bodega',
    idUsuario: 'usuario',
    idRol: 'rol',
    idProveedor: 'proveedor',
    idCliente: 'cliente',
    idProducto: 'producto',
    idComprador: 'comprador',
    idPlanta: 'planta',
    idCamion: 'camion',
    idSolicitudCompra: 'solicitud_compra',
    idOrdenCompra: 'orden_compra',
    idOrdenVenta: 'orden_venta',
    idViaje: 'viaje_transporte',
    idGuia: 'guia_envio',
    idUbicacion: 'ubicacion',
    idZona: 'zona',
    idTipoUbicacion: 'tipo_ubicacion',
    idLote: 'lote',
    idSolicitud: 'solicitud_alta_bodega',
    idSolicitudProcesamiento: 'solicitud_procesamiento',
    idOrdenTrabajo: 'orden_trabajo',
    idRecepcion: 'recepcion_compra',
    idLineaOrdenCompra: 'orden_compra_linea',
    idLineaOrdenVenta: 'orden_venta_linea',
    idSolicitudIntegracion: 'solicitud_integracion',
    idTareaCuenta: 'tarea_cuenta',
    idCreador: 'usuario',
    idSolicitante: 'usuario',
    idAtendidoPor: 'usuario',
    cerradaPor: 'usuario',
    idTransportista: 'usuario',
    idAsignado: 'usuario',
    idResponsable: 'usuario',
    lockedBy: 'usuario',
  }
  return map[fieldName] ?? snakeField(fieldName.replace(/^id/, '').replace(/^(codigo)/, 'codigo_'))
}

const prismaPath = resolvePrismaSchemaPath()
if (!prismaPath) {
  const hasGenerated = fs.existsSync(manifestPath) && fs.existsSync(entitiesPath)
  if (hasGenerated) {
    console.warn(
      'sync-prisma-entities: schema.prisma no encontrado — usando archivos generados existentes',
    )
    console.warn('  Buscado en:', PRISMA_SCHEMA_CANDIDATES.join('\n  '))
    process.exit(0)
  }
  console.error('sync-prisma-entities: schema.prisma no encontrado. Rutas probadas:')
  for (const p of PRISMA_SCHEMA_CANDIDATES) console.error(' ', p)
  process.exit(1)
}

const prismaSrc = fs.readFileSync(prismaPath, 'utf8')
const models = parseModels(prismaSrc)

const PRISMA_TO_ENTITY = Object.fromEntries(models.map((m) => [m.prisma, m.table]))

const manifest = models.map((m) => ({
  id: m.table,
  prismaModel: m.prisma,
  table: m.table,
  domain: DOMAIN_BY_TABLE[m.table] ?? 'system',
  physical: `public.${m.table}`,
  implementationStatus: STATUS_BY_TABLE[m.table] ?? 'partial',
  scope: SCOPE_C_ONLY.has(m.table) ? 'C' : 'C+B',
}))

const entities = models.map((m) => {
  const status = STATUS_BY_TABLE[m.table] ?? 'partial'
  const icon = STATUS_ICON[status]
  const scope = SCOPE_C_ONLY.has(m.table) ? 'C' : 'C+B'
  return {
    id: m.table,
    domain: DOMAIN_BY_TABLE[m.table] ?? 'system',
    name: DISPLAY_NAMES[m.table] ?? m.prisma,
    table: m.table,
    physical: `public.${m.table}`,
    prismaModel: m.prisma,
    scope,
    implementationStatus: status,
    desc: `${icon} ${DESC_BY_TABLE[m.table] ?? `Tabla ${m.table} · polaria-wms-db / Supabase.`}`,
    fields: m.fields.slice(0, 24),
    relations: dedupeRelations(m.relations).slice(0, 8),
  }
})

function dedupeRelations(rels) {
  const seen = new Set()
  return rels.filter((r) => {
    const k = `${r.entity}:${r.label}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

fs.writeFileSync(
  manifestPath,
  [
    '/** Auto-generado — node scripts/sync-prisma-entities.mjs */',
    `export const PRISMA_MODEL_COUNT = ${models.length}`,
    `export const PRISMA_TO_ENTITY = ${JSON.stringify(PRISMA_TO_ENTITY, null, 2)}`,
    '',
    `export const PRISMA_ENTITY_MANIFEST = ${JSON.stringify(manifest, null, 2)}`,
    '',
  ].join('\n'),
)

fs.writeFileSync(
  entitiesPath,
  [
    '/** Auto-generado desde polaria-wms-api + polaria-wms-db — node scripts/sync-prisma-entities.mjs */',
    `export const SUPABASE_ENTITY_COUNT = ${entities.length}`,
    `export const ENTITIES = ${JSON.stringify(entities, null, 2)}`,
    '',
  ].join('\n'),
)

console.log(`sync-prisma-entities: ${models.length} tablas → manifest + supabaseEntities.generated.js`)
