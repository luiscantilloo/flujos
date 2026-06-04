import {
  ENTITIES,
  SCHEMA_DOMAINS,
  V20_DOC_SECTION,
  SCHEMA_ONBOARDING,
} from './bodegaDatabaseSchema.js'
import { formatFieldType } from './schemaFieldTypes.js'

export const ER_VIEWS = [
  { id: 'ti', label: 'FASE 0–1 · Configurador TI', domainId: 'rbac' },
  { id: 'onboarding', label: 'Onboarding completo (tablas 0–14)', domainId: null },
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

/** Relaciones semánticas completas (complementan FK automáticas) */
const SEMANTIC_RELATIONS = [
  // Raíz: configurador TI = usuario (rol configurador)
  { from: 'rol', to: 'usuario', label: 'configurador TI' },
  { from: 'sesion_auth', to: 'usuario', label: 'credenciales Auth' },
  { from: 'usuario', to: 'empresa', label: 'TI crea empresa' },
  { from: 'usuario', to: 'usuario', label: 'TI crea admin cuenta' },
  // Plataforma y RBAC
  { from: 'empresa', to: 'cuenta', label: 'tiene tenants' },
  { from: 'cuenta', to: 'solicitud_alta_bodega', label: 'peticiones bodega' },
  { from: 'usuario', to: 'solicitud_alta_bodega', label: 'admin solicita' },
  { from: 'solicitud_alta_bodega', to: 'bodega', label: 'TI crea bodega' },
  { from: 'empresa', to: 'usuario', label: 'login V2 · pertenencia' },
  { from: 'cuenta', to: 'bodega', label: 'opera' },
  { from: 'cuenta', to: 'usuario', label: 'tenant operativo' },
  { from: 'cuenta', to: 'cliente', label: 'clientes' },
  { from: 'cuenta', to: 'producto', label: 'catálogo' },
  { from: 'cuenta', to: 'proveedor', label: 'proveedores' },
  { from: 'cuenta', to: 'comprador', label: 'compradores' },
  { from: 'cuenta', to: 'camion', label: 'flota' },
  { from: 'cuenta', to: 'planta', label: 'plantas' },
  { from: 'cuenta', to: 'orden_compra', label: 'OC' },
  { from: 'cuenta', to: 'orden_venta', label: 'OV' },
  { from: 'cuenta', to: 'solicitud_procesamiento', label: 'procesos' },
  { from: 'rol', to: 'usuario', label: 'rol cuenta/plataforma' },
  { from: 'rol', to: 'asignacion_bodega', label: 'rol en bodega' },
  { from: 'sesion_auth', to: 'usuario', label: 'login' },
  { from: 'usuario', to: 'usuario', label: 'creó' },
  { from: 'usuario', to: 'asignacion_bodega', label: 'asignado' },
  { from: 'bodega', to: 'asignacion_bodega', label: 'equipo' },
  { from: 'usuario', to: 'orden_compra', label: 'crea OC' },
  { from: 'usuario', to: 'orden_venta', label: 'crea OV' },
  { from: 'usuario', to: 'solicitud_procesamiento', label: 'solicita' },
  // Catálogo
  { from: 'cliente', to: 'producto', label: 'SKU' },
  { from: 'proveedor', to: 'orden_compra', label: 'abastece' },
  { from: 'comprador', to: 'orden_venta', label: 'destino OV' },
  // Compras
  { from: 'bodega', to: 'orden_compra', label: 'recibe OC' },
  { from: 'orden_compra', to: 'linea_orden_compra', label: 'líneas' },
  { from: 'producto', to: 'linea_orden_compra', label: 'ítem' },
  { from: 'solicitud_compra', to: 'orden_compra', label: 'genera OC' },
  { from: 'usuario', to: 'solicitud_compra', label: 'solicita SOL' },
  // Bodega operativa
  { from: 'bodega', to: 'estado_bodega', label: 'state/main' },
  { from: 'bodega', to: 'historial_movimiento', label: 'historial' },
  { from: 'bodega', to: 'solicitud_procesamiento', label: 'procesa en' },
  { from: 'estado_bodega', to: 'slot', label: 'slots' },
  { from: 'estado_bodega', to: 'caja', label: 'cajas' },
  { from: 'estado_bodega', to: 'orden_trabajo', label: 'OT' },
  { from: 'estado_bodega', to: 'tarea_cola', label: 'tasks' },
  { from: 'estado_bodega', to: 'alerta', label: 'alertas' },
  { from: 'slot', to: 'caja', label: 'ocupa' },
  { from: 'caja', to: 'producto', label: 'contiene' },
  { from: 'caja', to: 'cliente', label: 'dueño lote' },
  { from: 'orden_compra', to: 'caja', label: 'ingreso' },
  { from: 'orden_venta', to: 'caja', label: 'salida' },
  { from: 'caja', to: 'orden_trabajo', label: 'mueve' },
  { from: 'slot', to: 'orden_trabajo', label: 'destino' },
  { from: 'usuario', to: 'orden_trabajo', label: 'ejecuta OT' },
  { from: 'usuario', to: 'tarea_cola', label: 'tarea' },
  { from: 'usuario', to: 'alerta', label: 'atiende' },
  { from: 'alerta', to: 'slot', label: 'slot' },
  // Procesamiento
  { from: 'solicitud_procesamiento', to: 'registro_merma', label: 'merma' },
  { from: 'producto', to: 'solicitud_procesamiento', label: 'primario/secundario' },
  { from: 'usuario', to: 'solicitud_procesamiento', label: 'procesador' },
  // Ventas y transporte
  { from: 'bodega', to: 'orden_venta', label: 'despacha' },
  { from: 'orden_venta', to: 'linea_orden_venta', label: 'líneas' },
  { from: 'producto', to: 'linea_orden_venta', label: 'ítem' },
  { from: 'orden_venta', to: 'viaje_transporte', label: 'TV' },
  { from: 'camion', to: 'viaje_transporte', label: 'camión' },
  { from: 'usuario', to: 'viaje_transporte', label: 'transportista' },
  { from: 'viaje_transporte', to: 'evidencia_entrega', label: 'evidencia' },
  { from: 'linea_orden_venta', to: 'evidencia_entrega', label: 'línea entrega' },
  { from: 'planta', to: 'orden_venta', label: 'planta destino' },
  // Sistema
  { from: 'usuario', to: 'historial_movimiento', label: 'actor' },
  { from: 'usuario', to: 'auditoria', label: 'audita' },
]

const TENANT_FK_FIELDS = new Set(['codigo_cuenta'])

/** Vistas con layout fijo para que Mermaid no oculte nodos */
const ER_VIEW_LAYOUT = {
  ti: {
    entityIds: ['rol', 'sesion_auth', 'usuario', 'empresa', 'cuenta'],
    relations: [
      { from: 'rol', to: 'usuario', label: '2·3 configurador / admin' },
      { from: 'sesion_auth', to: 'usuario', label: '1 Auth' },
      { from: 'usuario', to: 'empresa', label: '2 TI crea empresa' },
      { from: 'usuario', to: 'usuario', label: '3 TI crea admin' },
      { from: 'empresa', to: 'cuenta', label: '4 tenant' },
      { from: 'empresa', to: 'usuario', label: 'login V2' },
    ],
    direction: 'TB',
    detailLevel: 'standard',
    autoFk: false,
  },
  onboarding: {
    entityIds: [
      'rol',
      'sesion_auth',
      'empresa',
      'usuario',
      'cuenta',
      'solicitud_alta_bodega',
      'bodega',
      'asignacion_bodega',
      'proveedor',
      'comprador',
      'camion',
      'planta',
      'cliente',
      'producto',
    ],
    relations: [
      { from: 'rol', to: 'usuario', label: '0·3 usuarios' },
      { from: 'sesion_auth', to: 'usuario', label: '0·1 Auth' },
      { from: 'usuario', to: 'empresa', label: '2 empresa' },
      { from: 'usuario', to: 'usuario', label: '3 admin · 14 operador' },
      { from: 'empresa', to: 'cuenta', label: '4 tenant' },
      { from: 'cuenta', to: 'solicitud_alta_bodega', label: '5 admin pide bodega' },
      { from: 'usuario', to: 'solicitud_alta_bodega', label: '5 solicitante' },
      { from: 'solicitud_alta_bodega', to: 'bodega', label: '6 TI crea' },
      { from: 'bodega', to: 'asignacion_bodega', label: '7 admin se asigna' },
      { from: 'usuario', to: 'asignacion_bodega', label: '7·5 equipo bodega' },
      { from: 'cuenta', to: 'proveedor', label: '8 catálogo' },
      { from: 'cuenta', to: 'comprador', label: '9' },
      { from: 'cuenta', to: 'camion', label: '10' },
      { from: 'cuenta', to: 'planta', label: '11' },
      { from: 'cuenta', to: 'cliente', label: '12' },
      { from: 'cuenta', to: 'producto', label: '13' },
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
      'sesion_auth',
      'empresa',
      'cuenta',
      'usuario',
      'asignacion_bodega',
      'bodega',
      'solicitud_alta_bodega',
    ],
    relations: [
      { from: 'rol', to: 'usuario', label: 'perfiles' },
      { from: 'sesion_auth', to: 'usuario', label: 'login' },
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
