import { ENTITIES, SCHEMA_DOMAINS } from './bodegaDatabaseSchema.js'

/**
 * Nodo del árbol de arquitectura (carpetas o tablas).
 * @typedef {{ id: string, name: string, hint?: string, children?: ArchNode[] }} ArchNode
 */

/** @type {ArchNode[]} */
export const FRONTEND_TREE = [
  {
    id: 'fe-app',
    name: 'app/',
    hint: 'Next.js App Router',
    children: [
      {
        id: 'fe-auth',
        name: '(auth)/',
        hint: 'Login, recuperación de contraseña',
        children: [
          { id: 'fe-auth-login', name: 'login/', hint: 'Pantalla de acceso (Supabase Auth)' },
          { id: 'fe-auth-recover', name: 'recuperar/', hint: 'Flujo de reset' },
        ],
      },
      {
        id: 'fe-dash',
        name: '(dashboard)/',
        hint: 'Vistas por rol (RBAC)',
        children: [
          { id: 'fe-ingreso', name: 'ingreso/', hint: 'Recepción, OC, SOL' },
          { id: 'fe-mapa', name: 'mapa/', hint: 'Mapa de slots, locking' },
          { id: 'fe-proc', name: 'procesamiento/', hint: 'Primario / secundario, merma' },
          { id: 'fe-trans', name: 'transporte/', hint: 'Viajes TV, evidencias' },
          { id: 'fe-ventas', name: 'ventas/', hint: 'OV, despacho' },
          { id: 'fe-config', name: 'configuracion/', hint: 'Tenant, catálogo, proveedores' },
          { id: 'fe-reportes', name: 'reportes/', hint: 'KPIs y auditoría' },
        ],
      },
      {
        id: 'fe-api',
        name: 'api/',
        hint: 'Route Handlers server-side (secretos)',
        children: [
          { id: 'fe-api-pedido', name: 'pedido-proveedor/', hint: 'POST → n8n webhook' },
          { id: 'fe-api-evidencia', name: 'evidencia-transporte/', hint: 'POST → Cloudinary' },
        ],
      },
      {
        id: 'fe-components',
        name: 'components/',
        hint: 'UI: SlotCard, modales, tablas',
        children: [
          { id: 'fe-comp-ui', name: 'ui/', hint: 'Primitivos reutilizables' },
          { id: 'fe-comp-bodega', name: 'bodega/', hint: 'Dominio WMS' },
        ],
      },
      { id: 'fe-context', name: 'context/', hint: 'AuthContext, cuenta activa, rol' },
      { id: 'fe-hooks', name: 'hooks/', hint: 'useWarehouse, suscripción Realtime' },
      { id: 'fe-services', name: 'services/', hint: 'Cliente HTTP hacia NestJS / Supabase' },
    ],
  },
  { id: 'fe-public', name: 'public/', hint: 'Assets estáticos, favicon' },
  { id: 'fe-styles', name: 'styles/', hint: 'Tailwind CSS 4, tokens' },
  {
    id: 'fe-lib',
    name: 'lib/',
    hint: 'Utilidades compartidas',
    children: [
      { id: 'fe-lib-supabase', name: 'supabase/', hint: 'Cliente browser + tipos generados' },
      { id: 'fe-lib-fridem', name: 'fridemClient.ts', hint: 'Proyecto Supabase secundario (solo lectura)' },
      { id: 'fe-lib-zod', name: 'schemas/', hint: 'Validación Zod de formularios' },
    ],
  },
]

