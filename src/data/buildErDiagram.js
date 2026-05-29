import { ENTITIES, SCHEMA_DOMAINS } from './bodegaDatabaseSchema.js'

/** @param {{ table: string }} entity */
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

/**
 * Construye diagrama ER Mermaid con todas las tablas y relaciones FK.
 * @param {{ domainId?: string | null, includeAttributes?: boolean }} [opts]
 */
export function buildErDiagramMermaid(opts = {}) {
  const { domainId = null, includeAttributes = true } = opts

  let entities = ENTITIES
  if (domainId) {
    entities = ENTITIES.filter((e) => e.domain === domainId)
    const ids = new Set(entities.map((e) => e.id))
    // incluir entidades referenciadas por FK aunque sean de otro dominio
    for (const entity of [...entities]) {
      for (const field of entity.fields ?? []) {
        const target = resolveFkTarget(field.fk)
        if (target && !ids.has(target.id)) {
          entities.push(target)
          ids.add(target.id)
        }
      }
    }
  }

  const idSet = new Set(entities.map((e) => e.id))
  const lines = ['erDiagram']
  const seen = new Set()

  for (const entity of entities) {
    for (const field of entity.fields ?? []) {
      const target = resolveFkTarget(field.fk)
      if (!target || !idSet.has(target.id)) continue
      const label = field.name.replace(/"/g, "'")
      const key = edgeKey(target.id, entity.id, label)
      if (seen.has(key)) continue
      seen.add(key)
      lines.push(`    ${mermaidId(target)} ||--o{ ${mermaidId(entity)} : "${label}"`)
    }
  }

  // Auth externo
  if (!domainId || domainId === 'tenant') {
    const auth = entities.find((e) => e.id === 'usuario_auth')
    const op = entities.find((e) => e.id === 'usuario_operativo')
    if (auth && op) {
      const key = edgeKey(auth.id, op.id, 'uid')
      if (!seen.has(key)) {
        seen.add(key)
        lines.push(`    ${mermaidId(auth)} ||--|| ${mermaidId(op)} : "uid"`)
      }
    }
  }

  if (includeAttributes) {
    for (const entity of entities) {
      const attrs = (entity.fields ?? []).slice(0, 8)
      if (attrs.length === 0) continue
      lines.push(`    ${mermaidId(entity)} {`)
      for (const f of attrs) {
        const tags = []
        if (f.pk) tags.push('PK')
        if (f.fk) tags.push('FK')
        const tagStr = tags.length ? ` "${tags.join(',')}"` : ''
        lines.push(`        ${f.type} ${f.name}${tagStr}`)
      }
      if ((entity.fields?.length ?? 0) > 8) {
        lines.push('        string _mas_campos')
      }
      lines.push('    }')
    }
  }

  return lines.join('\n')
}

/** Lista de relaciones legibles para panel lateral */
export function buildErRelationships(domainId = null) {
  let entities = domainId ? ENTITIES.filter((e) => e.domain === domainId) : ENTITIES
  const idSet = new Set(entities.map((e) => e.id))

  if (domainId) {
    for (const entity of [...entities]) {
      for (const field of entity.fields ?? []) {
        const target = resolveFkTarget(field.fk)
        if (target && !idSet.has(target.id)) {
          entities.push(target)
          idSet.add(target.id)
        }
      }
    }
  }

  const rows = []
  for (const entity of entities) {
    for (const field of entity.fields ?? []) {
      const target = resolveFkTarget(field.fk)
      if (!target || !idSet.has(target.id)) continue
      rows.push({
        id: `${target.table}-${entity.table}-${field.name}`,
        from: `${target.table}`,
        to: `${entity.table}`,
        field: field.name,
        label: field.desc ?? field.fk,
        domain: entity.domain,
      })
    }
  }

  if (!domainId) {
    rows.push({
      id: 'auth-usuario',
      from: 'auth.users',
      to: 'usuario_operativo',
      field: 'uid',
      label: 'Supabase Auth → perfil operativo',
      domain: 'tenant',
    })
  }

  return rows.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
}

export const ER_DOMAIN_OPTIONS = [
  { id: 'all', label: 'Todas las tablas' },
  ...SCHEMA_DOMAINS.map((d) => ({ id: d.id, label: d.label })),
]

export const ER_DIAGRAM_FULL = buildErDiagramMermaid({ includeAttributes: true })
