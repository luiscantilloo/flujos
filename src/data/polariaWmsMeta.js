/**
 * Metadatos Polaria WMS — fuente de verdad para el Dev Hub (jul 2026).
 * Repos: polaria-wms-api, polaria-wms-web, polaria-wms-db, Widget-react
 */

export const POLARIA_WMS = {
  productName: 'Polaria WMS',
  legacySubtitle: 'Bodega de Frío (referencia de diseño V2)',
  statusDate: 'Jul 2026',
  repos: {
    api: {
      name: 'polaria-wms-api',
      url: 'https://github.com/PolariaTech/polaria-wms-api',
      role: 'NestJS 11, Prisma 7, guards tenant, endpoints operativos',
    },
    web: {
      name: 'polaria-wms-web',
      url: 'https://github.com/PolariaTech/polaria-wms-web',
      role: 'Next.js 16 frontend, módulos por dominio, supabase-js lecturas + Realtime',
    },
    db: {
      name: 'polaria-wms-db',
      url: 'https://github.com/PolariaTech/polaria-wms-db',
      role: 'Migraciones Supabase 001–052, RLS, modelo operativo',
    },
    widget: {
      name: 'Widget-react',
      url: 'https://github.com/PolariaTech/Widget-react',
      role: 'Mateo Support — chat embebido (IIFE), JWT widget, historial en API',
    },
    hub: {
      name: 'flujos',
      url: 'https://flujos-nine.vercel.app',
      role: 'Dev Hub — documentación, diagramas y manuales de usuario',
    },
  },
  /** Nombres legacy → actuales */
  legacyRepoNames: {
    'frio-frontend': 'polaria-wms-web',
    'frio-backend': 'polaria-wms-api',
  },
  prismaModelCount: 42,
  swaggerPath: '/api/docs',
}

export const IMPLEMENTATION_STATUS = {
  done: { icon: '✅', label: 'Implementado', key: 'done' },
  partial: { icon: '🟡', label: 'Parcial / en maduración', key: 'partial' },
  design: { icon: '🔵', label: 'Diseño / roadmap', key: 'design' },
}

export const POLARIA_STATUS_CALLOUT = `> **Estado Polaria WMS — Jul 2026**
> ✅ Implementado en API + web + BD (compras, recepción, inventario, operaciones, procesamiento, ventas, transporte, Mateo widget)
> 🟡 Maduración: observabilidad, FEFO automático completo, Fridem, staging widget CDN
> 🔵 Roadmap: API playground, Storybook, métricas centralizadas
>
> Repos: [polaria-wms-api](${POLARIA_WMS.repos.api.url}) · [polaria-wms-web](${POLARIA_WMS.repos.web.url}) · [polaria-wms-db](${POLARIA_WMS.repos.db.url}) · [Widget-react](${POLARIA_WMS.repos.widget.url})`

