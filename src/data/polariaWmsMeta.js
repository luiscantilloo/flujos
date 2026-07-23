/**
 * Metadatos Polaria WMS — fuente de verdad para el Dev Hub (jun 2026).
 * Repos: polaria-wms-api, polaria-wms-web, polaria-wms-db
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
      role: 'Mateo Support — widget de chat embebible (Shadow DOM, n8n, Supabase vía API)',
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
  prismaEnumCount: 24,
  dbTableCount: 41,
  swaggerPath: '/api/docs',
}

export const IMPLEMENTATION_STATUS = {
  done: { icon: '✅', label: 'Implementado', key: 'done' },
  partial: { icon: '🟡', label: 'Parcial / schema listo', key: 'partial' },
  design: { icon: '🔵', label: 'Diseño (no implementado)', key: 'design' },
}

export const POLARIA_STATUS_CALLOUT = `> **Estado Polaria WMS — Jul 2026**
> ✅ Implementado en API/web · 🟡 Parcial / afinamiento · 🔵 Diseño roadmap (Dev Hub)
>
> Repos fuente de verdad: [polaria-wms-api](${POLARIA_WMS.repos.api.url}) · [polaria-wms-web](${POLARIA_WMS.repos.web.url}) · [polaria-wms-db](${POLARIA_WMS.repos.db.url}) · [Widget-react](${POLARIA_WMS.repos.widget.url})`

/** Endpoints HTTP implementados — alineado a polaria-wms-api (controllers + Swagger, Jul 2026) */
export const POLARIA_API_ENDPOINTS = [
  { method: 'GET', path: '/', status: 'done', note: 'Health check / bienvenida', group: 'sistema' },
  { method: 'GET', path: '/api/docs', status: 'done', note: 'Swagger UI', group: 'sistema' },
  { method: 'GET', path: '/api/docs-json', status: 'done', note: 'OpenAPI JSON', group: 'sistema' },
  // Auth
  { method: 'POST', path: '/auth/prelogin', status: 'done', note: 'Header opcional x-auth-client: wms | mateo', group: 'auth' },
  { method: 'POST', path: '/auth/login', status: 'done', note: 'JWT Supabase + contexto tenant/platform', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-handoff', status: 'done', note: 'Bearer · SSO WMS → Mateo (código 60s)', group: 'auth' },
  { method: 'POST', path: '/auth/mateo/widget-token', status: 'done', note: 'Bearer · JWT HS256 widget embebido (300s)', group: 'auth' },
  { method: 'POST', path: '/auth/mateo-exchange', status: 'done', note: 'Canje código SSO → tokens', group: 'auth' },
  { method: 'GET', path: '/auth/me', status: 'done', note: 'Bearer · perfil + idBodegas[]', group: 'auth' },
  { method: 'POST', path: '/auth/logout', status: 'done', note: 'Bearer · sign-out global Supabase', group: 'auth' },
  // Usuarios
  { method: 'POST', path: '/configurador/usuarios', status: 'done', note: 'Rol configurador · alta cross-cuenta', group: 'usuarios' },
  { method: 'POST', path: '/administracion/usuarios', status: 'done', note: 'Rol administrador_cuenta · tenant del JWT', group: 'usuarios' },
  // Configuración (empresa / cuenta / bodega)
  { method: 'PATCH', path: '/configuracion/empresas/:codigoEmpresa', status: 'done', note: 'configurador · razón social, teléfono, activa', group: 'configuracion' },
  { method: 'PATCH', path: '/configuracion/cuentas/:codigoCuenta', status: 'done', note: 'configurador · datos + sync bodegas', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas', status: 'done', note: 'configurador | administrador_cuenta · bypass RLS', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas/:idBodega/bootstrap-layout', status: 'done', note: 'Layout zonas/ubicaciones (ING/SLOT/SAL/PROC)', group: 'configuracion' },
  { method: 'POST', path: '/configuracion/bodegas/:idBodega/ensure-zonas-operativas', status: 'done', note: 'Rellena zonas operativas faltantes (idempotente)', group: 'configuracion' },
  // Compras SOL
  { method: 'POST', path: '/compras/solicitudes', status: 'done', note: 'Crear SOL borrador', group: 'compras-sol' },
  { method: 'GET', path: '/compras/solicitudes', status: 'done', note: 'Listar SOL tenant', group: 'compras-sol' },
  { method: 'GET', path: '/compras/solicitudes/:id', status: 'done', note: 'Detalle SOL', group: 'compras-sol' },
  { method: 'PATCH', path: '/compras/solicitudes/:id', status: 'done', note: 'Editar borrador', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/enviar-aprobacion', status: 'done', note: 'borrador → pendiente_aprobacion', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/aprobar', status: 'done', note: '→ aprobada (admin_cuenta | configurador)', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/rechazar', status: 'done', note: '→ rechazada', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/cancelar', status: 'done', note: '→ cancelada', group: 'compras-sol' },
  { method: 'POST', path: '/compras/solicitudes/:id/convertir-oc', status: 'done', note: 'SOL aprobada → OC atómica', group: 'compras-sol' },
  // Compras OC
  { method: 'POST', path: '/compras/ordenes', status: 'done', note: 'Crear OC (directa o desde SOL)', group: 'compras-oc' },
  { method: 'GET', path: '/compras/ordenes', status: 'done', note: 'Listar OC tenant', group: 'compras-oc' },
  { method: 'GET', path: '/compras/ordenes/:id', status: 'done', note: 'Detalle OC', group: 'compras-oc' },
  { method: 'POST', path: '/compras/ordenes/:id/emitir', status: 'done', note: 'borrador → emitida (valida destino + capacidad)', group: 'compras-oc' },
  { method: 'PATCH', path: '/compras/ordenes/:id/destino', status: 'done', note: 'Actualiza destino en OC borrador', group: 'compras-oc' },
  { method: 'POST', path: '/compras/ordenes/:id/cancelar', status: 'done', note: '→ cancelada', group: 'compras-oc' },
  { method: 'GET', path: '/compras/bodegas-destino', status: 'done', note: 'Bodegas destino con slots libres', group: 'compras-oc' },
  // Compras recepción
  { method: 'POST', path: '/compras/recepciones/ordenes/:idOrdenCompra/cerrar', status: 'done', note: 'Cierre conciliación ciega + temperatura', group: 'compras-recepcion' },
  { method: 'GET', path: '/compras/recepciones', status: 'done', note: 'Listar recepciones', group: 'compras-recepcion' },
  { method: 'GET', path: '/compras/recepciones/ordenes/:idOrdenCompra', status: 'done', note: 'Recepción por OC', group: 'compras-recepcion' },
  { method: 'GET', path: '/compras/recepciones/:id', status: 'done', note: 'Recepción por id', group: 'compras-recepcion' },
  // Inventario
  { method: 'GET', path: '/inventario/movimientos', status: 'done', note: 'Historial de movimientos (POL-106)', group: 'inventario' },
  { method: 'GET', path: '/inventario/warehouse-state', status: 'done', note: 'Posiciones del mapa (Realtime)', group: 'inventario' },
  { method: 'POST', path: '/inventario/warehouse-state/:id/lock', status: 'done', note: 'Bloquear posición (SensitiveWrite)', group: 'inventario' },
  { method: 'POST', path: '/inventario/warehouse-state/:id/unlock', status: 'done', note: 'Liberar / forzar liberación', group: 'inventario' },
  // Operaciones (OT, tareas, alertas, llamadas, reportes, presencia)
  { method: 'GET', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Listar OT', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/ordenes-trabajo/:id', status: 'done', note: 'Detalle OT', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo', status: 'done', note: 'Crear OT (a_bodega/a_salida/revisar) · jefe', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo/:id/ejecutar', status: 'done', note: 'Ejecutar OT (transferencia inventario) · operario', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/ordenes-trabajo/:id/reportar', status: 'done', note: 'Reportar fallo → alerta', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/tareas', status: 'done', note: 'Cola de tareas pendientes', group: 'operaciones' },
  { method: 'PATCH', path: '/operaciones/tareas/:id/asignar', status: 'done', note: 'Asignar tarea a operario/procesador', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/tareas/:id/completar', status: 'done', note: 'Completar tarea (+ OT si vinculada)', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/alertas', status: 'done', note: 'Listar alertas operativas', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/alertas', status: 'done', note: 'Crear alerta', group: 'operaciones' },
  { method: 'PATCH', path: '/operaciones/alertas/:id/asignar', status: 'done', note: 'Asignar alerta', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/alertas/:id/cerrar', status: 'done', note: 'Cerrar alerta', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/llamadas', status: 'done', note: 'Llamadas al jefe', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/llamadas', status: 'done', note: 'Llamar al jefe (alerta llamada_jefe)', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/llamadas/:id/atender', status: 'done', note: 'Marcar llamada atendida', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/reportes/bodega', status: 'done', note: 'Resumen operativo de bodega', group: 'operaciones' },
  { method: 'GET', path: '/operaciones/operarios-disponibles', status: 'done', note: 'Operarios + carga/disponibilidad', group: 'operaciones' },
  { method: 'POST', path: '/operaciones/presencia/ping', status: 'done', note: 'Heartbeat de operario (TTL 2 min)', group: 'operaciones' },
  // Procesamiento
  { method: 'GET', path: '/procesamiento/solicitudes', status: 'done', note: 'Listar solicitudes de procesamiento', group: 'procesamiento' },
  { method: 'GET', path: '/procesamiento/solicitudes/:id', status: 'done', note: 'Detalle', group: 'procesamiento' },
  { method: 'GET', path: '/procesamiento/solicitudes/:id/desperdicio-sugerido', status: 'done', note: 'Merma sugerida por % de catálogo', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes', status: 'done', note: 'Crear solicitud · jefe', group: 'procesamiento' },
  { method: 'PATCH', path: '/procesamiento/solicitudes/:id/asignar-operario', status: 'done', note: 'Jefe asigna operario', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/iniciar', status: 'done', note: 'Operario inicia (descuenta primario)', group: 'procesamiento' },
  { method: 'PATCH', path: '/procesamiento/solicitudes/:id/asignar-procesador', status: 'done', note: 'Pre-asignar procesador', group: 'procesamiento' },
  { method: 'PATCH', path: '/procesamiento/solicitudes/:id/estado', status: 'done', note: 'Transición manual de estado', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/cerrar', status: 'done', note: 'Procesador cierra → pendiente_cierre', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/ordenes-post-cierre', status: 'done', note: 'Crear OT retorno a bodega', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/ordenes/:idOrden/aplicar', status: 'done', note: 'Operario aplica OT al mapa', group: 'procesamiento' },
  { method: 'POST', path: '/procesamiento/solicitudes/:id/terminar', status: 'done', note: 'Marcar terminada tras ubicar en mapa', group: 'procesamiento' },
  // Ventas
  { method: 'GET', path: '/ventas/ordenes', status: 'done', note: 'Listar OV (paraSalida=true → pendientes despacho)', group: 'ventas' },
  { method: 'POST', path: '/ventas/ordenes/:id/emitir', status: 'done', note: 'borrador → confirmada (reserva stock + OT)', group: 'ventas' },
  // Transporte
  { method: 'POST', path: '/transporte/paquetes-despacho', status: 'done', note: 'Armar viaje + guías (marca camión ocupado)', group: 'transporte' },
  { method: 'POST', path: '/transporte/entregas', status: 'done', note: 'Registrar entrega (foto, firma, cierre viaje/OV)', group: 'transporte' },
  // Integración
  { method: 'POST', path: '/integracion/solicitudes', status: 'done', note: 'operador_cuenta | administrador_cuenta', group: 'integracion' },
  { method: 'GET', path: '/integracion/solicitudes', status: 'done', note: 'Listar del tenant', group: 'integracion' },
  { method: 'GET', path: '/configurador/integracion/solicitudes', status: 'done', note: 'Bandeja configurador (todas las cuentas)', group: 'integracion' },
  // Mateo widget (persistencia de conversaciones)
  { method: 'GET', path: '/mateo/conversaciones', status: 'done', note: 'Conversaciones del usuario', group: 'mateo' },
  { method: 'GET', path: '/mateo/conversaciones/:id', status: 'done', note: 'Detalle + mensajes', group: 'mateo' },
  { method: 'POST', path: '/mateo/conversaciones', status: 'done', note: 'Crear conversación', group: 'mateo' },
  { method: 'POST', path: '/mateo/conversaciones/:id/mensajes', status: 'done', note: 'Agregar mensaje (user/ai)', group: 'mateo' },
  { method: 'DELETE', path: '/mateo/conversaciones/:id', status: 'done', note: 'Eliminar conversación propia', group: 'mateo' },
]

export const POLARIA_API_MODULE_STATUS = [
  { module: 'auth', path: '/auth', status: 'done', note: 'Login, sesión, SSO Mateo + widget token' },
  { module: 'configurator', path: '/configurador, /administracion', status: 'done', note: 'Alta usuarios por rol' },
  { module: 'configuracion', path: '/configuracion/{empresas,cuentas,bodegas}', status: 'done', note: 'Empresa/cuenta/bodega + bootstrap layout' },
  { module: 'purchases', path: '/compras', status: 'done', note: 'SOL + OC + recepción (conciliación ciega)' },
  { module: 'inventory', path: '/inventario', status: 'done', note: 'warehouse_state, locking, movimientos' },
  { module: 'operations', path: '/operaciones', status: 'done', note: 'OT, cola tareas, alertas, llamadas, presencia' },
  { module: 'processing', path: '/procesamiento', status: 'done', note: 'Primario→secundario, merma, OT post-cierre' },
  { module: 'sales', path: '/ventas', status: 'done', note: 'OV: emitir, reservar stock, generar OT' },
  { module: 'transport', path: '/transporte', status: 'done', note: 'Paquete despacho + entrega con evidencia' },
  { module: 'integration', path: '/integracion, /configurador/integracion', status: 'done', note: 'Solicitudes bodega externa' },
  { module: 'mateo-widget', path: '/mateo/conversaciones', status: 'done', note: 'Persistencia chat Mateo (widget_*)' },
]

export const POLARIA_API_PENDING = [
  'Módulos placeholder sin controllers: accounts, companies, files, health, notifications, settings, users, warehouses',
  'Cotización comparativa de proveedores e historial de precios',
  'FEFO automático a nivel de base de datos (hoy resuelto en la capa API con lote.fecha_vencimiento)',
  'MFA, rate limiting y gobernanza de refresh token (ver Seguridad y RBAC)',
  'Fridem read-only (bodega externa) y lecturas de inventario integradas',
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
    'evidencia_transporte',
    'recepcion_compra / recepcion_compra_linea',
  ],
  antiPatterns: [
    'No exponer service role al browser',
    'No insert directo en tabla bodega desde web (usar POST /configuracion/bodegas)',
    'No falsear codigo_cuenta en widget_conversacion (RLS POL-138 lo bloquea)',
  ],
}

export const POLARIA_ENV_VARS = {
  api: [
    { name: 'SUPABASE_URL', required: true },
    { name: 'SUPABASE_ANON_KEY', required: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', required: true, note: 'Admin Auth (alta usuarios, logout, sesión Mateo)' },
    { name: 'DATABASE_URL', required: true, note: 'Postgres directo Prisma, bypass RLS' },
    { name: 'MATEO_HANDOFF_SECRET', required: true, note: 'Firma código SSO Mateo (60s)' },
    { name: 'MATEO_WIDGET_JWT_SECRET', required: true, note: 'Firma JWT HS256 del widget (compartido con n8n)' },
    { name: 'MATEO_WIDGET_JWT_ISSUER', required: false, default: 'bodega-frio-v2' },
    { name: 'MATEO_WIDGET_JWT_AUDIENCE', required: false, default: 'mateo-support-widget' },
    { name: 'MATEO_WIDGET_JWT_KID', required: false, default: 'local-dev-v1' },
    { name: 'MATEO_ALLOWED_ORIGINS', required: false, note: 'CORS (coma-separado)' },
    { name: 'PORT', required: false, default: '3000' },
  ],
  web: [
    { name: 'NEXT_PUBLIC_API_BASE_URL', required: true, note: 'URL backend Nest (dev: proxy /api)' },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
    { name: 'NEXT_PUBLIC_MATEO_URL', required: false, note: 'Chatbot Mateo (SSO full-page)' },
    { name: 'NEXT_PUBLIC_MATEO_WIDGET_SCRIPT_URL', required: false, default: '/assets/mateo-widget.js' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', required: false, note: 'Solo route handlers (sync alertas demora)' },
    { name: 'CLOUDINARY_URL', required: false, note: 'Evidencias de transporte' },
    { name: 'PEDIDO_PROVEEDOR_WEBHOOK_URL', required: false, note: 'n8n pedido a proveedor' },
    { name: 'SOLICITUD_COMPRA_WEBHOOK_URL', required: false, note: 'n8n aviso de SOL' },
  ],
  widget: [
    { name: 'VITE_N8N_WEBHOOK_URL', required: true, note: 'Webhook Mateo (respuestas RAG)' },
    { name: 'VITE_CLOUDINARY_CLOUD_NAME', required: false, note: 'Subida de imágenes' },
    { name: 'VITE_CLOUDINARY_UPLOAD_PRESET', required: false, note: 'Preset unsigned' },
  ],
  optional: ['Cloudinary (evidencias/imágenes)', 'n8n (pedido proveedor, SOL, Mateo)', 'Fridem read-only (bodega externa)'],
}

/** Mapeo Prisma → id entidad (= nombre tabla Supabase) */
export { PRISMA_TO_ENTITY, PRISMA_MODEL_COUNT } from './prismaEntityManifest.js'

export function formatPolariaStatusCallout() {
  return POLARIA_STATUS_CALLOUT
}

/** Etiquetas legibles de cada grupo de endpoints. */
export const POLARIA_API_GROUP_LABELS = {
  sistema: 'Sistema',
  auth: 'Autenticación y SSO',
  usuarios: 'Usuarios',
  configuracion: 'Configuración (empresa · cuenta · bodega)',
  'compras-sol': 'Compras — Solicitudes (SOL)',
  'compras-oc': 'Compras — Órdenes (OC)',
  'compras-recepcion': 'Compras — Recepción',
  inventario: 'Inventario y mapa',
  operaciones: 'Operaciones (OT · tareas · alertas)',
  procesamiento: 'Procesamiento',
  ventas: 'Ventas (OV)',
  transporte: 'Transporte',
  integracion: 'Integración bodega externa',
  mateo: 'Mateo — conversaciones (widget)',
}

export function formatPolariaApiMarkdown() {
  const total = POLARIA_API_ENDPOINTS.length
  const groups = [...new Set(POLARIA_API_ENDPOINTS.map((e) => e.group))]
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Endpoints implementados (`polaria-wms-api`)',
    '',
    `Fuente: [polaria-wms-api](${POLARIA_WMS.repos.api.url}) · Swagger: \`GET /api/docs\` · OpenAPI: \`GET /api/docs-json\``,
    '',
    `**${total} endpoints** en **${POLARIA_API_MODULE_STATUS.length} módulos NestJS** · Prisma con **${POLARIA_WMS.prismaModelCount} modelos** sobre **${POLARIA_WMS.dbTableCount} tablas** (Supabase/PostgreSQL).`,
    '',
    'Guards transversales: `JwtAuthGuard`, `TenantGuard`, `RolesGuard` y `SensitiveWriteGuard` (escrituras de inventario/OT). Header opcional: `x-auth-client: wms | mateo` en prelogin/login.',
    '',
  ]
  for (const g of groups) {
    lines.push(`### ${POLARIA_API_GROUP_LABELS[g] ?? g}`, '', '| Método | Ruta | Estado | Notas |', '| --- | --- | --- | --- |')
    for (const ep of POLARIA_API_ENDPOINTS.filter((e) => e.group === g)) {
      const st = IMPLEMENTATION_STATUS[ep.status]?.icon ?? ep.status
      lines.push(`| ${ep.method} | \`${ep.path}\` | ${st} | ${ep.note || '—'} |`)
    }
    lines.push('')
  }
  lines.push('### Módulos NestJS', '', '| Módulo | Prefijo | Estado | Notas |', '| --- | --- | --- | --- |')
  for (const m of POLARIA_API_MODULE_STATUS) {
    const st = IMPLEMENTATION_STATUS[m.status]?.icon ?? m.status
    lines.push(`| ${m.module} | ${m.path} | ${st} | ${m.note} |`)
  }
  lines.push('', '### Pendiente / roadmap', '')
  for (const p of POLARIA_API_PENDING) {
    lines.push(`- 🔵 ${p}`)
  }
  return lines.join('\n')
}
