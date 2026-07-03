/**
 * Orden de lectura — 40 tablas Supabase (polaria-wms-db).
 * Auth externo: auth.users (Supabase), no tabla public.
 */

/** @typedef {'seed'|'configurador'|'admin_cuenta'|'operador_cuenta'|'bodega'|'sistema'|'externo'} ActorAlta */

export const SCHEMA_READING_PHASES = [
  {
    id: '0',
    label: 'FASE 0 — Configurador TI (plataforma)',
    actor: 'configurador',
    summary: 'Rol configurador en usuario + auth.users (Supabase). Sin codigo_empresa cliente.',
  },
  {
    id: '1',
    label: 'FASE 1 — Empresa y administrador de cuenta',
    actor: 'configurador',
    summary: 'TI crea empresa y administrador_cuenta vinculado a codigo_empresa.',
  },
  {
    id: '2',
    label: 'FASE 2 — Tenant (cuenta)',
    actor: 'configurador',
    summary: 'codigo_cuenta bajo empresa. Catálogos y documentos cuelgan del tenant (scope C).',
  },
  {
    id: '3',
    label: 'FASE 3 — Bodegas e integración',
    actor: 'admin_cuenta + configurador',
    summary: 'solicitud_alta_bodega, POST API bodegas, solicitud_integracion, tarea_cuenta.',
  },
  {
    id: '4',
    label: 'FASE 4 — Catálogos',
    actor: 'administrador_cuenta',
    summary: 'proveedor, cliente, producto, comprador, planta, camion (scope C).',
  },
  {
    id: '5',
    label: 'FASE 5 — Equipo de bodega',
    actor: 'administrador_cuenta',
    summary: 'asignacion_bodega: usuario ↔ bodega ↔ rol bodega.',
  },
  {
    id: '6',
    label: 'FASE 6 — Compras SOL / OC / recepción',
    actor: 'operador_cuenta',
    summary: 'solicitud_compra → orden_compra → recepcion_compra (scope C+B).',
  },
  {
    id: '7',
    label: 'FASE 7 — Layout e inventario',
    actor: 'roles de bodega',
    summary: 'tipo_ubicacion, zona, ubicacion, lote, warehouse_state, movimiento_inventario.',
  },
  {
    id: '8',
    label: 'FASE 8 — Cola operativa y procesamiento',
    actor: 'bodega · procesador',
    summary: 'orden_trabajo, alerta_operativa, tarea_cola, solicitud_procesamiento, registro_merma.',
  },
  {
    id: '9',
    label: 'FASE 9 — Ventas, transporte y sistema',
    actor: 'operador · transportista',
    summary: 'orden_venta, viaje_transporte, guia_envio, evidencia_transporte, contador, auditoria_operacion.',
  },
]

