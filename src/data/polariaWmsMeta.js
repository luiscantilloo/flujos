/**
 * Metadatos Polaria WMS — fuente de verdad para el Dev Hub (jun 2026).
 * Repos: polaria-wms-api, polaria-wms-web, polaria-wms-db
 */

export const POLARIA_WMS = {
  productName: 'Polaria WMS',
  legacySubtitle: 'Bodega de Frío (referencia de diseño V2)',
  statusDate: 'Jun 2026',
  repos: {
    api: {
      name: 'polaria-wms-api',
      url: 'https://github.com/PolariaTech/polaria-wms-api',
      role: 'NestJS 11, Prisma, guards tenant, endpoints',
    },
    web: {
      name: 'polaria-wms-web',
      url: 'https://github.com/PolariaTech/polaria-wms-web',
      role: 'Next.js frontend, módulos por dominio, supabase-js lecturas',
    },
    db: {
      name: 'polaria-wms-db',
      url: 'https://github.com/PolariaTech/polaria-wms-db',
      role: 'Migraciones Supabase, RLS, modelo operativo',
    },
    hub: {
      name: 'flujo',
      url: 'https://flujos-nine.vercel.app',
      role: 'Dev Hub — diseño objetivo + estado de implementación',
    },
  },
  /** Nombres legacy → actuales */
  legacyRepoNames: {
    'frio-frontend': 'polaria-wms-web',
    'frio-backend': 'polaria-wms-api',
  },
  prismaModelCount: 40,
  swaggerPath: '/api/docs',
}

export const IMPLEMENTATION_STATUS = {
  done: { icon: '✅', label: 'Implementado', key: 'done' },
  partial: { icon: '🟡', label: 'Parcial / schema listo', key: 'partial' },
  design: { icon: '🔵', label: 'Diseño (no implementado)', key: 'design' },
}

export const POLARIA_STATUS_CALLOUT = `> **Estado Polaria WMS — Jun 2026**
> ✅ Implementado en API/web · 🟡 Schema/BD listo, API operativa pendiente · 🔵 Diseño roadmap (Dev Hub)
>
> Repos fuente de verdad: [polaria-wms-api](${POLARIA_WMS.repos.api.url}) · [polaria-wms-web](${POLARIA_WMS.repos.web.url}) · [polaria-wms-db](${POLARIA_WMS.repos.db.url})`

