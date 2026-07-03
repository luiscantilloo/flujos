import {
  ENTITIES,
  SCHEMA_DOMAINS,
  V20_DOC_SECTION,
  SCHEMA_ONBOARDING,
} from './bodegaDatabaseSchema.js'
import { formatFieldType } from './schemaFieldTypes.js'

export const ER_VIEWS = [
  { id: 'ti', label: 'FASE 0–1 · Configurador TI', domainId: 'rbac' },
  { id: 'onboarding', label: 'Onboarding (40 tablas Supabase)', domainId: null },
  { id: 'platform', label: 'FASE 1–3 · Empresa, tenant, bodegas', domainId: 'platform' },
  { id: 'rbac', label: '② Roles y usuarios', domainId: 'rbac' },
  { id: 'catalog', label: '③ Catálogos', domainId: 'catalog' },
  { id: 'purchase', label: '④ Compras', domainId: 'purchase' },
  { id: 'warehouse', label: '⑤ Bodega', domainId: 'warehouse' },
  { id: 'processing', label: '⑥ Procesamiento', domainId: 'processing' },
  { id: 'sales', label: '⑦ Ventas / TV', domainId: 'sales' },
  { id: 'system', label: '⑧ Sistema', domainId: 'system' },
  { id: 'all', label: 'Resumen completo', domainId: null },
]

/** Relaciones semánticas — 40 tablas public.* (polaria-wms-db) */
const SEMANTIC_RELATIONS = [
  { from: 'rol', to: 'usuario', label: 'perfil' },
  { from: 'usuario', to: 'empresa', label: 'pertenencia / TI crea' },
  { from: 'empresa', to: 'cuenta', label: 'tenants' },
  { from: 'cuenta', to: 'bodega', label: 'bodegas' },
  { from: 'cuenta', to: 'solicitud_alta_bodega', label: 'peticiones' },
  { from: 'solicitud_alta_bodega', to: 'bodega', label: 'alta' },
  { from: 'cuenta', to: 'solicitud_integracion', label: 'integración' },
  { from: 'cuenta', to: 'tarea_cuenta', label: 'tareas' },
  { from: 'bodega', to: 'asignacion_bodega', label: 'equipo' },
  { from: 'usuario', to: 'asignacion_bodega', label: 'asignado' },
  { from: 'rol', to: 'asignacion_bodega', label: 'rol bodega' },
  { from: 'cuenta', to: 'proveedor', label: 'catálogo C' },
  { from: 'cuenta', to: 'cliente', label: 'clientes' },
  { from: 'cuenta', to: 'producto', label: 'productos' },
  { from: 'cliente', to: 'producto', label: 'SKU cliente' },
  { from: 'solicitud_compra', to: 'solicitud_compra_linea', label: 'líneas SOL' },
  { from: 'solicitud_compra', to: 'orden_compra', label: 'convierte OC' },
  { from: 'orden_compra', to: 'orden_compra_linea', label: 'líneas OC' },
  { from: 'orden_compra', to: 'recepcion_compra', label: 'recepción' },
  { from: 'recepcion_compra', to: 'recepcion_compra_linea', label: 'líneas' },
  { from: 'bodega', to: 'tipo_ubicacion', label: 'layout' },
  { from: 'bodega', to: 'zona', label: 'zonas' },
  { from: 'zona', to: 'ubicacion', label: 'slots' },
  { from: 'ubicacion', to: 'warehouse_state', label: 'stock' },
  { from: 'lote', to: 'warehouse_state', label: 'lote' },
  { from: 'producto', to: 'warehouse_state', label: 'producto' },
  { from: 'bodega', to: 'movimiento_inventario', label: 'movimientos' },
  { from: 'bodega', to: 'orden_trabajo', label: 'OT' },
  { from: 'orden_trabajo', to: 'orden_trabajo_linea', label: 'líneas OT' },
  { from: 'bodega', to: 'alerta_operativa', label: 'alertas' },
  { from: 'bodega', to: 'tarea_cola', label: 'cola' },
  { from: 'solicitud_procesamiento', to: 'registro_merma', label: 'merma' },
  { from: 'orden_venta', to: 'orden_venta_linea', label: 'líneas OV' },
  { from: 'viaje_transporte', to: 'guia_envio', label: 'guías' },
  { from: 'guia_envio', to: 'evidencia_transporte', label: 'evidencias' },
  { from: 'orden_venta_linea', to: 'evidencia_transporte', label: 'entrega' },
  { from: 'camion', to: 'viaje_transporte', label: 'flota' },
  { from: 'usuario', to: 'movimiento_inventario', label: 'actor' },
  { from: 'usuario', to: 'auditoria_operacion', label: 'auditoría' },
  { from: 'cuenta', to: 'contador', label: 'numeración' },
]