export const TABLE_READING_SEQUENCE = [
  { order: 0, phaseId: '0', phaseLabel: 'FASE 0', entityId: 'rol', table: 'rol', title: 'Roles WMS', readFirst: '9 perfiles seed.', thenRead: 'auth.users + usuario.', createdBy: 'seed', indexes: ['PK (id_rol)'] },
  { order: 1, phaseId: '0', phaseLabel: 'FASE 0', entityId: '_auth_externo', table: 'auth.users', title: 'Supabase Auth', readFirst: 'Login prelogin/login. No está en public.', thenRead: 'empresa.', createdBy: 'externo', indexes: ['PK (id)'] },
  { order: 2, phaseId: '1', phaseLabel: 'FASE 1', entityId: 'empresa', table: 'empresa', title: 'Empresa', readFirst: 'Cliente SaaS.', thenRead: 'usuario admin.', createdBy: 'configurador', indexes: ['PK (codigo_empresa)'] },
  { order: 3, phaseId: '1', phaseLabel: 'FASE 1', entityId: 'usuario', table: 'usuario', title: 'Usuarios', readFirst: 'id_auth → auth.users.', thenRead: 'cuenta.', createdBy: 'configurador', indexes: ['PK (id_usuario)', 'UNIQUE (correo)'] },
  { order: 4, phaseId: '2', phaseLabel: 'FASE 2', entityId: 'cuenta', table: 'cuenta', title: 'Tenant', readFirst: 'codigo_cuenta FK empresa.', thenRead: 'bodega.', createdBy: 'configurador', indexes: ['PK (codigo_cuenta)'] },
  { order: 5, phaseId: '3', phaseLabel: 'FASE 3', entityId: 'solicitud_alta_bodega', table: 'solicitud_alta_bodega', title: 'Solicitud alta bodega', readFirst: 'Admin pide bodega.', thenRead: 'bodega.', createdBy: 'admin_cuenta', indexes: ['PK (id_solicitud)'] },
  { order: 6, phaseId: '3', phaseLabel: 'FASE 3', entityId: 'bodega', table: 'bodega', title: 'Bodega', readFirst: 'POST /configuracion/bodegas.', thenRead: 'asignacion_bodega.', createdBy: 'configurador', indexes: ['PK (id_bodega)'] },
  { order: 7, phaseId: '3', phaseLabel: 'FASE 3', entityId: 'solicitud_integracion', table: 'solicitud_integracion', title: 'Integración externa', readFirst: 'Operador → configurador.', thenRead: 'tarea_cuenta.', createdBy: 'operador_cuenta', indexes: ['PK (id_solicitud_integracion)'] },
  { order: 8, phaseId: '3', phaseLabel: 'FASE 3', entityId: 'tarea_cuenta', table: 'tarea_cuenta', title: 'Tarea cuenta', readFirst: 'Bandeja configurador.', thenRead: 'catálogos.', createdBy: 'configurador', indexes: ['PK (id_tarea_cuenta)'] },
  { order: 9, phaseId: '4', phaseLabel: 'FASE 4', entityId: 'proveedor', table: 'proveedor', title: 'Proveedor', readFirst: 'Scope C.', thenRead: 'cliente.', createdBy: 'admin_cuenta', indexes: ['PK (id_proveedor)'] },
  { order: 10, phaseId: '4', phaseLabel: 'FASE 4', entityId: 'cliente', table: 'cliente', title: 'Cliente', readFirst: 'Scope C.', thenRead: 'producto.', createdBy: 'admin_cuenta', indexes: ['PK (id_cliente)'] },
  { order: 11, phaseId: '4', phaseLabel: 'FASE 4', entityId: 'producto', table: 'producto', title: 'Producto', readFirst: 'SKU por tenant.', thenRead: 'comprador.', createdBy: 'admin_cuenta', indexes: ['PK (id_producto)'] },
  { order: 12, phaseId: '4', phaseLabel: 'FASE 4', entityId: 'comprador', table: 'comprador', title: 'Comprador', readFirst: 'Scope C.', thenRead: 'planta.', createdBy: 'admin_cuenta', indexes: ['PK (id_comprador)'] },
  { order: 13, phaseId: '4', phaseLabel: 'FASE 4', entityId: 'planta', table: 'planta', title: 'Planta', readFirst: 'Destino OV.', thenRead: 'camion.', createdBy: 'admin_cuenta', indexes: ['PK (id_planta)'] },
  { order: 14, phaseId: '4', phaseLabel: 'FASE 4', entityId: 'camion', table: 'camion', title: 'Camión', readFirst: 'Flota tenant.', thenRead: 'asignacion_bodega.', createdBy: 'admin_cuenta', indexes: ['PK (id_camion)'] },
  { order: 15, phaseId: '5', phaseLabel: 'FASE 5', entityId: 'asignacion_bodega', table: 'asignacion_bodega', title: 'Asignación bodega', readFirst: 'Roles físicos por bodega.', thenRead: 'SOL.', createdBy: 'admin_cuenta', indexes: ['PK (id_asignacion)'] },
  { order: 16, phaseId: '6', phaseLabel: 'FASE 6', entityId: 'solicitud_compra', table: 'solicitud_compra', title: 'SOL', readFirst: 'Estados aprobación.', thenRead: 'solicitud_compra_linea.', createdBy: 'operador_cuenta', indexes: ['PK (id_solicitud_compra)'] },
  { order: 17, phaseId: '6', phaseLabel: 'FASE 6', entityId: 'solicitud_compra_linea', table: 'solicitud_compra_linea', title: 'Línea SOL', readFirst: 'Detalle SOL.', thenRead: 'orden_compra.', createdBy: 'operador_cuenta', indexes: ['PK (id_linea_solicitud_compra)'] },
  { order: 18, phaseId: '6', phaseLabel: 'FASE 6', entityId: 'orden_compra', table: 'orden_compra', title: 'OC', readFirst: 'emitida / recepción.', thenRead: 'orden_compra_linea.', createdBy: 'operador_cuenta', indexes: ['PK (id_orden_compra)'] },
  { order: 19, phaseId: '6', phaseLabel: 'FASE 6', entityId: 'orden_compra_linea', table: 'orden_compra_linea', title: 'Línea OC', readFirst: 'cantidad_recibida.', thenRead: 'recepcion_compra.', createdBy: 'operador_cuenta', indexes: ['PK (id_linea_orden_compra)'] },
  { order: 20, phaseId: '6', phaseLabel: 'FASE 6', entityId: 'recepcion_compra', table: 'recepcion_compra', title: 'Recepción compra', readFirst: '🟡 Schema listo.', thenRead: 'recepcion_compra_linea.', createdBy: 'bodega', indexes: ['PK (id_recepcion)'] },
  { order: 21, phaseId: '6', phaseLabel: 'FASE 6', entityId: 'recepcion_compra_linea', table: 'recepcion_compra_linea', title: 'Línea recepción', readFirst: 'Conciliación OC.', thenRead: 'layout bodega.', createdBy: 'bodega', indexes: ['PK (id_linea_recepcion)'] },
  { order: 22, phaseId: '7', phaseLabel: 'FASE 7', entityId: 'tipo_ubicacion', table: 'tipo_ubicacion', title: 'Tipo ubicación', readFirst: 'bootstrap-layout.', thenRead: 'zona.', createdBy: 'configurador', indexes: ['PK (id_tipo_ubicacion)'] },
  { order: 23, phaseId: '7', phaseLabel: 'FASE 7', entityId: 'zona', table: 'zona', title: 'Zona', readFirst: 'Agrupa ubicaciones.', thenRead: 'ubicacion.', createdBy: 'configurador', indexes: ['PK (id_zona)'] },
  { order: 24, phaseId: '7', phaseLabel: 'FASE 7', entityId: 'ubicacion', table: 'ubicacion', title: 'Ubicación (slot)', readFirst: 'estado_slot en fila.', thenRead: 'lote.', createdBy: 'configurador', indexes: ['PK (id_ubicacion)'] },
  { order: 25, phaseId: '7', phaseLabel: 'FASE 7', entityId: 'lote', table: 'lote', title: 'Lote', readFirst: 'Trazabilidad FEFO.', thenRead: 'warehouse_state.', createdBy: 'bodega', indexes: ['PK (id_lote)'] },
  { order: 26, phaseId: '7', phaseLabel: 'FASE 7', entityId: 'warehouse_state', table: 'warehouse_state', title: 'Inventario en vivo', readFirst: 'Escritura solo API.', thenRead: 'movimiento_inventario.', createdBy: 'sistema', indexes: ['PK (id_warehouse_state)'] },
  { order: 27, phaseId: '7', phaseLabel: 'FASE 7', entityId: 'movimiento_inventario', table: 'movimiento_inventario', title: 'Movimientos', readFirst: 'Append-only audit.', thenRead: 'orden_trabajo.', createdBy: 'sistema', indexes: ['PK (id_movimiento_inventario)'] },
  { order: 28, phaseId: '8', phaseLabel: 'FASE 8', entityId: 'orden_trabajo', table: 'orden_trabajo', title: 'Orden trabajo', readFirst: 'Cola mapa.', thenRead: 'orden_trabajo_linea.', createdBy: 'bodega', indexes: ['PK (id_orden_trabajo)'] },
  { order: 29, phaseId: '8', phaseLabel: 'FASE 8', entityId: 'orden_trabajo_linea', table: 'orden_trabajo_linea', title: 'Línea OT', readFirst: 'Entrada/salida OT.', thenRead: 'alerta_operativa.', createdBy: 'bodega', indexes: ['PK (id_linea_orden_trabajo)'] },
  { order: 30, phaseId: '8', phaseLabel: 'FASE 8', entityId: 'alerta_operativa', table: 'alerta_operativa', title: 'Alerta', readFirst: 'Temperatura / demora.', thenRead: 'tarea_cola.', createdBy: 'bodega', indexes: ['PK (id_alerta)'] },
  { order: 31, phaseId: '8', phaseLabel: 'FASE 8', entityId: 'tarea_cola', table: 'tarea_cola', title: 'Tarea cola', readFirst: 'Ingreso / movimiento.', thenRead: 'solicitud_procesamiento.', createdBy: 'bodega', indexes: ['PK (id_tarea)'] },
  { order: 32, phaseId: '8', phaseLabel: 'FASE 8', entityId: 'solicitud_procesamiento', table: 'solicitud_procesamiento', title: 'Procesamiento', readFirst: 'Balance masa.', thenRead: 'registro_merma.', createdBy: 'operador_cuenta', indexes: ['PK (id_solicitud_procesamiento)'] },
  { order: 33, phaseId: '8', phaseLabel: 'FASE 8', entityId: 'registro_merma', table: 'registro_merma', title: 'Merma', readFirst: 'Acumulado kg.', thenRead: 'orden_venta.', createdBy: 'bodega', indexes: ['PK (id_registro)'] },
  { order: 34, phaseId: '9', phaseLabel: 'FASE 9', entityId: 'orden_venta', table: 'orden_venta', title: 'OV', readFirst: 'Estados despacho.', thenRead: 'orden_venta_linea.', createdBy: 'operador_cuenta', indexes: ['PK (id_orden_venta)'] },
  { order: 35, phaseId: '9', phaseLabel: 'FASE 9', entityId: 'orden_venta_linea', table: 'orden_venta_linea', title: 'Línea OV', readFirst: 'cantidad_despachada.', thenRead: 'viaje_transporte.', createdBy: 'operador_cuenta', indexes: ['PK (id_linea_orden_venta)'] },
  { order: 36, phaseId: '9', phaseLabel: 'FASE 9', entityId: 'viaje_transporte', table: 'viaje_transporte', title: 'Viaje TV', readFirst: 'Transportista.', thenRead: 'guia_envio.', createdBy: 'bodega', indexes: ['PK (id_viaje)'] },
  { order: 37, phaseId: '9', phaseLabel: 'FASE 9', entityId: 'guia_envio', table: 'guia_envio', title: 'Guía envío', readFirst: 'Agrupa OV.', thenRead: 'evidencia_transporte.', createdBy: 'bodega', indexes: ['PK (id_guia)'] },
  { order: 38, phaseId: '9', phaseLabel: 'FASE 9', entityId: 'evidencia_transporte', table: 'evidencia_transporte', title: 'Evidencia', readFirst: 'Foto / firma Cloudinary.', thenRead: 'contador.', createdBy: 'transportista', indexes: ['PK (id_evidencia)'] },
  { order: 39, phaseId: '9', phaseLabel: 'FASE 9', entityId: 'contador', table: 'contador', title: 'Contador', readFirst: 'Solo API.', thenRead: 'auditoria_operacion.', createdBy: 'sistema', indexes: ['PK (id_contador)'] },
  { order: 40, phaseId: '9', phaseLabel: 'FASE 9', entityId: 'auditoria_operacion', table: 'auditoria_operacion', title: 'Auditoría', readFirst: 'INSERT solo backend.', thenRead: 'Fin secuencia 40 tablas.', createdBy: 'sistema', indexes: ['PK (id_auditoria)'] },
]

