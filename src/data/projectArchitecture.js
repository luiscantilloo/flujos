import { ENTITIES, SCHEMA_DOMAINS } from './bodegaDatabaseSchema.js'
import { formatFieldType } from './schemaFieldTypes.js'
import { getReadingStepForEntity } from './schemaReadingGuide.js'

/**
 * Nodo del árbol de estructura (carpetas o tablas).
 * @typedef {{ id: string, name: string, hint?: string, children?: ArchNode[] }} ArchNode
 */

import { BACKEND_TREE, FRONTEND_TREE } from './projectStructureTrees.js'

export { FRONTEND_TREE, BACKEND_TREE }

/** @param {{ getTree?: () => ArchNode[], view?: string }} section */
export function isTreeSection(section) {
  return typeof section?.getTree === 'function'
}

/** @param {{ getTree?: () => ArchNode[] }} section */
export function getSectionTree(section) {
  return isTreeSection(section) ? section.getTree() : []
}

/** Carpetas de código — repos frio-frontend y frio-backend (doc V2.0 §4). */
export const PROJECT_STRUCTURE_SECTIONS = [
  {
    id: 'frontend',
    label: 'Frontend',
    rootLabel: 'frio-frontend/',
    accent: 'sky',
    getTree: () => FRONTEND_TREE,
  },
  {
    id: 'backend',
    label: 'Backend',
    rootLabel: 'frio-backend/',
    accent: 'violet',
    getTree: () => BACKEND_TREE,
  },
]

/** Modelo de datos Supabase — tablas 3NF, ER, warehouse_state (doc V2.0 §7). */
export const DATABASE_ARCHITECTURE_SECTION = {
  id: 'database',
  label: 'Base de datos',
  rootLabel: 'supabase · PostgreSQL',
  accent: 'emerald',
  view: 'tables',
}

/** @deprecated Usar PROJECT_STRUCTURE_SECTIONS o DATABASE_ARCHITECTURE_SECTION. */
export const ARCHITECTURE_SECTIONS = [
  ...PROJECT_STRUCTURE_SECTIONS,
  DATABASE_ARCHITECTURE_SECTION,
]

/** Tablas extra fuera del modelo ENTITIES principal */
const EXTRA_DATABASE_TABLES = [
  {
    id: 'auth_users',
    schema: 'auth',
    table: 'users',
    name: 'Usuarios Auth',
    domain: 'rbac',
    physical: 'auth.users',
    desc: 'Gestionado por Supabase Auth; vinculado a public.usuarios',
    fields: [
      { name: 'id', type: 'uuid', pk: true, desc: 'UID de sesión' },
      { name: 'email', type: 'text', unique: true },
      { name: 'created_at', type: 'timestamptz' },
    ],
    indexes: [],
  },
]

/** @typedef {import('./bodegaDatabaseSchema.js').ENTITIES[number] & { schema: string }} DbTableRow */

function attachReadingMeta(row) {
  const reading = getReadingStepForEntity(row.id)
  return {
    ...row,
    readOrder: reading?.order ?? row.readOrder ?? 999,
    readingPhase: reading?.phaseLabel ?? null,
    readingFirst: reading?.readFirst ?? null,
    readingThen: reading?.thenRead ?? null,
    readingCreatedBy: reading?.createdBy ?? null,
    indexes: row.indexes?.length ? row.indexes : reading?.indexes ?? [],
  }
}

/** Lista plana de tablas para la vista tipo tabla (orden = guía de lectura 0…N) */
export function getDatabaseTables() {
  const fromEntities = ENTITIES.map((entity) => {
    const authTable = entity.physical?.startsWith('auth.')
    return attachReadingMeta({
      id: entity.id,
      schema: authTable ? 'auth' : 'public',
      table: authTable ? (entity.physical.split('.').pop() ?? entity.table) : entity.table,
      name: entity.name,
      domain: entity.domain,
      domainLabel: SCHEMA_DOMAINS.find((d) => d.id === entity.domain)?.label ?? entity.domain,
      physical: entity.physical,
      desc: entity.desc,
      fields: entity.fields ?? [],
      indexes: entity.indexes ?? [],
    })
  })
  const extras = EXTRA_DATABASE_TABLES.map((t) =>
    attachReadingMeta({
      ...t,
      readOrder: t.id === 'auth_users' ? 1 : t.readOrder,
      domainLabel: SCHEMA_DOMAINS.find((d) => d.id === t.domain)?.label ?? t.domain,
    }),
  )
  const merged = [
    ...extras.filter((e) => e.id === 'auth_users'),
    ...fromEntities,
    ...extras.filter((e) => e.id !== 'auth_users'),
  ]
  return merged.sort((a, b) => a.readOrder - b.readOrder || a.table.localeCompare(b.table))
}

