/**
 * Orden de lectura del modelo 3NF — de la tabla 0 a la N.
 * Alineado al flujo: configurador TI → empresa → admin → petición bodega → operación.
 */

/** @typedef {'seed'|'configurador'|'admin_cuenta'|'operador_cuenta'|'bodega'|'sistema'|'externo'} ActorAlta */

/**
 * @typedef {Object} TableReadingStep
 * @property {number} order — Orden global (0, 1, 2…)
 * @property {string} phaseId — Fase narrativa (0–9)
 * @property {string} phaseLabel
 * @property {string} entityId — id en ENTITIES
 * @property {string} table — nombre tabla SQL
 * @property {string} title — nombre legible
 * @property {string} readFirst — qué debes entender antes
 * @property {string} thenRead — qué sigue después
 * @property {ActorAlta} createdBy
 * @property {string[]} indexes — índices recomendados
 */

export const SCHEMA_READING_PHASES = [
  {
    id: '0',
    label: 'FASE 0 — Encabezado: configurador TI (plataforma)',
    actor: 'configurador',
    summary:
      'El configurador es el usuario raíz del proveedor SaaS (Auth + rol configurador). No es una tabla aparte: vive en usuario con codigo_empresa NULL.',
  },
  {
    id: '1',
    label: 'FASE 1 — Empresa y administrador de cuenta',
    actor: 'configurador',
    summary: 'TI crea la empresa cliente y el primer usuario administrador_cuenta vinculado a esa empresa.',
  },
  {
    id: '2',
    label: 'FASE 2 — Tenant operativo (cuenta)',
    actor: 'configurador',
    summary:
      'TI crea el tenant (codeCuenta) bajo la empresa. Catálogos y órdenes operativas cuelgan del tenant, no de la empresa directa.',
  },
  {
    id: '3',
    label: 'FASE 3 — Petición y alta de bodegas (interna / externa)',
    actor: 'admin_cuenta + configurador',
    summary:
      'El administrador de cuenta solicita bodegas (nombre, tipo). TI las crea. El admin se auto-asigna a la bodega creada.',
  },
  {
    id: '4',
    label: 'FASE 4 — Catálogos y operador de cuenta',
    actor: 'administrador_cuenta',
    summary:
      'Admin crea proveedor, comprador, camiones, plantas, clientes, productos y su operador_cuenta. TI puede crear cualquier otro perfil.',
  },
  {
    id: '5',
    label: 'FASE 5 — Equipo de bodega (roles físicos)',
    actor: 'administrador_cuenta · configurador',
    summary:
      'Asignaciones usuario ↔ bodega ↔ rol de bodega (custodio, operario, jefe…). Siempre amarradas a bodegas del tenant.',
  },
  {
    id: '6',
    label: 'FASE 6 — Compras (SOL / OC)',
    actor: 'operador_cuenta · admin_cuenta',
    summary: 'Solicitud de compra, orden de compra y líneas. Recepción en bodega enlaza después con cajas.',
  },
  {
    id: '7',
    label: 'FASE 7 — Bodega en vivo + historial',
    actor: 'roles de bodega',
    summary:
      'warehouse_state (jsonb) para tiempo real; proyección lógica slot/caja/OT; historial para auditoría.',
  },
  {
    id: '8',
    label: 'FASE 8 — Procesamiento y merma',
    actor: 'operador_cuenta · procesador',
    summary: 'Solicitud de procesamiento, balance de masa y registro de merma.',
  },
  {
    id: '9',
    label: 'FASE 9 — Ventas, transporte y sistema',
    actor: 'operador_cuenta · transportista',
    summary: 'OV, viajes TV, evidencias; contadores y auditoría al final.',
  },
]