/** Endpoints HTTP implementados — alineado a polaria-wms-api (controllers + Swagger) */
export const POLARIA_API_ENDPOINTS = [
  { method: 'GET', path: '/', status: 'done', note: 'Health check básico', group: 'sistema' },
  { method: 'GET', path: '/api/docs', status: 'done', note: 'Swagger UI', group: 'sistema' },
  { method: 'GET', path: '/api/docs-json', status: 'done', note: 'OpenAPI JSON', group: 'sistema' },
  // Auth
  { method: 'POST', path: '/auth/prelogin', status: 'done', note: 'Header opcional x-auth-client: wms | mateo', group: 'auth' },
  { method: 'POST', path: '/auth/login', status: 'done', note: 'JWT Supabase + contexto tenant/platform', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-handoff', status: 'done', note: 'Bearer · SSO WMS → Mateo (60s)', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-exchange', status: 'done', note: 'Canje código SSO → tokens', group: 'auth' },
  { method: 'GET', path: '/auth/me', status: 'done', note: 'Bearer · perfil + idBodegas[]', group: 'auth' },
  { method: 'POST', path: '/auth/logout', status: 'done', note: 'Bearer · 204', group: 'auth' },
  // Usuarios
  { method: 'POST', path: '/configurador/usuarios', status: 'done', note: 'Rol configurador · scope plataforma', group: 'usuarios' },
  { method: 'POST', path: '/administracion/usuarios', status: 'done', note: 'Rol administrador_cuenta · tenant del JWT', group: 'usuarios' },
  // Bodegas
  { method: 'POST', path: '/configuracion/bodegas', status: 'done', note: 'configurador | administrador_cuenta · bypass RLS', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas/:idBodega/bootstrap-layout', status: 'done', note: 'Layout tipo_ubicacion/zona/ubicacion (interna)', group: 'configuracion' },
  // Compras SOL
  { method: 'POST', path: '/compras/solicitudes', status: 'done', note: 'Crear SOL borrador', group: 'compras-sol' },
  { method: 'GET', path: '/compras/solicitudes', status: 'done', note: 'Listar SOL tenant', group: 'compras-sol' },
  { method: 'GET', path: '/compras/solicitudes/:id', status: 'done', note: 'Detalle SOL', group: 'compras-sol' },
  { method: 'PATCH', path: '/compras/solicitudes/:id', status: 'done', note: 'Editar borrador', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/enviar-aprobacion', status: 'done', note: 'borrador → pendiente_aprobacion', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/aprobar', status: 'done', note: '→ aprobada', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/rechazar', status: 'done', note: '→ rechazada', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/cancelar', status: 'done', note: '→ cancelada', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/convertir-oc', status: 'done', note: 'SOL aprobada → OC atómica', group: 'compras-sol' },
  // Compras OC
  { method: 'POST', path: '/compras/ordenes', status: 'done', note: 'Crear OC (directa o desde SOL)', group: 'compras-oc' },
  { method: 'GET', path: '/compras/ordenes', status: 'done', note: 'Listar OC tenant', group: 'compras-oc' },
  { method: 'GET', path: '/compras/ordenes/:id', status: 'done', note: 'Detalle OC', group: 'compras-oc' },
  { method: 'POST', path: '/compras/ordenes/:id/emitir', status: 'done', note: 'borrador → emitida', group: 'compras-oc' },
  { method: 'POST', path: '/compras/ordenes/:id/cancelar', status: 'done', note: '→ cancelada', group: 'compras-oc' },
  // Integración
  { method: 'POST', path: '/integracion/solicitudes', status: 'done', note: 'operador_cuenta | administrador_cuenta', group: 'integracion' },
  { method: 'GET', path: '/integracion/solicitudes', status: 'done', note: 'Listar del tenant', group: 'integracion' },
  { method: 'GET', path: '/configurador/integracion/solicitudes', status: 'done', note: 'Bandeja configurador (todas las cuentas)', group: 'integracion' },
]

export const POLARIA_API_MODULE_STATUS = [
  { module: 'auth', path: '/auth', status: 'done', note: 'Login, sesión, SSO Mateo' },
  { module: 'configurator', path: '/configurador, /administracion', status: 'done', note: 'Alta usuarios por rol' },
  { module: 'configuracion', path: '/configuracion/bodegas', status: 'done', note: 'Bodegas + bootstrap layout' },
  { module: 'purchases', path: '/compras', status: 'done', note: 'SOL + OC (sin recepción aún)' },
  { module: 'integration', path: '/integracion, /configurador/integracion', status: 'done', note: 'Solicitudes bodega externa' },
  { module: 'inventory', path: '—', status: 'partial', note: 'Placeholder · schema BD listo' },
  { module: 'processing', path: '—', status: 'partial', note: 'Placeholder' },
  { module: 'sales', path: '—', status: 'partial', note: 'Placeholder' },
  { module: 'transport', path: '—', status: 'partial', note: 'Placeholder' },
  { module: 'warehouses', path: '—', status: 'partial', note: 'Placeholder' },
]

export const POLARIA_API_PENDING = [
  'Recepción compra (parcialmente_recibida, recibida, cerrada)',
  'Inventario: warehouse_state, locking, movimientos',
  'Procesamiento, ventas OV, transporte TV, alertas, cola operativa',
  'Conciliación ciega completa, FEFO automático, salida cruzada',
  'Fridem read-only, Cloudinary evidencias, n8n pedido proveedor (web parcial)',
]

export const POLARIA_RLS_STRATEGY = {
  title: 'RLS híbrido (TENANT-RLS)',
  rows: [
    { channel: 'Web lecturas', credential: 'supabase-js + JWT usuario', rls: 'Aplica' },
    { channel: 'API escrituras sensibles', credential: 'Prisma + DATABASE_URL', rls: 'Bypass + validación tenant en código' },
  ],
  backendOnlyTables: [
    'warehouse_state',
    'movimiento_inventario',
    'contador',
    'auditoria_operacion (INSERT)',
  ],
  antiPatterns: [
    'No exponer service role al browser',
    'No insert directo en tabla bodega desde web (usar POST /configuracion/bodegas)',
  ],
}

export const POLARIA_ENV_VARS = {
  api: [
    { name: 'SUPABASE_URL', required: true },
    { name: 'SUPABASE_ANON_KEY', required: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', required: true },
    { name: 'DATABASE_URL', required: true, note: 'Postgres directo Prisma, bypass RLS' },
    { name: 'MATEO_HANDOFF_SECRET', required: true },
    { name: 'MATEO_ALLOWED_ORIGINS', required: false },
    { name: 'PORT', required: false, default: '3000' },
  ],
  web: [
    { name: 'VITE_API_URL', required: true },
    { name: 'VITE_SUPABASE_URL', required: true },
    { name: 'VITE_SUPABASE_ANON_KEY', required: true },
  ],
  optional: ['Cloudinary', 'n8n webhook pedido', 'Fridem Firebase read-only'],
}

/** Mapeo Prisma → id entidad (= nombre tabla Supabase) */
export { PRISMA_TO_ENTITY, PRISMA_MODEL_COUNT } from './prismaEntityManifest.js'

export function formatPolariaStatusCallout() {
  return POLARIA_STATUS_CALLOUT
}

export function formatPolariaApiMarkdown() {
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Endpoints implementados (`polaria-wms-api`)',
    '',
    'Fuente: [polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api) · Swagger: `GET /api/docs` · OpenAPI: `GET /api/docs-json`',
    '',
    'Guards transversales: `JwtAuthGuard`, `TenantGuard`, `RolesGuard`. Header opcional: `x-auth-client: wms | mateo` en prelogin/login.',
    '',
    '| Método | Ruta | Estado | Notas |',
    '| --- | --- | --- | --- |',
  ]
  for (const ep of POLARIA_API_ENDPOINTS) {
    const st = IMPLEMENTATION_STATUS[ep.status]?.icon ?? ep.status
    lines.push(`| ${ep.method} | \`${ep.path}\` | ${st} | ${ep.note || '—'} |`)
  }
  lines.push('', '### Módulos NestJS', '', '| Módulo | Prefijo | Estado |', '| --- | --- | --- |')
  for (const m of POLARIA_API_MODULE_STATUS) {
    const st = IMPLEMENTATION_STATUS[m.status]?.icon ?? m.status
    lines.push(`| ${m.module} | ${m.path} | ${st} | ${m.note} |`)
  }
  lines.push('', '### Pendiente de implementar (diseño V2 / roadmap)', '')
  for (const p of POLARIA_API_PENDING) {
    lines.push(`- 🔵 ${p}`)
  }
  return lines.join('\n')
}