const TENANT_FK_FIELDS = new Set(['codigo_cuenta'])

/** Vistas con layout fijo para que Mermaid no oculte nodos */
const ER_VIEW_LAYOUT = {
  ti: {
    entityIds: ['rol', 'usuario', 'empresa', 'cuenta'],
    relations: [
      { from: 'rol', to: 'usuario', label: 'configurador / admin' },
      { from: 'usuario', to: 'empresa', label: 'TI crea / login' },
      { from: 'empresa', to: 'cuenta', label: 'tenant' },
    ],
    direction: 'TB',
    detailLevel: 'standard',
    autoFk: false,
  },
  onboarding: {
    entityIds: [
      'rol',
      'empresa',
      'usuario',
      'cuenta',
      'solicitud_alta_bodega',
      'bodega',
      'solicitud_integracion',
      'asignacion_bodega',
      'proveedor',
      'comprador',
      'camion',
      'planta',
      'cliente',
      'producto',
    ],
    relations: [
      { from: 'rol', to: 'usuario', label: 'usuarios' },
      { from: 'usuario', to: 'empresa', label: 'empresa' },
      { from: 'empresa', to: 'cuenta', label: 'tenant' },
      { from: 'cuenta', to: 'solicitud_alta_bodega', label: 'petición bodega' },
      { from: 'solicitud_alta_bodega', to: 'bodega', label: 'alta' },
      { from: 'cuenta', to: 'solicitud_integracion', label: 'integración' },
      { from: 'bodega', to: 'asignacion_bodega', label: 'equipo' },
      { from: 'cuenta', to: 'proveedor', label: 'catálogo' },
      { from: 'cuenta', to: 'producto', label: 'productos' },
    ],
    direction: 'TB',
    detailLevel: 'standard',
    autoFk: false,
  },
  platform: {
    entityIds: ['empresa', 'cuenta', 'solicitud_alta_bodega', 'bodega', 'asignacion_bodega', 'usuario'],
    relations: [
      { from: 'usuario', to: 'empresa', label: 'TI crea' },
      { from: 'empresa', to: 'cuenta', label: 'tenant' },
      { from: 'cuenta', to: 'solicitud_alta_bodega', label: 'petición' },
      { from: 'solicitud_alta_bodega', to: 'bodega', label: 'alta' },
      { from: 'bodega', to: 'asignacion_bodega', label: 'asignación' },
      { from: 'usuario', to: 'asignacion_bodega', label: 'equipo' },
    ],
    direction: 'TB',
    detailLevel: 'standard',
    autoFk: false,
  },
  rbac: {
    entityIds: [
      'rol',
      'empresa',
      'cuenta',
      'usuario',
      'asignacion_bodega',
      'bodega',
      'solicitud_alta_bodega',
    ],
    relations: [
      { from: 'rol', to: 'usuario', label: 'perfiles' },
      { from: 'empresa', to: 'usuario', label: 'pertenencia' },
      { from: 'empresa', to: 'cuenta', label: 'tenants' },
      { from: 'cuenta', to: 'solicitud_alta_bodega', label: 'peticiones' },
      { from: 'solicitud_alta_bodega', to: 'bodega', label: 'crea' },
      { from: 'bodega', to: 'asignacion_bodega', label: 'ubicación' },
      { from: 'usuario', to: 'asignacion_bodega', label: 'asignado' },
      { from: 'rol', to: 'asignacion_bodega', label: 'rol bodega' },
    ],
    direction: 'TB',
    detailLevel: 'standard',
    autoFk: false,
  },
}

const IMPORTANT_ATTRS = new Set([
  'nombre',
  'nombre_comercial',
  'estado',
  'zona',
  'tipo',
  'sku',
  'titulo',
  'numero_documento',
  'correo',
  'nivel',
  'placa',
  'peso_kg',
  'cantidad_kg',
  'kilos_primario',
  'esta_activa',
  'esta_activo',
])

function mermaidId(entity) {
  return entity.table.toUpperCase().replace(/[^A-Z0-9_]/g, '_')
}

function resolveFkTarget(fk) {
  if (!fk) return null
  const table = fk.split('.')[0]
  return ENTITIES.find((e) => e.table === table) ?? null
}