const READING_BY_ENTITY_ID_ACCUM = {}
for (const step of TABLE_READING_SEQUENCE) {
  if (step.entityId.startsWith('_')) continue
  const prev = READING_BY_ENTITY_ID_ACCUM[step.entityId]
  if (!prev || step.order < prev.order) READING_BY_ENTITY_ID_ACCUM[step.entityId] = step
}

export const ENTITY_READING_MAP = READING_BY_ENTITY_ID_ACCUM

export function getReadingStepForEntity(entityId) {
  return ENTITY_READING_MAP[entityId] ?? null
}

export const ONBOARDING_FLOW_ASCII = `
  [configurador TI]
       │
       ├─► empresa ──► usuario (admin_cuenta)
       │                    │
       └─► cuenta ◄─────────┘
              │
              ├─► solicitud_alta_bodega ──► bodega ──► asignacion_bodega
              ├─► solicitud_integracion / tarea_cuenta
              ├─► catálogos (C): proveedor, cliente, producto…
              ├─► compras (C+B): SOL → OC → recepcion_compra
              ├─► inventario (C+B): ubicacion → warehouse_state → movimiento_inventario
              └─► ventas/TV (C+B): OV → viaje → evidencia_transporte
`

export function formatReadingGuideMarkdown() {
  const lines = ['## Orden de lectura — 40 tablas Supabase', '']
  for (const step of TABLE_READING_SEQUENCE) {
    if (step.entityId.startsWith('_')) {
      lines.push(`### ${step.order}. ${step.title} (\`${step.table}\`)`, '', step.readFirst, '')
      continue
    }
    lines.push(
      `### ${step.order}. ${step.title}`,
      `- Tabla: \`${step.table}\``,
      `- Lee primero: ${step.readFirst}`,
      `- Luego: ${step.thenRead}`,
      '',
    )
  }
  return lines.join('\n')
}