export function getDatabaseTablesGrouped() {
  return SCHEMA_DOMAINS.map((domain) => ({
    id: domain.id,
    label: domain.label,
    tables: getDatabaseTables().filter((t) => t.domain === domain.id),
  })).filter((g) => g.tables.length > 0)
}

export function getDatabaseTableById(tableId) {
  return getDatabaseTables().find((t) => t.id === tableId) ?? null
}

function fieldKeysLabel(field) {
  const keys = []
  if (field.pk) keys.push('PK')
  if (field.fk) keys.push('FK')
  if (field.unique) keys.push('UK')
  if (field.nullable) keys.push('NULL')
  return keys.join(', ') || '—'
}

/** Tabla en texto (markdown) para copiar */
export function databaseTableToText(table) {
  if (!table) return ''
  const header = `### ${table.schema}.${table.table} — ${table.name}\n${table.desc ? `# ${table.desc}\n` : ''}${table.physical ? `# ${table.physical}\n` : ''}`
  const cols = ['| Campo | Tipo | Claves | Notas |', '| --- | --- | --- | --- |']
  for (const f of table.fields) {
    const notes = [f.fk, f.desc].filter(Boolean).join(' · ') || '—'
    cols.push(`| ${f.name} | ${formatFieldType(f)} | ${fieldKeysLabel(f)} | ${notes} |`)
  }
  const reading =
    table.readOrder != null && table.readOrder < 999
      ? `\nLectura: tabla ${table.readOrder}${table.readingPhase ? ` · ${table.readingPhase}` : ''}${table.readingFirst ? `\n- Antes: ${table.readingFirst}` : ''}${table.readingThen ? `\n- Después: ${table.readingThen}` : ''}`
      : ''
  const idx =
    table.indexes?.length > 0
      ? `\nÍndices:\n${table.indexes.map((i) => `- ${i}`).join('\n')}`
      : ''
  return `${header}\n${cols.join('\n')}${reading}${idx}`
}

export function databaseSectionToText() {
  const intro = 'supabase · PostgreSQL\n'
  return intro + getDatabaseTables().map((t) => databaseTableToText(t)).join('\n\n')
}

/** Recorre el árbol y devuelve todos los ids (para expandir por defecto) */
export function collectNodeIds(nodes, depth = 0, maxDepth = 2) {
  const ids = []
  for (const node of nodes) {
    ids.push(node.id)
    if (node.children && depth < maxDepth) {
      ids.push(...collectNodeIds(node.children, depth + 1, maxDepth))
    }
  }
  return ids
}

/** Busca un nodo por id */
export function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

/** Ruta de nombres hasta el nodo (para copiar ruta) */
export function getNodePath(nodes, id, trail = []) {
  for (const node of nodes) {
    const next = [...trail, node.name]
    if (node.id === id) return next
    if (node.children) {
      const found = getNodePath(node.children, id, next)
      if (found) return found
    }
  }
  return null
}

/**
 * Renderiza árbol en texto estilo `tree` / documentación.
 * @param {ArchNode[]} nodes
 * @param {string} [rootPrefix]
 */
export function nodesToTreeText(nodes, rootPrefix = '') {
  const lines = []
  function walk(list, prefix, parentPrefix) {
    list.forEach((node, i) => {
      const isLast = i === list.length - 1
      const branch = isLast ? '└── ' : '├── '
      const line = `${parentPrefix}${branch}${node.name}${node.hint ? `  # ${node.hint}` : ''}`
      lines.push(line)
      if (node.children?.length) {
        const childPrefix = parentPrefix + (isLast ? '    ' : '│   ')
        walk(node.children, prefix, childPrefix)
      }
    })
  }
  if (rootPrefix) lines.push(rootPrefix)
  walk(nodes, '', '')
  return lines.join('\n')
}

export function sectionToText(section) {
  if (section.view === 'tables') return databaseSectionToText()
  const tree = getSectionTree(section)
  return `${section.rootLabel}\n${nodesToTreeText(tree)}`
}

export function buildFullProjectStructureText() {
  return PROJECT_STRUCTURE_SECTIONS.map((s) => sectionToText(s)).join('\n\n')
}

export function buildFullArchitectureText() {
  return databaseSectionToText()
}

export function buildSelectedNodeText(section, nodeId) {
  if (section.view === 'tables') {
    return databaseTableToText(getDatabaseTableById(nodeId))
  }
  const tree = getSectionTree(section)
  const path = getNodePath(tree, nodeId)
  if (!path) return ''
  const node = findNode(tree, nodeId)
  const header = `${section.rootLabel}\n${path.join('')}`
  if (node?.children?.length) {
    return `${header}\n${nodesToTreeText([node])}`
  }
  return header + (node?.hint ? `\n# ${node.hint}` : '')
}