function edgeKey(a, b, label) {
  return `${a}|${b}|${label}`
}

function collectEntities(domainId, viewId = null) {
  const layout = viewId ? ER_VIEW_LAYOUT[viewId] : null
  if (layout?.entityIds) {
    return layout.entityIds
      .map((id) => ENTITIES.find((e) => e.id === id))
      .filter(Boolean)
  }

  if (!domainId) return [...ENTITIES]

  let entities = ENTITIES.filter((e) => e.domain === domainId)
  const ids = new Set(entities.map((e) => e.id))

  let changed = true
  while (changed) {
    changed = false
    for (const entity of entities) {
      for (const field of entity.fields ?? []) {
        const target = resolveFkTarget(field.fk)
        if (target && !ids.has(target.id)) {
          entities.push(target)
          ids.add(target.id)
          changed = true
        }
      }
    }
  }

  const domainOrder = Object.fromEntries(SCHEMA_DOMAINS.map((d, i) => [d.id, i]))
  return [...entities].sort((a, b) => {
    const da = domainOrder[a.domain] ?? 99
    const db = domainOrder[b.domain] ?? 99
    if (da !== db) return da - db
    return a.table.localeCompare(b.table)
  })
}

/** Tipo seguro para Mermaid ER (evita palabra reservada `enum`, que oculta la entidad ROL) */
function mermaidFieldType(field) {
  if (field.type === 'enum' && field.enumRef) {
    return field.enumRef.replace(/[^a-z0-9_]/gi, '_')
  }
  const raw = formatFieldType(field)
  return raw
    .replace(/timestamptz/g, 'ts')
    .replace(/varchar\(\d+\)/g, 'varchar')
    .replace(/decimal.*/, 'decimal')
    .replace(/citext.*/, 'citext')
    .replace(/enum\([^)]+\)/g, 'string')
    .replace(/[^a-z0-9_]/gi, '_')
}

function fkEdgeLabel(field) {
  if (field.v20Field) return field.v20Field
  if (field.desc) return field.desc.slice(0, 28)
  if (TENANT_FK_FIELDS.has(field.name)) return 'tenant'
  if (field.name.startsWith('id_')) return field.name.replace(/^id_/, '')
  return field.name
}

function buildEdges(entities, { summaryMode = false, viewId = null } = {}) {
  const tableToEntity = Object.fromEntries(entities.map((e) => [e.table, e]))
  const idSet = new Set(entities.map((e) => e.id))
  const lines = []
  const seen = new Set()
  const layout = viewId ? ER_VIEW_LAYOUT[viewId] : null

  const addEdge = (fromTable, toTable, label) => {
    const parent = tableToEntity[fromTable]
    const child = tableToEntity[toTable]
    if (!parent || !child) return
    if (fromTable === toTable) return
    const key = edgeKey(parent.id, child.id, label)
    if (seen.has(key)) return
    seen.add(key)
    lines.push(`    ${mermaidId(parent)} ||--o{ ${mermaidId(child)} : "${label.replace(/"/g, "'")}"`)
  }

  if (layout?.relations) {
    for (const rel of layout.relations) {
      addEdge(rel.from, rel.to, rel.label)
    }
    return lines
  }

  const relations = summaryMode
    ? SEMANTIC_RELATIONS
    : SEMANTIC_RELATIONS.filter((rel) => {
        const p = ENTITIES.find((e) => e.table === rel.from)
        const c = ENTITIES.find((e) => e.table === rel.to)
        return p && c && idSet.has(p.id) && idSet.has(c.id)
      })

  for (const rel of relations) {
    if (rel.from === rel.to) continue
    addEdge(rel.from, rel.to, rel.label)
  }

  const skipAutoFk = layout?.autoFk === false

  if (!summaryMode && !skipAutoFk) {
    for (const entity of entities) {
      for (const field of entity.fields ?? []) {
        const target = resolveFkTarget(field.fk)
        if (!target || !idSet.has(target.id)) continue
        if (TENANT_FK_FIELDS.has(field.name)) continue

        const semanticDup = SEMANTIC_RELATIONS.some(
          (r) => r.from === target.table && r.to === entity.table,
        )
        if (semanticDup) continue

        const key = edgeKey(target.id, entity.id, field.name)
        if (seen.has(key)) continue
        seen.add(key)
        addEdge(target.table, entity.table, fkEdgeLabel(field))
      }
    }
  }

  return lines
}

