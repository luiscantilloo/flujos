/**
 * Metadatos Polaria WMS — fuente de verdad para el Dev Hub (jul 2026).
 * Repos: polaria-wms-web, polaria-wms-api, polaria-wms-db, Widget-react.
 */

export const POLARIA_WMS = {
  productName: 'Polaria WMS',
  legacySubtitle: 'Bodega de Frío (referencia histórica V2)',
  statusDate: 'Jul 2026',
  repos: {
    api: {
      name: 'polaria-wms-api',
      url: 'https://github.com/PolariaTech/polaria-wms-api',
      role: 'Backend NestJS 11 (auth, compras, inventario, operaciones, procesamiento, ventas, transporte)',
    },
    web: {
      name: 'polaria-wms-web',
      url: 'https://github.com/PolariaTech/polaria-wms-web',
      role: 'Frontend Next.js 16 (módulos por rol + realtime + mapa operativo)',
    },
    db: {
      name: 'polaria-wms-db',
      url: 'https://github.com/PolariaTech/polaria-wms-db',
      role: 'Migraciones PostgreSQL/Supabase + RLS + scripts de validación operativa',
    },
    widget: {
      name: 'Widget-react',
      url: 'https://github.com/PolariaTech/Widget-react',
      role: 'Widget Mateo embebible (chat de soporte con historial remoto)',
    },
    hub: {
      name: 'flujos',
      url: 'https://flujos-nine.vercel.app',
      role: 'Dev Hub de documentación y diagramas',
    },
  },
  legacyRepoNames: {
    'frio-frontend': 'polaria-wms-web',
    'frio-backend': 'polaria-wms-api',
  },
  prismaModelCount: 40,
  swaggerPath: '/api/docs',
}

export const IMPLEMENTATION_STATUS = {
  done: { icon: '✅', label: 'Implementado', key: 'done' },
  partial: { icon: '🟡', label: 'Parcial / deuda conocida', key: 'partial' },
  design: { icon: '🔵', label: 'Diseño / pendiente', key: 'design' },
}

export const POLARIA_STATUS_CALLOUT = `> **Estado Polaria WMS — Jul 2026**
> ✅ Flujo operativo principal implementado (web + API + BD) · 🟡 deudas puntuales de permisos/testing/runbooks · 🔵 roadmap de mejoras.
>
> Repos fuente de verdad: [polaria-wms-web](${POLARIA_WMS.repos.web.url}) · [polaria-wms-api](${POLARIA_WMS.repos.api.url}) · [polaria-wms-db](${POLARIA_WMS.repos.db.url}) · [Widget-react](${POLARIA_WMS.repos.widget.url})`