/** Secuencia maestra: en qué orden leer cada tabla (3NF). */
export const TABLE_READING_SEQUENCE = [
  {
    order: 0,
    phaseId: '0',
    phaseLabel: 'FASE 0',
    entityId: 'rol',
    table: 'rol',
    title: 'Catálogo de roles WMS',
    readFirst: 'Empieza aquí: define los 9 perfiles y niveles (plataforma, cuenta, bodega).',
    thenRead: 'Tabla 1 no existe en SQL — auth.users es externo (Supabase). Luego tabla 2 empresa.',
    createdBy: 'seed',
    indexes: ['PK (id_rol)', 'IX rol_nivel (nivel)'],
  },
  {
    order: 1,
    phaseId: '0',
    phaseLabel: 'FASE 0',
    entityId: '_auth_externo',
    table: 'auth.users',
    title: 'Sesión Supabase Auth (externa)',
    readFirst: 'No está en el ER de negocio; es el login de configurador y de todos los usuarios.',
    thenRead: 'Tabla 2 empresa.',
    createdBy: 'externo',
    indexes: ['PK (id)', 'UNIQUE (email)'],
  },
  {
    order: 2,
    phaseId: '1',
    phaseLabel: 'FASE 1',
    entityId: 'empresa',
    table: 'empresa',
    title: 'Empresa (cliente jurídico SaaS)',
    readFirst: 'Tras entender rol y Auth: el configurador TI crea la empresa.',
    thenRead: 'Tabla 3 usuario (administrador de cuenta de esa empresa).',
    createdBy: 'configurador',
    indexes: ['PK (codigo_empresa)', 'IX empresa_activa (esta_activa) WHERE esta_activa'],
  },
  {
    order: 3,
    phaseId: '1',
    phaseLabel: 'FASE 1',
    entityId: 'usuario',
    table: 'usuario',
    title: 'Usuario — primer admin de cuenta',
    readFirst: 'Lee empresa (2). TI crea administrador_cuenta con codigo_empresa y Auth.',
    thenRead: 'Tabla 4 cuenta (tenant). Luego más usuarios en tabla 12.',
    createdBy: 'configurador',
    indexes: [
      'PK (id_usuario)',
      'UNIQUE (correo)',
      'IX usuario_empresa (codigo_empresa)',
      'IX usuario_cuenta (codigo_cuenta)',
      'IX usuario_rol (id_rol)',
    ],
  },
  {
    order: 4,
    phaseId: '2',
    phaseLabel: 'FASE 2',
    entityId: 'cuenta',
    table: 'cuenta',
    title: 'Tenant operativo (cuenta)',
    readFirst: 'Empresa (2) + admin (3). TI crea codeCuenta bajo codigo_empresa.',
    thenRead: 'Tabla 5 solicitud_alta_bodega.',
    createdBy: 'configurador',
    indexes: ['PK (codigo_cuenta)', 'IX cuenta_empresa (codigo_empresa)', 'IX cuenta_activa (esta_activa)'],
  },
  {
    order: 5,
    phaseId: '3',
    phaseLabel: 'FASE 3',
    entityId: 'solicitud_alta_bodega',
    table: 'solicitud_alta_bodega',
    title: 'Petición de alta de bodega',
    readFirst: 'Admin de cuenta pide bodega interna/externa con nombre personalizado.',
    thenRead: 'Tabla 6 bodega (TI atiende la petición y crea la fila).',
    createdBy: 'admin_cuenta',
    indexes: [
      'PK (id_solicitud)',
      'IX sol_bodega_tenant (codigo_cuenta, estado)',
      'IX sol_bodega_pendiente (estado) WHERE estado = pendiente',
    ],
  },
  {
    order: 6,
    phaseId: '3',
    phaseLabel: 'FASE 3',
    entityId: 'bodega',
    table: 'bodega',
    title: 'Bodega (interna o externa)',
    readFirst: 'Petición (5) o alta directa por TI. Vincula codigo_cuenta y tipo interna/externa.',
    thenRead: 'Tabla 7 asignacion_bodega (admin se asigna).',
    createdBy: 'configurador',
    indexes: [
      'PK (id_bodega)',
      'IX bodega_tenant (codigo_cuenta)',
      'IX bodega_tipo (tipo)',
      'IX bodega_solicitud (id_solicitud) UNIQUE nullable',
    ],
  },
  {
    order: 7,
    phaseId: '3',
    phaseLabel: 'FASE 3',
    entityId: 'asignacion_bodega',
    table: 'asignacion_bodega',
    title: 'Asignación usuario ↔ bodega',
    readFirst: 'Bodega (6) creada. El admin de cuenta se asigna (y asigna equipo después).',
    thenRead: 'Tablas 8–11 catálogos.',
    createdBy: 'admin_cuenta',
    indexes: [
      'PK (id_asignacion)',
      'UNIQUE (id_usuario, id_bodega, id_rol)',
      'IX asig_bodega (id_bodega)',
      'IX asig_usuario (id_usuario)',
    ],
  },
  {
    order: 8,
    phaseId: '4',
    phaseLabel: 'FASE 4',
    entityId: 'proveedor',
    table: 'proveedor',
    title: 'Proveedor',
    readFirst: 'Tenant (4) activo. Admin de cuenta da de alta proveedores.',
    thenRead: 'Tabla 9 comprador, 10 camion, 11 planta.',
    createdBy: 'admin_cuenta',
    indexes: ['PK (id_proveedor)', 'IX proveedor_tenant (codigo_cuenta)'],
  },
  {
    order: 9,
    phaseId: '4',
    phaseLabel: 'FASE 4',
    entityId: 'comprador',
    table: 'comprador',
    title: 'Comprador (destino OV)',
    readFirst: 'Mismo scope tenant (4).',
    thenRead: 'Tabla 10 camion.',
    createdBy: 'admin_cuenta',
    indexes: ['PK (id_comprador)', 'IX comprador_tenant (codigo_cuenta)'],
  },
  {
    order: 10,
    phaseId: '4',
    phaseLabel: 'FASE 4',
    entityId: 'camion',
    table: 'camion',
    title: 'Camión / flota',
    readFirst: 'Catálogos del admin.',
    thenRead: 'Tabla 11 planta, luego 12 cliente.',
    createdBy: 'admin_cuenta',
    indexes: ['PK (id_camion)', 'IX camion_tenant (codigo_cuenta)'],
  },
  {
    order: 11,
    phaseId: '4',
    phaseLabel: 'FASE 4',
    entityId: 'planta',
    table: 'planta',
    title: 'Planta destino',
    readFirst: 'Catálogos del admin.',
    thenRead: 'Tabla 12 cliente.',
    createdBy: 'admin_cuenta',
    indexes: ['PK (id_planta)', 'IX planta_tenant (codigo_cuenta)'],
  },
  {
    order: 12,
    phaseId: '4',
    phaseLabel: 'FASE 4',
    entityId: 'cliente',
    table: 'cliente',
    title: 'Cliente comercial (dueño de SKU)',
    readFirst: 'Tenant (4). Necesario antes de producto.',
    thenRead: 'Tabla 13 producto; tabla 14 operador_cuenta (otros usuarios).',
    createdBy: 'admin_cuenta',
    indexes: ['PK (id_cliente)', 'IX cliente_tenant (codigo_cuenta)'],
  },
  {
    order: 13,
    phaseId: '4',
    phaseLabel: 'FASE 4',
    entityId: 'producto',
    table: 'producto',
    title: 'Producto (SKU)',
    readFirst: 'Cliente (12) + tenant (4).',
    thenRead: 'Tabla 14 más usuarios; FASE 5 reusa asignacion_bodega (7).',
    createdBy: 'admin_cuenta',
    indexes: ['PK (id_producto)', 'IX producto_tenant (codigo_cuenta)', 'IX producto_cliente (id_cliente)'],
  },
  {
    order: 14,
    phaseId: '4',
    phaseLabel: 'FASE 4 / 5',
    entityId: 'usuario',
    table: 'usuario',
    title: 'Resto de usuarios (operador, bodega, TI adicionales)',
    readFirst:
      'Misma tabla 3: operador_cuenta lo crea admin; custodio/operario/etc. vía asignacion (7). TI puede crear cualquier rol.',
    thenRead: 'FASE 6: solicitud_compra (15).',
    createdBy: 'admin_cuenta',
    indexes: ['Ver orden 3 — mismos índices'],
  },
  {
    order: 15,
    phaseId: '6',
    phaseLabel: 'FASE 6',
    entityId: 'solicitud_compra',
    table: 'solicitud_compra',
    title: 'Solicitud de compra (SOL)',
    readFirst: 'Catálogos y usuarios de cuenta listos.',
    thenRead: 'Tabla 16 orden_compra.',
    createdBy: 'operador_cuenta',
    indexes: ['PK (id_solicitud_compra)', 'IX sol_compra_tenant (codigo_cuenta)'],
  },
  {
    order: 16,
    phaseId: '6',
    phaseLabel: 'FASE 6',
    entityId: 'orden_compra',
    table: 'orden_compra',
    title: 'Orden de compra (OC)',
    readFirst: 'Proveedor (8) + bodega destino (6).',
    thenRead: 'Tabla 17 linea_orden_compra.',
    createdBy: 'operador_cuenta',
    indexes: [
      'PK (id_orden_compra)',
      'IX oc_tenant (codigo_cuenta)',
      'IX oc_bodega (id_bodega_destino)',
      'IX oc_estado (estado)',
    ],
  },
  {
    order: 17,
    phaseId: '6',
    phaseLabel: 'FASE 6',
    entityId: 'linea_orden_compra',
    table: 'linea_orden_compra',
    title: 'Líneas de OC',
    readFirst: 'OC (16) + producto (13).',
    thenRead: 'FASE 7 warehouse_state (18).',
    createdBy: 'operador_cuenta',
    indexes: ['PK (id_orden_compra, id_linea)', 'IX loc_producto (id_producto)'],
  },
  {
    order: 18,
    phaseId: '7',
    phaseLabel: 'FASE 7',
    entityId: 'estado_bodega',
    table: 'warehouse_state',
    title: 'Estado en vivo (jsonb)',
    readFirst: 'Bodega (6) con equipo asignado. Una fila por bodega; Realtime.',
    thenRead: 'Tablas 19–22 proyección lógica (opcional en SQL).',
    createdBy: 'sistema',
    indexes: ['PK (id_bodega)', 'GIN (estado_json) opcional'],
  },
  {
    order: 19,
    phaseId: '7',
    phaseLabel: 'FASE 7 · proyección',
    entityId: 'slot',
    table: 'slot',
    title: 'Slot (vista lógica / desnormalización)',
    readFirst: 'warehouse_state (18).',
    thenRead: 'Tabla 20 caja.',
    createdBy: 'sistema',
    indexes: ['PK (id_bodega, id_slot) si se normaliza a tabla'],
  },
  {
    order: 20,
    phaseId: '7',
    phaseLabel: 'FASE 7 · proyección',
    entityId: 'caja',
    table: 'caja',
    title: 'Caja / lote',
    readFirst: 'Slots (19) + OC (16–17).',
    thenRead: 'Tabla 21 orden_trabajo.',
    createdBy: 'bodega',
    indexes: ['PK (id_caja)', 'IX caja_bodega (id_bodega)', 'IX caja_zona (zona)'],
  },
  {
    order: 21,
    phaseId: '7',
    phaseLabel: 'FASE 7 · proyección',
    entityId: 'orden_trabajo',
    table: 'orden_trabajo',
    title: 'Orden de trabajo',
    readFirst: 'Cajas (20).',
    thenRead: 'Tabla 22 alerta; 23 historial.',
    createdBy: 'bodega',
    indexes: ['PK (id_orden_trabajo)', 'IX ot_bodega_estado (id_bodega, estado)'],
  },
  {
    order: 22,
    phaseId: '7',
    phaseLabel: 'FASE 7 · proyección',
    entityId: 'alerta',
    table: 'alerta',
    title: 'Alerta operativa',
    readFirst: 'Mapa en vivo (18–21).',
    thenRead: 'Tabla 23 historial_movimiento.',
    createdBy: 'bodega',
    indexes: ['PK (id_alerta)', 'IX alerta_bodega_abierta (id_bodega) WHERE motivo_cierre IS NULL'],
  },
  {
    order: 23,
    phaseId: '7',
    phaseLabel: 'FASE 7',
    entityId: 'historial_movimiento',
    table: 'historial_movimiento',
    title: 'Historial de movimientos',
    readFirst: 'Operación en bodega en marcha.',
    thenRead: 'FASE 8 procesamiento (24).',
    createdBy: 'sistema',
    indexes: ['PK (id_movimiento)', 'IX hist_bodega_fecha (id_bodega, creado_en DESC)'],
  },
  {
    order: 24,
    phaseId: '8',
    phaseLabel: 'FASE 8',
    entityId: 'solicitud_procesamiento',
    table: 'solicitud_procesamiento',
    title: 'Solicitud de procesamiento',
    readFirst: 'Producto (13) + bodega (6).',
    thenRead: 'Tabla 25 registro_merma.',
    createdBy: 'operador_cuenta',
    indexes: ['PK (id_solicitud)', 'IX sol_proc_bodega (id_bodega, estado)'],
  },
  {
    order: 25,
    phaseId: '8',
    phaseLabel: 'FASE 8',
    entityId: 'registro_merma',
    table: 'registro_merma',
    title: 'Registro de merma',
    readFirst: 'Solicitud procesamiento (24).',
    thenRead: 'FASE 9 orden_venta (26).',
    createdBy: 'bodega',
    indexes: ['PK (id_registro)', 'IX merma_bodega_periodo (id_bodega, periodo)'],
  },
  {
    order: 26,
    phaseId: '9',
    phaseLabel: 'FASE 9',
    entityId: 'orden_venta',
    table: 'orden_venta',
    title: 'Orden de venta (OV)',
    readFirst: 'Comprador (9) + bodega origen (6).',
    thenRead: 'Tabla 27 linea_orden_venta.',
    createdBy: 'operador_cuenta',
    indexes: ['PK (id_orden_venta)', 'IX ov_tenant (codigo_cuenta)', 'IX ov_estado (estado)'],
  },
  {
    order: 27,
    phaseId: '9',
    phaseLabel: 'FASE 9',
    entityId: 'linea_orden_venta',
    table: 'linea_orden_venta',
    title: 'Líneas de OV',
    readFirst: 'OV (26).',
    thenRead: 'Tabla 28 viaje_transporte.',
    createdBy: 'operador_cuenta',
    indexes: ['PK (id_orden_venta, id_linea)'],
  },
  {
    order: 28,
    phaseId: '9',
    phaseLabel: 'FASE 9',
    entityId: 'viaje_transporte',
    table: 'viaje_transporte',
    title: 'Viaje TV',
    readFirst: 'OV (26–27) + camion (10).',
    thenRead: 'Tabla 29 evidencia_entrega.',
    createdBy: 'bodega',
    indexes: ['PK (id_viaje)', 'UNIQUE (numero_documento)', 'IX viaje_ov (id_orden_venta)'],
  },
  {
    order: 29,
    phaseId: '9',
    phaseLabel: 'FASE 9',
    entityId: 'evidencia_entrega',
    table: 'evidencia_entrega',
    title: 'Evidencia de entrega',
    readFirst: 'Viaje (28).',
    thenRead: 'Tabla 30 contador_documento.',
    createdBy: 'transportista',
    indexes: ['PK (id_evidencia)', 'IX evidencia_viaje (id_viaje)'],
  },
  {
    order: 30,
    phaseId: '9',
    phaseLabel: 'FASE 9',
    entityId: 'contador_documento',
    table: 'contador_documento',
    title: 'Contador TV / documentos',
    readFirst: 'Al implementar numeración automática de viajes.',
    thenRead: 'Tabla 31 auditoria.',
    createdBy: 'sistema',
    indexes: ['PK (nombre_contador)'],
  },
  {
    order: 31,
    phaseId: '9',
    phaseLabel: 'FASE 9',
    entityId: 'auditoria',
    table: 'auditoria',
    title: 'Auditoría',
    readFirst: 'Cuando todo lo anterior está claro.',
    thenRead: 'Fin de la secuencia — repasa FASE 0–9 en diagrama ER onboarding.',
    createdBy: 'sistema',
    indexes: ['PK (id_evento)', 'IX audit_usuario_fecha (id_usuario, creado_en DESC)'],
  },
]