/** @type {ArchNode[]} */
export const BACKEND_TREE = [
  {
    id: 'be-src',
    name: 'src/',
    children: [
      { id: 'be-main', name: 'main.ts', hint: 'Bootstrap NestJS + Swagger' },
      { id: 'be-app-module', name: 'app.module.ts', hint: 'Módulo raíz' },
      {
        id: 'be-common',
        name: 'common/',
        hint: 'Cross-cutting',
        children: [
          { id: 'be-decorators', name: 'decorators/', hint: '@Roles(), @CurrentUser()' },
          { id: 'be-guards', name: 'guards/', hint: 'AuthGuard — JWT Supabase' },
          { id: 'be-interceptors', name: 'interceptors/', hint: 'StripInterceptor (sin undefined)' },
          { id: 'be-pipes', name: 'pipes/', hint: 'Validación DTO' },
        ],
      },
      {
        id: 'be-supabase',
        name: 'supabase/',
        hint: 'Service role + PostgREST',
        children: [
          { id: 'be-supabase-mod', name: 'supabase.module.ts' },
          { id: 'be-supabase-svc', name: 'supabase.service.ts', hint: 'saveWarehouseState, transacciones' },
        ],
      },
      {
        id: 'be-modules',
        name: 'modules/',
        hint: 'Dominio modularizado',
        children: [
          { id: 'be-mod-ingreso', name: 'ingreso/', hint: 'OC, SOL, recepción' },
          { id: 'be-mod-inv', name: 'inventario/', hint: 'Slots, locking, movimientos' },
          { id: 'be-mod-ventas', name: 'ventas/', hint: 'OV, líneas, FEFO' },
          { id: 'be-mod-trans', name: 'transporte/', hint: 'Viajes TV, evidencias' },
          { id: 'be-mod-proc', name: 'procesamiento/', hint: 'Solicitudes, merma' },
          { id: 'be-mod-config', name: 'configuracion/', hint: 'Tenants, catálogo' },
          { id: 'be-mod-auth', name: 'auth/', hint: 'Perfiles y permisos' },
        ],
      },
    ],
  },
  { id: 'be-test', name: 'test/', hint: 'E2E y unitarios NestJS' },
]

/** @param {{ getTree?: () => ArchNode[], view?: string }} section */
export function isTreeSection(section) {
  return typeof section?.getTree === 'function'
}

/** @param {{ getTree?: () => ArchNode[] }} section */
export function getSectionTree(section) {
  return isTreeSection(section) ? section.getTree() : []
}

export const ARCHITECTURE_SECTIONS = [
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
  {
    id: 'database',
    label: 'Base de datos',
    rootLabel: 'supabase · PostgreSQL',
    accent: 'emerald',
    view: 'tables',
  },
]

/** Tablas extra fuera del modelo ENTITIES principal */
const EXTRA_DATABASE_TABLES = [
  {
    id: 'auth_users',
    schema: 'auth',
    table: 'users',
    name: 'Usuarios Auth',
    domain: 'tenant',
    physical: 'auth.users',
    desc: 'Gestionado por Supabase Auth; vinculado a public.usuarios',
    fields: [
      { name: 'id', type: 'uuid', pk: true, desc: 'UID de sesión' },
      { name: 'email', type: 'text', unique: true },
      { name: 'created_at', type: 'timestamptz' },
    ],
    indexes: [],
  },
  {
    id: 'warehouse_state',
    schema: 'public',
    table: 'warehouse_state',
    name: 'Estado en vivo (OLTP)',
    domain: 'warehouse',
    physical: 'public.warehouse_state',
    desc: 'Documento jsonb por bodega; Realtime para slots, cajas y alertas',
    fields: [
      { name: 'warehouse_id', type: 'text', pk: true, fk: 'bodega.warehouseId' },
      { name: 'state', type: 'jsonb', desc: 'slots, inboundBoxes, outboundBoxes, orders, alerts' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
    indexes: ['INDEX(warehouse_id)'],
  },
]

/** @typedef {import('./bodegaDatabaseSchema.js').ENTITIES[number] & { schema: string }} DbTableRow */

/** Lista plana de tablas para la vista tipo tabla */
export function getDatabaseTables() {
  const fromEntities = ENTITIES.map((entity) => {
    const authTable = entity.physical?.startsWith('auth.')
    return {
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
  }
  })
  const extras = EXTRA_DATABASE_TABLES.map((t) => ({
    ...t,
    domainLabel: SCHEMA_DOMAINS.find((d) => d.id === t.domain)?.label ?? t.domain,
  }))
  return [...extras.filter((e) => e.id === 'auth_users'), ...fromEntities, ...extras.filter((e) => e.id !== 'auth_users')]
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
    cols.push(`| ${f.name} | ${f.type} | ${fieldKeysLabel(f)} | ${notes} |`)
  }
  const idx =
    table.indexes?.length > 0
      ? `\nÍndices:\n${table.indexes.map((i) => `- ${i}`).join('\n')}`
      : ''
  return `${header}\n${cols.join('\n')}${idx}`
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

export function buildFullArchitectureText() {
  return ARCHITECTURE_SECTIONS.map((s) => sectionToText(s)).join('\n\n')
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