/** Endpoints HTTP implementados — alineado a polaria-wms-api (controllers + Swagger) */
export const POLARIA_API_ENDPOINTS = [
  { method: 'GET', path: '/', status: 'done', note: 'Health check básico', group: 'sistema' },
  { method: 'GET', path: '/api/docs', status: 'done', note: 'Swagger UI', group: 'sistema' },
  { method: 'GET', path: '/api/docs-json', status: 'done', note: 'OpenAPI JSON', group: 'sistema' },
  // Auth
  { method: 'POST', path: '/auth/prelogin', status: 'done', note: 'Header opcional x-auth-client: wms | mateo', group: 'auth' },
  { method: 'POST', path: '/auth/login', status: 'done', note: 'JWT Supabase + contexto tenant/platform', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-handoff', status: 'done', note: 'Bearer · SSO WMS → Mateo (código 60s)', group: 'auth' },
  { method: 'POST', path: '/auth/mateo/widget-token', status: 'done', note: 'Bearer · JWT widget embebido (~300s)', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-exchange', status: 'done', note: 'Canje código SSO → tokens', group: 'auth' },
  { method: 'GET', path: '/auth/me', status: 'done', note: 'Bearer · perfil + idBodegas[]', group: 'auth' },
  { method: 'POST', path: '/auth/logout', status: 'done', note: 'Bearer · 204', group: 'auth' },
  // Usuarios
  { method: 'POST', path: '/configurador/usuarios', status: 'done', note: 'Rol configurador · scope plataforma', group: 'usuarios' },
  { method: 'POST', path: '/administracion/usuarios', status: 'done', note: 'Rol administrador_cuenta · tenant del JWT', group: 'usuarios' },
  // Configuración
  { method: 'POST', path: '/configuracion/bodegas', status: 'done', note: 'configurador | administrador_cuenta', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas/:idBodega/bootstrap-layout', status: 'done', note: 'Layout ING/SLOT/SAL/PROC (interna)', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas/:idBodega/ensure-zonas-operativas', status: 'done', note: 'Backfill zonas operativas', group: 'configuracion' },
  { method: 'PATCH', path: '/configuracion/empresas/:codigoEmpresa', status: 'done', note: 'Solo configurador', group: 'configuracion' },
  { method: 'PATCH', path: '/configuracion/cuentas/:codigoCuenta', status: 'done', note: 'Solo configurador', group: 'configuracion' },
  // Integración
  { method: 'POST', path: '/integracion/solicitudes', status: 'done', note: 'operador_cuenta | administrador_cuenta', group: 'integracion' },
  { method: 'GET', path: '/integracion/solicitudes', status: 'done', note: 'Listar del tenant', group: 'integracion' },
  { method: 'GET', path: '/configurador/integracion/solicitudes', status: 'done', note: 'Bandeja configurador (todas las cuentas)', group: 'integracion' },
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
  { method: 'PATCH', path: '/compras/ordenes/:id/destino', status: 'done', note: 'Configurar bodega destino', group: 'compras-oc' },
  { method: 'POST', path: '/compras/ordenes/:id/cancelar', status: 'done', note: '→ cancelada', group: 'compras-oc' },
  // Recepción
  { method: 'POST', path: '/compras/recepciones/ordenes/:idOrdenCompra/cerrar', status: 'done', note: 'Custodio/jefe/admin · crea lote + warehouse_state', group: 'recepcion' },
  { method: 'GET', path: '/compras/recepciones', status: 'done', note: 'Historial recepciones', group: 'recepcion' },
  { method: 'GET', path: '/compras/recepciones/ordenes/:idOrdenCompra', status: 'done', note: 'Recepciones de una OC', group: 'recepcion' },
  { method: 'GET', path: '/compras/recepciones/:id', status: 'done', note: 'Detalle recepción', group: 'recepcion' },
  { method: 'GET', path: '/compras/bodegas-destino', status: 'done', note: 'Bodegas destino para OC', group: 'recepcion' },
  // Inventario
  { method: 'GET', path: '/inventario/warehouse-state', status: 'done', note: 'Mapa de posiciones (lectura API)', group: 'inventario' },
  { method: 'POST', path: '/inventario/warehouse-state/:id/lock', status: 'done', note: 'Bloquear posición (TTL 5 min)', group: 'inventario' },
  { method: 'POST', path: '/inventario/warehouse-state/:id/unlock', status: 'done', note: 'Liberar bloqueo / force unlock jefe', group: 'inventario' },
  { method: 'GET', path: '/inventario/movimientos', status: 'done', note: 'Historial movimientos append-only', group: 'inventario' },
  // Operaciones
  { method: 'GET', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Listar OT', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/ordenes-trabajo/:id', status: 'done', note: 'Detalle OT', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Crear OT + tarea (jefe_bodega)', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo/:id/ejecutar', status: 'done', note: 'Ejecutar OT (operario)', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo/:id/reportar', status: 'done', note: 'Reportar fallo → alerta', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/tareas', status: 'done', note: 'Cola de tareas', group: 'operaciones' },
  { method: 'PATCH', path: '/operaciones/tareas/:id/asignar', status: 'done', note: 'Asignar operario', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/tareas/:id/completar', status: 'done', note: 'Completar tarea + movimiento stock', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/alertas', status: 'done', note: 'Alertas operativas', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/alertas', status: 'done', note: 'Crear alerta', group: 'operaciones' },
  { method: 'PATCH', path: '/operaciones/alertas/:id/asignar', status: 'done', note: 'Asignar alerta', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/alertas/:id/cerrar', status: 'done', note: 'Cerrar alerta', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/llamadas', status: 'done', note: 'Llamadas al jefe', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/llamadas', status: 'done', note: 'Operario llama al jefe', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/llamadas/:id/atender', status: 'done', note: 'Jefe atiende llamada', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/reportes/bodega', status: 'done', note: 'Reportes de bodega', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/operarios-disponibles', status: 'done', note: 'Operarios con carga', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/presencia/ping', status: 'done', note: 'Heartbeat operario (TTL 2 min)', group: 'operaciones' },
  // Procesamiento
  { method: 'GET', path: '/procesamiento/solicitudes', status: 'done', note: 'Listar solicitudes', group: 'procesamiento' },
  { method: 'GET', path: '/procesamiento/solicitudes/:id', status: 'done', note: 'Detalle solicitud', group: 'procesamiento' },
  { method: 'GET', path: '/procesamiento/solicitudes/:id/desperdicio-sugerido', status: 'done', note: 'Sugerencia merma catálogo', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes', status: 'done', note: 'Crear solicitud (jefe/cuenta)', group: 'procesamiento' },
  { method: 'PATCH', path: '/procesamiento/solicitudes/:id/asignar-operario', status: 'done', note: 'Asigna operario + OT', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/iniciar', status: 'done', note: 'Mueve stock a zona procesamiento', group: 'procesamiento' },
  { method: 'PATCH', path: '/procesamiento/solicitudes/:id/asignar-procesador', status: 'done', note: 'Asigna procesador', group: 'procesamiento' },
  { method: 'PATCH', path: '/procesamiento/solicitudes/:id/estado', status: 'done', note: 'Cambio de estado', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/cerrar', status: 'done', note: 'Procesador declara merma', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/ordenes-post-cierre', status: 'done', note: 'OT post-cierre', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/ordenes/:idOrden/aplicar', status: 'done', note: 'Operario aplica traslados', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/terminar', status: 'done', note: 'Cierra solicitud', group: 'procesamiento' },
  // Ventas
  { method: 'GET', path: '/ventas/ordenes', status: 'done', note: 'Listar OV', group: 'ventas' },
  { method: 'POST', path: '/ventas/ordenes/:id/emitir', status: 'done', note: 'borrador → confirmada + reserva stock', group: 'ventas' },
  // Transporte
  { method: 'POST', path: '/transporte/paquetes-despacho', status: 'done', note: 'Custodio · viaje + guías', group: 'transporte' },
  { method: 'POST', path: '/transporte/entregas', status: 'done', note: 'Transportista · evidencias Cloudinary', group: 'transporte' },
  // Mateo widget conversaciones
  { method: 'GET', path: '/mateo/conversaciones', status: 'done', note: 'Historial chat embebido', group: 'mateo' },
  { method: 'GET', path: '/mateo/conversaciones/:id', status: 'done', note: 'Detalle conversación', group: 'mateo' },
  { method: 'POST', path: '/mateo/conversaciones', status: 'done', note: 'Nueva conversación', group: 'mateo' },
  { method: 'POST', path: '/mateo/conversaciones/:id/mensajes', status: 'done', note: 'Agregar mensaje', group: 'mateo' },
  { method: 'DELETE', path: '/mateo/conversaciones/:id', status: 'done', note: 'Eliminar conversación', group: 'mateo' },
]

export const POLARIA_API_MODULE_STATUS = [
  { module: 'auth', path: '/auth', status: 'done', note: 'Login, sesión, SSO Mateo, widget-token' },
  { module: 'configurator', path: '/configurador, /administracion', status: 'done', note: 'Alta usuarios por rol' },
  { module: 'configuracion', path: '/configuracion', status: 'done', note: 'Bodegas, layout, empresa/cuenta' },
  { module: 'purchases', path: '/compras', status: 'done', note: 'SOL + OC + recepción' },
  { module: 'integration', path: '/integracion', status: 'done', note: 'Solicitudes bodega externa' },
  { module: 'inventory', path: '/inventario', status: 'done', note: 'warehouse_state, lock/unlock, movimientos' },
  { module: 'operations', path: '/operaciones', status: 'done', note: 'OT, tareas, alertas, llamadas, reportes' },
  { module: 'processing', path: '/procesamiento', status: 'done', note: 'Flujo primario→secundario + merma' },
  { module: 'sales', path: '/ventas', status: 'done', note: 'Emitir OV + reserva stock' },
  { module: 'transport', path: '/transporte', status: 'done', note: 'Paquetes despacho + entregas' },
  { module: 'mateo-widget', path: '/mateo/conversaciones', status: 'done', note: 'Persistencia chat embebido' },
]

export const POLARIA_API_PENDING = [
  'Integración Fridem (scraping/API) en producción',
  'FEFO automático completo en todas las salidas',
  'Salida cruzada con validación de peso avanzada',
  'Observabilidad centralizada (métricas, alertas SLO)',
  'Validación JWT en workflow n8n (POL-71)',
  'CDN estable del bundle mateo-widget.js en producción',
  'Módulos stub sin código: accounts, audit, companies, files, health, notifications, settings, users, warehouses',
]

export const POLARIA_RLS_STRATEGY = {
  title: 'RLS híbrido (TENANT-RLS)',
  rows: [
    { channel: 'Web lecturas', credential: 'supabase-js + JWT usuario', rls: 'Aplica' },
    { channel: 'Web Realtime', credential: 'supabase-js + JWT usuario', rls: 'Aplica (warehouse_state, tarea_cola, alerta_operativa)' },
    { channel: 'API escrituras sensibles', credential: 'Prisma + DATABASE_URL', rls: 'Bypass + validación tenant en código' },
  ],
  backendOnlyTables: [
    'warehouse_state (escritura)',
    'movimiento_inventario',
    'contador',
    'auditoria_operacion (INSERT)',
  ],
  antiPatterns: [
    'No exponer service role al browser',
    'No insert directo en tabla bodega desde web (usar POST /configuracion/bodegas)',
    'No confiar solo en guards de UI — RLS y SensitiveWriteGuard en API',
  ],
}

export const POLARIA_ENV_VARS = {
  api: [
    { name: 'SUPABASE_URL', required: true },
    { name: 'SUPABASE_ANON_KEY', required: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', required: true },
    { name: 'DATABASE_URL', required: true, note: 'Postgres directo Prisma, bypass RLS' },
    { name: 'MATEO_HANDOFF_SECRET', required: true },
    { name: 'MATEO_WIDGET_JWT_SECRET', required: true, note: 'Firma JWT widget (~300s)' },
    { name: 'MATEO_WIDGET_JWT_ISSUER', required: false },
    { name: 'MATEO_ALLOWED_ORIGINS', required: false },
    { name: 'PORT', required: false, default: '3000' },
  ],
  web: [
    { name: 'NEXT_PUBLIC_API_URL', required: true, note: 'URL polaria-wms-api' },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
    { name: 'NEXT_PUBLIC_MATEO_WIDGET_SCRIPT_URL', required: false, note: '/assets/mateo-widget.js' },
    { name: 'N8N_WEBHOOK_*', required: false, note: 'Solicitud compra, pedido proveedor' },
    { name: 'CLOUDINARY_*', required: false, note: 'Evidencias transporte' },
  ],
  widget: [
    { name: 'VITE_N8N_WEBHOOK_URL', required: true },
    { name: 'VITE_CLOUDINARY_CLOUD_NAME', required: true },
    { name: 'VITE_CLOUDINARY_UPLOAD_PRESET', required: true },
  ],
  optional: ['Fridem Firebase read-only', 'n8n pedido proveedor'],
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
    '## API — polaria-wms-api',
    '',
    'Fuente: [polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api) · Swagger: `GET /api/docs` · OpenAPI: `GET /api/docs-json`',
    '',
    'Guards transversales: `JwtAuthGuard`, `TenantGuard`, `RolesGuard`. Escrituras sensibles además: `SensitiveWriteGuard`.',
    '',
    'Headers tenant en rutas operativas: `X-Codigo-Empresa`, `X-Codigo-Cuenta`, `X-Id-Bodega`.',
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
  lines.push('', '### Pendiente / roadmap', '')
  for (const p of POLARIA_API_PENDING) {
    lines.push(`- 🟡 ${p}`)
  }
  lines.push(
    '',
    '### Route handlers Next.js (polaria-wms-web)',
    '',
    '| Método | Ruta | Propósito |',
    '| --- | --- | --- |',
    '| POST | `/api/solicitud-compra` | Webhook n8n al crear SOL |',
    '| POST | `/api/pedido-proveedor` | Notificación pedido a proveedor |',
    '| POST | `/api/evidencia-transporte` | Subida evidencias Cloudinary |',
    '| POST | `/api/operaciones/sync-demora-alertas` | Sync alertas demora |',
    '| GET | `/api/ventas/productos-catalogo` | Catálogo productos ventas |',
  )
  return lines.join('\n')
}