/** Primera aparición por entityId (menor order gana). */
const READING_BY_ENTITY_ID_ACCUM = {}
for (const step of TABLE_READING_SEQUENCE) {
  if (step.entityId.startsWith('_')) continue
  const prev = READING_BY_ENTITY_ID_ACCUM[step.entityId]
  if (!prev || step.order < prev.order) READING_BY_ENTITY_ID_ACCUM[step.entityId] = step
}

export const ENTITY_READING_MAP = { ...READING_BY_ENTITY_ID_ACCUM }

export function getReadingStepForEntity(entityId) {
  return ENTITY_READING_MAP[entityId] ?? null
}

export function getReadingStepsForPhase(phaseId) {
  return TABLE_READING_SEQUENCE.filter((s) => s.phaseId === phaseId)
}

export function formatReadingGuideMarkdown() {
  const lines = [
    '# Guía de lectura del modelo 3NF — Bodega de Frío',
    '',
    'Lee las tablas en este orden. Cada número es una parada obligatoria antes de implementar Postgres.',
    '',
  ]
  for (const phase of SCHEMA_READING_PHASES) {
    lines.push(`## ${phase.label}`, '', phase.summary, '')
    const steps = getReadingStepsForPhase(phase.id)
    for (const s of steps) {
      if (s.entityId.startsWith('_')) {
        lines.push(`### Tabla ${s.order} — ${s.title}`, `- ${s.readFirst}`, '')
        continue
      }
      lines.push(
        `### Tabla ${s.order} — \`${s.table}\` (${s.title})`,
        `- **Quién la crea:** ${s.createdBy}`,
        `- **Lee antes:** ${s.readFirst}`,
        `- **Después sigue:** ${s.thenRead}`,
        `- **Índices:** ${s.indexes.join('; ')}`,
        '',
      )
    }
  }
  lines.push('## Onboarding completo (todas las tablas enlazadas)', '')
  lines.push('```', ONBOARDING_FLOW_ASCII, '```')
  return lines.join('\n')
}

export const ONBOARDING_FLOW_ASCII = `configurador TI (usuario, rol=configurador)
  │
  ├─[1]─► empresa (codigo_empresa)
  │         │
  │         ├─[3]─► usuario (administrador_cuenta, codigo_empresa)
  │         │
  │         └─[4]─► cuenta / tenant (codigo_cuenta)
  │                   │
  │                   ├─[5]─► solicitud_alta_bodega ◄── admin pide bodega
  │                   │         │
  │                   │         └─[6]─► bodega (TI crea, interna|externa)
  │                   │                   │
  │                   │                   └─[7]─► asignacion_bodega ◄── admin se asigna
  │                   │
  │                   ├─[8-13]─► proveedor, comprador, camion, planta, cliente, producto
  │                   ├─[14]─► más usuarios (operador_cuenta, roles bodega…)
  │                   ├─[15-17]─► SOL, OC, líneas
  │                   ├─[18-23]─► warehouse_state + operación + historial
  │                   ├─[24-25]─► procesamiento, merma
  │                   └─[26-31]─► OV, TV, evidencia, contadores, auditoría`