function buildEntityAttributes(entity, { detailLevel = 'standard' } = {}) {
  let fields = entity.fields ?? []

  if (detailLevel === 'summary') {
    fields = fields.filter((f) => f.pk || f.fk).slice(0, 5)
  } else if (detailLevel === 'standard') {
    const picked = fields.filter(
      (f) => f.pk || f.fk || f.v20Field || IMPORTANT_ATTRS.has(f.name),
    )
    fields = picked.length > 0 ? picked : fields.slice(0, 6)
  } else if (detailLevel === 'full') {
    fields = fields.slice(0, 14)
    if (fields.length < entity.fields?.length) {
      fields.push({
        name: '_mas_campos',
        type: 'text',
        desc: `+${(entity.fields?.length ?? 0) - fields.length} campos`,
      })
    }
  }

  if (fields.length === 0) return []

  const lines = [`    ${mermaidId(entity)} {`]
  for (const f of fields) {
    if (f.name === '_mas_campos') {
      lines.push('        text _mas_campos')
      continue
    }
    const tags = []
    if (f.pk) tags.push('PK')
    if (f.fk) tags.push('FK')
    const tagStr = tags.length ? ` "${tags.join(',')}"` : ''
    const label = (f.v20Field ?? f.name).replace(/[^a-zA-Z0-9_]/g, '_')
    const typeShort = mermaidFieldType(f)
    lines.push(`        ${typeShort} ${label}${tagStr}`)
  }
  lines.push('    }')
  return lines
}

export function buildErDiagramMermaid(opts = {}) {
  const viewId = opts.viewId ?? opts.domainId ?? ER_DIAGRAM_DEFAULT_VIEW
  const view = ER_VIEWS.find((v) => v.id === viewId) ?? ER_VIEWS[0]
  const domainId = opts.domainId ?? view.domainId
  const layout = ER_VIEW_LAYOUT[viewId]
  const summaryMode = viewId === 'all'
  const rawDetail =
    opts.detailLevel ??
    layout?.detailLevel ??
    (summaryMode ? 'summary' : 'standard')
  const detailLevel = rawDetail === 'minimal' ? 'summary' : rawDetail

  const entities = collectEntities(domainId, viewId)
  const domainLabel =
    viewId === 'onboarding'
      ? SCHEMA_ONBOARDING.title
      : (SCHEMA_DOMAINS.find((d) => d.id === domainId)?.label ?? `Resumen · ${V20_DOC_SECTION}`)

  const lines = [
    '---',
    `title: ${domainLabel}`,
    '---',
    'erDiagram',
  ]

  const direction = opts.direction ?? layout?.direction
  if (direction) {
    lines.push(`    direction ${direction}`)
  }

  for (const entity of entities) {
    lines.push(...buildEntityAttributes(entity, { detailLevel }))
  }

  lines.push(...buildEdges(entities, { summaryMode, viewId }))

  return lines.join('\n')
}

export function buildErRelationships(viewId = ER_DIAGRAM_DEFAULT_VIEW) {
  const view = ER_VIEWS.find((v) => v.id === viewId) ?? ER_VIEWS[0]
  const layout = ER_VIEW_LAYOUT[viewId]
  const entities = collectEntities(view.domainId, viewId)
  const idSet = new Set(entities.map((e) => e.id))
  const rows = []
  const seen = new Set()

  if (layout?.relations) {
    for (const rel of layout.relations) {
      const id = `${rel.from}-${rel.to}-${rel.label}`
      rows.push({
        id,
        from: rel.from,
        to: rel.to,
        field: rel.label,
        label: rel.label,
        domain: 'rbac',
      })
    }
    return rows
  }

  for (const entity of entities) {
    for (const field of entity.fields ?? []) {
      const target = resolveFkTarget(field.fk)
      if (!target || !idSet.has(target.id)) continue
      const id = `${target.table}-${entity.table}-${field.name}`
      if (seen.has(id)) continue
      seen.add(id)
      rows.push({
        id,
        from: target.table,
        to: entity.table,
        field: field.name,
        v20Field: field.v20Field,
        legacy: field.legacy,
        label: [field.desc, entity.v20Path, entity.name].filter(Boolean).join(' · '),
        domain: entity.domain,
      })
    }
  }

  return rows.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
}

export const ER_DOMAIN_OPTIONS = ER_VIEWS.map((v) => ({ id: v.id, label: v.label }))

export const ER_DIAGRAM_DEFAULT_VIEW = 'onboarding'
export const ER_DIAGRAM_FULL = buildErDiagramMermaid({ viewId: 'all', detailLevel: 'standard' })