/** Endpoints HTTP implementados — alineado a controllers del repo API. */
export const POLARIA_API_ENDPOINTS = [
  { group: 'sistema', method: 'GET', path: '/', status: 'done', note: 'Health check' },
  { group: 'sistema', method: 'GET', path: '/api/docs', status: 'done', note: 'Swagger UI' },
  { group: 'sistema', method: 'GET', path: '/api/docs-json', status: 'done', note: 'OpenAPI JSON' },

  { group: 'auth', method: 'POST', path: '/auth/prelogin', status: 'done', note: 'Header opcional `x-auth-client: wms | mateo`' },
  { group: 'auth', method: 'POST', path: '/auth/login', status: 'done', note: 'Login con contexto platform/tenant' },
  { group: 'auth', method: 'POST', path: '/auth/mateo-handoff', status: 'done', note: 'SSO WMS → Mateo (código 60s)' },
  { group: 'auth', method: 'POST', path: '/auth/mateo/widget-token', status: 'done', note: 'JWT corto para Widget Mateo' },
  { group: 'auth', method: 'POST', path: '/auth/mateo-exchange', status: 'done', note: 'Canje código SSO' },
  { group: 'auth', method: 'GET', path: '/auth/me', status: 'done', note: 'Perfil + contexto tenant + bodegas' },
  { group: 'auth', method: 'POST', path: '/auth/logout', status: 'done', note: 'Revoca sesión actual' },

  { group: 'usuarios', method: 'POST', path: '/configurador/usuarios', status: 'done', note: 'Alta de usuarios por rol configurador' },
  { group: 'usuarios', method: 'POST', path: '/administracion/usuarios', status: 'done', note: 'Alta de usuarios por admin cuenta' },

  { group: 'configuracion', method: 'PATCH', path: '/configuracion/empresas/:codigoEmpresa', status: 'done', note: 'Edición empresa (scope plataforma)' },
  { group: 'configuracion', method: 'PATCH', path: '/configuracion/cuentas/:codigoCuenta', status: 'done', note: 'Edición tenant (scope plataforma)' },
  { group: 'configuracion', method: 'POST', path: '/configuracion/bodegas', status: 'done', note: 'Crear bodega interna/externa' },
  { group: 'configuracion', method: 'POST', path: '/configuracion/bodegas/:idBodega/bootstrap-layout', status: 'done', note: 'Crear layout inicial de bodega' },
  { group: 'configuracion', method: 'POST', path: '/configuracion/bodegas/:idBodega/ensure-zonas-operativas', status: 'done', note: 'Asegura zonas operativas base' },

  { group: 'integracion', method: 'POST', path: '/integracion/solicitudes', status: 'done', note: 'Solicitud de integración (operador/admin cuenta)' },
  { group: 'integracion', method: 'GET', path: '/integracion/solicitudes', status: 'done', note: 'Bandeja tenant' },
  { group: 'integracion', method: 'GET', path: '/configurador/integracion/solicitudes', status: 'done', note: 'Bandeja cross-cuenta para configurador' },

  { group: 'compras-sol', method: 'POST', path: '/compras/solicitudes', status: 'done', note: 'Crear SOL borrador' },
  { group: 'compras-sol', method: 'GET', path: '/compras/solicitudes', status: 'done', note: 'Listar SOL' },
  { group: 'compras-sol', method: 'GET', path: '/compras/solicitudes/:id', status: 'done', note: 'Detalle SOL' },
  { group: 'compras-sol', method: 'PATCH', path: '/compras/solicitudes/:id', status: 'done', note: 'Editar SOL borrador' },
  { group: 'compras-sol', method: 'POST', path: '/compras/solicitudes/:id/enviar-aprobacion', status: 'done', note: 'Borrador → pendiente aprobación' },
  { group: 'compras-sol', method: 'POST', path: '/compras/solicitudes/:id/aprobar', status: 'done', note: 'Pendiente → aprobada' },
  { group: 'compras-sol', method: 'POST', path: '/compras/solicitudes/:id/rechazar', status: 'done', note: 'Pendiente → rechazada' },
  { group: 'compras-sol', method: 'POST', path: '/compras/solicitudes/:id/cancelar', status: 'done', note: 'Cancela SOL' },
  { group: 'compras-sol', method: 'POST', path: '/compras/solicitudes/:id/convertir-oc', status: 'done', note: 'SOL aprobada → OC' },

  { group: 'compras-oc', method: 'POST', path: '/compras/ordenes', status: 'done', note: 'Crear OC (directa o desde SOL)' },
  { group: 'compras-oc', method: 'GET', path: '/compras/ordenes', status: 'done', note: 'Listar OC' },
  { group: 'compras-oc', method: 'GET', path: '/compras/ordenes/:id', status: 'done', note: 'Detalle OC' },
  { group: 'compras-oc', method: 'POST', path: '/compras/ordenes/:id/emitir', status: 'done', note: 'Borrador → emitida' },
  { group: 'compras-oc', method: 'PATCH', path: '/compras/ordenes/:id/destino', status: 'done', note: 'Actualiza destino bodega' },
  { group: 'compras-oc', method: 'POST', path: '/compras/ordenes/:id/cancelar', status: 'done', note: 'Cancela OC' },

  { group: 'compras-recepcion', method: 'POST', path: '/compras/recepciones/ordenes/:idOrdenCompra/cerrar', status: 'done', note: 'Cierre conciliación recepción' },
  { group: 'compras-recepcion', method: 'GET', path: '/compras/recepciones', status: 'done', note: 'Listado recepciones' },
  { group: 'compras-recepcion', method: 'GET', path: '/compras/recepciones/ordenes/:idOrdenCompra', status: 'done', note: 'Recepciones por OC' },
  { group: 'compras-recepcion', method: 'GET', path: '/compras/recepciones/:id', status: 'done', note: 'Detalle recepción' },
  { group: 'compras-recepcion', method: 'GET', path: '/compras/bodegas-destino', status: 'done', note: 'Selector bodegas destino compras' },

  { group: 'inventario', method: 'GET', path: '/inventario/warehouse-state', status: 'done', note: 'Mapa vivo de stock por slot' },
  { group: 'inventario', method: 'POST', path: '/inventario/warehouse-state/:id/lock', status: 'done', note: 'Bloqueo de slot con control de versión' },
  { group: 'inventario', method: 'POST', path: '/inventario/warehouse-state/:id/unlock', status: 'done', note: 'Desbloqueo de slot (stale takeover soportado)' },
  { group: 'inventario', method: 'GET', path: '/inventario/movimientos', status: 'done', note: 'Ledger de movimientos de inventario' },

  { group: 'operaciones', method: 'GET', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Lista OT activas/históricas' },
  { group: 'operaciones', method: 'GET', path: '/operaciones/ordenes-trabajo/:id', status: 'done', note: 'Detalle OT' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Crear OT (a_bodega, a_salida, etc.)' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/ordenes-trabajo/:id/ejecutar', status: 'done', note: 'Ejecutar OT' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/ordenes-trabajo/:id/reportar', status: 'done', note: 'Reportar incidente OT' },
  { group: 'operaciones', method: 'GET', path: '/operaciones/tareas', status: 'done', note: 'Cola de tareas operativas' },
  { group: 'operaciones', method: 'PATCH', path: '/operaciones/tareas/:id/asignar', status: 'done', note: 'Asignar tarea' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/tareas/:id/completar', status: 'done', note: 'Completar tarea' },
  { group: 'operaciones', method: 'GET', path: '/operaciones/alertas', status: 'done', note: 'Alertas operativas' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/alertas', status: 'done', note: 'Crear alerta' },
  { group: 'operaciones', method: 'PATCH', path: '/operaciones/alertas/:id/asignar', status: 'done', note: 'Asignar alerta' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/alertas/:id/cerrar', status: 'done', note: 'Cerrar alerta' },
  { group: 'operaciones', method: 'GET', path: '/operaciones/llamadas', status: 'done', note: 'Llamadas operario ↔ jefe' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/llamadas', status: 'done', note: 'Crear llamada' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/llamadas/:id/atender', status: 'done', note: 'Atender llamada' },
  { group: 'operaciones', method: 'GET', path: '/operaciones/reportes/bodega', status: 'done', note: 'Reportes operativos de bodega' },
  { group: 'operaciones', method: 'GET', path: '/operaciones/operarios-disponibles', status: 'done', note: 'Pool de operarios habilitados' },
  { group: 'operaciones', method: 'POST', path: '/operaciones/presencia/ping', status: 'done', note: 'Heartbeat de presencia operario' },

  { group: 'procesamiento', method: 'GET', path: '/procesamiento/solicitudes', status: 'done', note: 'Listar solicitudes de procesamiento' },
  { group: 'procesamiento', method: 'GET', path: '/procesamiento/solicitudes/:id', status: 'done', note: 'Detalle solicitud procesamiento' },
  { group: 'procesamiento', method: 'POST', path: '/procesamiento/solicitudes', status: 'done', note: 'Crear solicitud procesamiento' },
  { group: 'procesamiento', method: 'POST', path: '/procesamiento/solicitudes/:id/asignar-operario', status: 'done', note: 'Asignación de operario' },
  { group: 'procesamiento', method: 'POST', path: '/procesamiento/solicitudes/:id/asignar-procesador', status: 'done', note: 'Asignación de procesador' },
  { group: 'procesamiento', method: 'POST', path: '/procesamiento/solicitudes/:id/iniciar', status: 'done', note: 'Inicio del flujo procesamiento' },
  { group: 'procesamiento', method: 'POST', path: '/procesamiento/solicitudes/:id/cerrar', status: 'done', note: 'Cierre con merma / resultado' },
  { group: 'procesamiento', method: 'POST', path: '/procesamiento/solicitudes/:id/aplicar-ordenes', status: 'done', note: 'Aplicar OT derivadas al cierre' },

  { group: 'ventas', method: 'GET', path: '/ventas/ordenes', status: 'done', note: 'Listar OV' },
  { group: 'ventas', method: 'POST', path: '/ventas/ordenes/:id/emitir', status: 'done', note: 'Emitir OV' },

  { group: 'transporte', method: 'POST', path: '/transporte/paquetes-despacho', status: 'done', note: 'Armar paquetes de despacho' },
  { group: 'transporte', method: 'POST', path: '/transporte/entregas', status: 'done', note: 'Registrar entrega con evidencia' },

  { group: 'mateo-widget', method: 'GET', path: '/mateo/conversaciones', status: 'done', note: 'Listar conversaciones del usuario' },
  { group: 'mateo-widget', method: 'POST', path: '/mateo/conversaciones', status: 'done', note: 'Crear conversación' },
  { group: 'mateo-widget', method: 'GET', path: '/mateo/conversaciones/:id', status: 'done', note: 'Detalle conversación' },
  { group: 'mateo-widget', method: 'PATCH', path: '/mateo/conversaciones/:id', status: 'done', note: 'Renombrar conversación' },
  { group: 'mateo-widget', method: 'DELETE', path: '/mateo/conversaciones/:id', status: 'done', note: 'Eliminar conversación' },
]

export const POLARIA_API_MODULE_STATUS = [
  { module: 'auth', path: '/auth', status: 'done', note: 'Prelogin/login, contexto tenant, SSO Mateo y token widget' },
  { module: 'configurator', path: '/configurador, /administracion', status: 'done', note: 'Alta de usuarios por rol/scope' },
  { module: 'configuracion', path: '/configuracion', status: 'done', note: 'Empresas, cuentas y bodegas (layout inicial)' },
  { module: 'integration', path: '/integracion, /configurador/integracion', status: 'done', note: 'Solicitudes bodega externa por tenant/cross-tenant' },
  { module: 'purchases', path: '/compras', status: 'done', note: 'SOL, OC y recepción con conciliación' },
  { module: 'inventory', path: '/inventario', status: 'done', note: 'Warehouse state, lock/unlock y movimientos' },
  { module: 'operations', path: '/operaciones', status: 'done', note: 'OT, tareas, alertas, llamadas y reportes de bodega' },
  { module: 'processing', path: '/procesamiento', status: 'done', note: 'Solicitudes de transformación y cierre operativo' },
  { module: 'sales', path: '/ventas', status: 'partial', note: 'OV base implementada; cobertura funcional aún parcial' },
  { module: 'transport', path: '/transporte', status: 'partial', note: 'Despacho y entrega implementados; más casos en roadmap' },
  { module: 'mateo-widget', path: '/mateo/conversaciones', status: 'done', note: 'Historial remoto del widget Mateo' },
]

export const POLARIA_API_PENDING = [
  'Resolver inconsistencia de permisos de lock para rol custodio (`ROLES_INVENTARIO_LOCK` vs permisos efectivos).',
  'Completar cobertura de estado `cerrada` para OC en flujo administrativo post-recepción.',
  'Agregar e2e con BD real para concurrencia mapa/locks/FEFO (hoy se usa mayormente mocks).',
  'Publicar runbooks formales de resiliencia (RPO/RTO), observabilidad y respuesta a incidentes.',
]

export const POLARIA_RLS_STRATEGY = {
  title: 'RLS híbrido (TENANT-RLS)',
  rows: [
    { channel: 'Web lecturas', credential: 'supabase-js + JWT usuario', rls: 'Aplica por tenant/bodega' },
    { channel: 'API escrituras sensibles', credential: 'Prisma + DATABASE_URL', rls: 'Bypass controlado + validación tenant en código' },
    { channel: 'Widget Mateo (historial)', credential: 'Bearer sesión WMS + políticas widget_*', rls: 'Aplica ownership por usuario y cuenta' },
  ],
  backendOnlyTables: ['warehouse_state', 'movimiento_inventario', 'contador', 'auditoria_operacion (append-only)'],
  antiPatterns: [
    'No exponer `SUPABASE_SERVICE_ROLE_KEY` ni `DATABASE_URL` en frontend',
    'No escribir inventario directo por PostgREST para flujos sensibles; usar API',
    'No asumir que tener RLS reemplaza las validaciones de negocio en backend',
  ],
}

export const POLARIA_ENV_VARS = {
  api: [
    { name: 'DATABASE_URL', required: true, note: 'Conexión Prisma (bypass RLS) para backend' },
    { name: 'SUPABASE_URL', required: true },
    { name: 'SUPABASE_ANON_KEY', required: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', required: true },
    { name: 'MATEO_HANDOFF_SECRET', required: true },
    { name: 'MATEO_WIDGET_JWT_SECRET', required: true, note: 'Token corto para Widget-react' },
    { name: 'MATEO_ALLOWED_ORIGINS', required: true, note: 'CORS del backend' },
    { name: 'PORT', required: false, default: '3000' },
  ],
  web: [
    { name: 'NEXT_PUBLIC_API_BASE_URL', required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
    { name: 'NEXT_PUBLIC_MATEO_URL', required: false, note: 'Pantalla Mateo full-page' },
    { name: 'NEXT_PUBLIC_MATEO_WIDGET_SCRIPT_URL', required: false, note: 'Ruta del script IIFE de Widget-react' },
  ],
  webServer: [
    { name: 'SOLICITUD_COMPRA_WEBHOOK_URL', required: false },
    { name: 'PEDIDO_PROVEEDOR_WEBHOOK_URL', required: false },
    { name: 'PEDIDO_PROVEEDOR_DOCUMENT_ID', required: false },
    { name: 'CLOUDINARY_URL', required: false },
    { name: 'CLOUDINARY_EVIDENCIA_FOLDER', required: false },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', required: false, note: 'Solo route handlers server-side específicos' },
  ],
  widget: [
    { name: 'VITE_N8N_WEBHOOK_URL', required: true },
    { name: 'VITE_CLOUDINARY_CLOUD_NAME', required: true },
    { name: 'VITE_CLOUDINARY_UPLOAD_PRESET', required: true },
  ],
}

/** Mapeo Prisma → id entidad (= nombre tabla Supabase). */
export { PRISMA_TO_ENTITY, PRISMA_MODEL_COUNT } from './prismaEntityManifest.js'

export function formatPolariaStatusCallout() {
  return POLARIA_STATUS_CALLOUT
}

export function formatPolariaApiMarkdown() {
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## API consolidada (`polaria-wms-api`)',
    '',
    `Fuente: [${POLARIA_WMS.repos.api.name}](${POLARIA_WMS.repos.api.url}) · Swagger: \`GET ${POLARIA_WMS.swaggerPath}\` · OpenAPI: \`GET /api/docs-json\``,
    '',
    'Guards transversales: `JwtAuthGuard`, `TenantGuard`, `RolesGuard`, `SensitiveWriteGuard`.',
    '',
    '| Dominio | Método | Ruta | Estado | Notas |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const ep of POLARIA_API_ENDPOINTS) {
    const st = IMPLEMENTATION_STATUS[ep.status]?.icon ?? ep.status
    lines.push(`| ${ep.group} | ${ep.method} | \`${ep.path}\` | ${st} | ${ep.note || '—'} |`)
  }

  lines.push('', '### Estado por módulo NestJS', '', '| Módulo | Prefijo | Estado | Notas |', '| --- | --- | --- | --- |')
  for (const m of POLARIA_API_MODULE_STATUS) {
    const st = IMPLEMENTATION_STATUS[m.status]?.icon ?? m.status
    lines.push(`| ${m.module} | ${m.path} | ${st} | ${m.note} |`)
  }

  lines.push('', '### Deuda / próximos ajustes de API', '')
  for (const p of POLARIA_API_PENDING) {
    lines.push(`- 🟡 ${p}`)
  }

  return lines.join('\n')
}
