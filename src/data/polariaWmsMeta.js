/**
 * Metadatos Polaria WMS — fuente de verdad para el Dev Hub (jul 2026).
 * Repos: polaria-wms-web, polaria-wms-api, polaria-wms-db, Widget-react.
 */

export const POLARIA_WMS = {
  productName: 'Polaria WMS',
  legacySubtitle: 'Bodega de Frío (referencia de diseño V2)',
  statusDate: 'Jul 2026',
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
    widget: {
      name: 'Widget-react',
      url: 'https://github.com/PolariaTech/Widget-react',
      role: 'Mateo Support embebible: React widget, n8n, Cloudinary y conversaciones',
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
  prismaModelCount: 43,
  swaggerPath: '/api/docs',
}

export const IMPLEMENTATION_STATUS = {
  done: { icon: '✅', label: 'Implementado', key: 'done' },
  partial: { icon: '🟡', label: 'Parcial / schema listo', key: 'partial' },
  design: { icon: '🔵', label: 'Diseño (no implementado)', key: 'design' },
}

export const POLARIA_STATUS_CALLOUT = `> **Estado Polaria WMS — Jul 2026**
> ✅ Implementado en API/web/db · 🟡 Parcial operativo · 🔵 Diseño roadmap (Dev Hub)
>
> Repos fuente de verdad: [polaria-wms-web](${POLARIA_WMS.repos.web.url}) · [polaria-wms-api](${POLARIA_WMS.repos.api.url}) · [polaria-wms-db](${POLARIA_WMS.repos.db.url}) · [Widget-react](${POLARIA_WMS.repos.widget.url})`

/** Endpoints HTTP implementados — alineado a polaria-wms-api (controllers + Swagger) */
export const POLARIA_API_ENDPOINTS = [
  { method: 'GET', path: '/', status: 'done', note: 'Health check básico', group: 'sistema' },
  { method: 'GET', path: '/api/docs', status: 'done', note: 'Swagger UI', group: 'sistema' },
  { method: 'GET', path: '/api/docs-json', status: 'done', note: 'OpenAPI JSON', group: 'sistema' },
  // Auth
  { method: 'POST', path: '/auth/prelogin', status: 'done', note: 'Header opcional x-auth-client: wms | mateo', group: 'auth' },
  { method: 'POST', path: '/auth/login', status: 'done', note: 'JWT Supabase + contexto tenant/platform', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-handoff', status: 'done', note: 'Bearer · SSO WMS → Mateo (60s)', group: 'auth' },
  { method: 'POST', path: '/auth/mateo/widget-token', status: 'done', note: 'Bearer · JWT corto para Widget-react/n8n', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-exchange', status: 'done', note: 'Canje código SSO → tokens', group: 'auth' },
  { method: 'GET', path: '/auth/me', status: 'done', note: 'Bearer · perfil + idBodegas[]', group: 'auth' },
  { method: 'POST', path: '/auth/logout', status: 'done', note: 'Bearer · 204', group: 'auth' },
  // Usuarios
  { method: 'POST', path: '/configurador/usuarios', status: 'done', note: 'Rol configurador · scope plataforma', group: 'usuarios' },
  { method: 'POST', path: '/administracion/usuarios', status: 'done', note: 'Rol administrador_cuenta · tenant del JWT', group: 'usuarios' },
  // Bodegas
  { method: 'POST', path: '/configuracion/bodegas', status: 'done', note: 'configurador | administrador_cuenta · bypass RLS', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas/:idBodega/bootstrap-layout', status: 'done', note: 'Layout tipo_ubicacion/zona/ubicacion (interna)', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas/:idBodega/ensure-zonas-operativas', status: 'done', note: 'Idempotente · corrige zonas operativas históricas', group: 'configuracion' },
  { method: 'PATCH', path: '/configuracion/empresas/:codigoEmpresa', status: 'done', note: 'Rol configurador · actualizar empresa', group: 'configuracion' },
  { method: 'PATCH', path: '/configuracion/cuentas/:codigoCuenta', status: 'done', note: 'Rol configurador · actualizar tenant/cuenta', group: 'configuracion' },
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
  { method: 'PATCH', path: '/compras/ordenes/:id/destino', status: 'done', note: 'Ajusta bodega destino de la OC', group: 'compras-oc' },
  { method: 'POST', path: '/compras/ordenes/:id/cancelar', status: 'done', note: '→ cancelada', group: 'compras-oc' },
  { method: 'GET', path: '/compras/bodegas-destino', status: 'done', note: 'Opciones destino por tenant', group: 'compras-oc' },
  { method: 'POST', path: '/compras/recepciones/ordenes/:idOrdenCompra/cerrar', status: 'done', note: 'Cierre recepción contra OC', group: 'compras-recepcion' },
  { method: 'GET', path: '/compras/recepciones', status: 'done', note: 'Listar recepciones del tenant', group: 'compras-recepcion' },
  { method: 'GET', path: '/compras/recepciones/ordenes/:idOrdenCompra', status: 'done', note: 'Recepciones por OC', group: 'compras-recepcion' },
  { method: 'GET', path: '/compras/recepciones/:id', status: 'done', note: 'Detalle recepción', group: 'compras-recepcion' },
  // Integración
  { method: 'POST', path: '/integracion/solicitudes', status: 'done', note: 'operador_cuenta | administrador_cuenta', group: 'integracion' },
  { method: 'GET', path: '/integracion/solicitudes', status: 'done', note: 'Listar del tenant', group: 'integracion' },
  { method: 'GET', path: '/configurador/integracion/solicitudes', status: 'done', note: 'Bandeja configurador (todas las cuentas)', group: 'integracion' },
  // Inventario
  { method: 'GET', path: '/inventario/warehouse-state', status: 'done', note: 'Mapa por ubicación/producto/lote con RLS/tenant', group: 'inventario' },
  { method: 'POST', path: '/inventario/warehouse-state/:id/lock', status: 'done', note: 'SensitiveWriteGuard · locking optimista', group: 'inventario' },
  { method: 'POST', path: '/inventario/warehouse-state/:id/unlock', status: 'done', note: 'Libera lock de slot/stock', group: 'inventario' },
  { method: 'GET', path: '/inventario/movimientos', status: 'done', note: 'Historial movimiento inventario', group: 'inventario' },
  // Operaciones
  { method: 'GET', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Listar OT por bodega/tenant', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/ordenes-trabajo/:id', status: 'done', note: 'Detalle OT', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Crear OT', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo/:id/ejecutar', status: 'done', note: 'Operario ejecuta OT', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo/:id/reportar', status: 'done', note: 'Reportar incidencia/resultado OT', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/tareas', status: 'done', note: 'Cola operativa', group: 'operaciones' },
  { method: 'PATCH', path: '/operaciones/tareas/:id/asignar', status: 'done', note: 'Asignar tarea a operario/procesador', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/tareas/:id/completar', status: 'done', note: 'Cerrar tarea asignada', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/alertas', status: 'done', note: 'Alertas temperatura/demora', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/alertas', status: 'done', note: 'Crear alerta operativa', group: 'operaciones' },
  { method: 'PATCH', path: '/operaciones/alertas/:id/asignar', status: 'done', note: 'Asignar responsable', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/alertas/:id/cerrar', status: 'done', note: 'Cerrar con motivo', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/llamadas', status: 'done', note: 'Llamadas al jefe', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/llamadas', status: 'done', note: 'Solicitar apoyo del jefe', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/llamadas/:id/atender', status: 'done', note: 'Marcar llamada atendida', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/reportes/bodega', status: 'done', note: 'Reporte operativo bodega', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/operarios-disponibles', status: 'done', note: 'Disponibilidad por sesión/rol', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/presencia/ping', status: 'done', note: 'Actualiza SesionOperativa', group: 'operaciones' },
  // Procesamiento
  { method: 'GET', path: '/procesamiento/solicitudes', status: 'done', note: 'Listar solicitudes procesamiento', group: 'procesamiento' },
  { method: 'GET', path: '/procesamiento/solicitudes/:id', status: 'done', note: 'Detalle solicitud', group: 'procesamiento' },
  { method: 'GET', path: '/procesamiento/solicitudes/:id/desperdicio-sugerido', status: 'done', note: 'Cálculo sugerido merma/desperdicio', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes', status: 'done', note: 'Crear solicitud procesamiento', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/asignar-operario', status: 'done', note: 'Jefe asigna operario', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/iniciar', status: 'done', note: 'Inicia proceso', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/asignar-procesador', status: 'done', note: 'Asignación específica procesador', group: 'procesamiento' },
  { method: 'PATCH', path: '/procesamiento/solicitudes/:id/cambiar-estado', status: 'done', note: 'Cambio controlado de estado', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/cerrar', status: 'done', note: 'Cierre con merma/sobrante', group: 'procesamiento' },
  { method: 'GET', path: '/procesamiento/solicitudes/:id/ordenes-post-cierre', status: 'done', note: 'OT derivadas post-cierre', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/ordenes/:idOrden/aplicar', status: 'done', note: 'Aplica orden post-cierre', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/terminar', status: 'done', note: 'Termina flujo procesamiento', group: 'procesamiento' },
  // Ventas
  { method: 'GET', path: '/ventas/ordenes', status: 'done', note: 'Listar OV', group: 'ventas' },
  { method: 'POST', path: '/ventas/ordenes/:id/emitir', status: 'done', note: 'Emitir OV', group: 'ventas' },
  // Transporte
  { method: 'POST', path: '/transporte/paquetes-despacho', status: 'done', note: 'Crea paquete despacho para entrega', group: 'transporte' },
  { method: 'POST', path: '/transporte/entregas', status: 'done', note: 'Registro entrega con evidencia', group: 'transporte' },
  // Mateo widget
  { method: 'GET', path: '/mateo/conversaciones', status: 'done', note: 'Historial widget por usuario/cuenta', group: 'mateo-widget' },
  { method: 'POST', path: '/mateo/conversaciones', status: 'done', note: 'Crear conversación widget', group: 'mateo-widget' },
  { method: 'GET', path: '/mateo/conversaciones/:id', status: 'done', note: 'Detalle conversación', group: 'mateo-widget' },
  { method: 'POST', path: '/mateo/conversaciones/:id/mensajes', status: 'done', note: 'Agregar mensaje', group: 'mateo-widget' },
  { method: 'DELETE', path: '/mateo/conversaciones/:id', status: 'done', note: 'Eliminar conversación', group: 'mateo-widget' },
]

export const POLARIA_API_MODULE_STATUS = [
  { module: 'auth', path: '/auth', status: 'done', note: 'Login, sesión, SSO Mateo' },
  { module: 'configurator', path: '/configurador, /administracion', status: 'done', note: 'Alta usuarios por rol' },
  { module: 'configuracion', path: '/configuracion', status: 'done', note: 'Bodegas, layout, empresas, cuentas' },
  { module: 'purchases', path: '/compras', status: 'done', note: 'SOL + OC + recepción' },
  { module: 'integration', path: '/integracion, /configurador/integracion', status: 'done', note: 'Solicitudes bodega externa' },
  { module: 'inventory', path: '/inventario', status: 'done', note: 'warehouse_state, lock/unlock, movimientos' },
  { module: 'operations', path: '/operaciones', status: 'done', note: 'OT, tareas, alertas, llamadas, presencia' },
  { module: 'processing', path: '/procesamiento', status: 'done', note: 'Solicitud, asignación, cierre y post-cierre' },
  { module: 'sales', path: '/ventas', status: 'done', note: 'OV y emisión' },
  { module: 'transport', path: '/transporte', status: 'done', note: 'Paquetes despacho y entregas' },
  { module: 'mateo-widget', path: '/auth/mateo/widget-token, /mateo/conversaciones', status: 'done', note: 'Widget-react embebido' },
  { module: 'warehouses', path: '—', status: 'partial', note: 'UI web estado/reportes; API módulo dedicado pendiente' },
]

export const POLARIA_API_PENDING = [
  'Controllers dedicados para carpetas placeholder: accounts, audit, companies, files, health, notifications, settings, users, warehouses',
  'Pruebas de carga/SLOs y rate limits por tenant',
  'DR operativo documentado (RPO/RTO, failover) y observabilidad productiva',
  'Fridem read-only como integración formal productiva',
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
    { name: 'MATEO_WIDGET_JWT_SECRET', required: true },
    { name: 'MATEO_WIDGET_JWT_ISSUER', required: false, default: 'bodega-frio-v2' },
    { name: 'MATEO_WIDGET_JWT_AUDIENCE', required: false, default: 'mateo-support-widget' },
    { name: 'MATEO_WIDGET_JWT_KID', required: false, default: 'local-dev-v1' },
    { name: 'MATEO_ALLOWED_ORIGINS', required: false },
    { name: 'PORT', required: false, default: '3000' },
  ],
  web: [
    { name: 'NEXT_PUBLIC_API_BASE_URL', required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
    { name: 'NEXT_PUBLIC_MATEO_WIDGET_SRC', required: false },
    { name: 'NEXT_PUBLIC_MATEO_URL', required: false },
  ],
  widget: [
    { name: 'VITE_N8N_WEBHOOK_URL', required: true },
    { name: 'VITE_CLOUDINARY_CLOUD_NAME', required: false },
    { name: 'VITE_CLOUDINARY_UPLOAD_PRESET', required: false },
  ],
  optional: ['Cloudinary evidencias', 'n8n webhooks SOL/OC/widget', 'Fridem read-only'],
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
    `Estado auditado: ${POLARIA_WMS.statusDate}. Guards transversales: \`JwtAuthGuard\`, \`TenantGuard\`, \`RolesGuard\`; escrituras sensibles de inventario usan \`SensitiveWriteGuard\`. Header opcional: \`x-auth-client: wms | mateo\` en prelogin/login.`,
    '',
    '| Dominio | Método | Ruta | Estado | Notas |',
    '| --- | --- | --- | --- | --- |',
  ]
  for (const ep of POLARIA_API_ENDPOINTS) {
    const st = IMPLEMENTATION_STATUS[ep.status]?.icon ?? ep.status
    lines.push(`| ${ep.group} | ${ep.method} | \`${ep.path}\` | ${st} | ${ep.note || '—'} |`)
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
