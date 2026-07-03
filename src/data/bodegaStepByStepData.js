/**
 * Recorrido interactivo «Paso a paso» — Polaria WMS (id URL bodega-frio).
 * Roles alineados con wmsRoles.js y modelo ER 3NF (40 modelos Prisma).
 */

import { formatRoleLabel } from './wmsRoles.js'

export const BODEGA_STEP_CHAPTERS = [
  { id: 'intro', label: 'Inicio', color: 'from-cyan-400/20 to-sky-500/10' },
  { id: 'owner', label: 'Configurador (TI)', color: 'from-violet-400/20 to-indigo-500/10' },
  { id: 'tenant', label: 'Cuenta cliente', color: 'from-sky-400/20 to-cyan-500/10' },
  { id: 'inbound', label: 'Recepción', color: 'from-emerald-400/15 to-teal-500/10' },
  { id: 'warehouse', label: 'Bodega', color: 'from-blue-400/20 to-indigo-500/10' },
  { id: 'process', label: 'Procesamiento', color: 'from-amber-400/15 to-orange-500/10' },
  { id: 'outbound', label: 'Despacho', color: 'from-rose-400/15 to-pink-500/10' },
  { id: 'finale', label: 'Cierre', color: 'from-emerald-400/25 to-cyan-500/15' },
]

/** @typedef {'ice'|'snow'|'cloud'|'crystal'|'aurora'} StepVisual */
/** @typedef {'intro'|'branch'|'temp'|'slots'|'balance'|'roles'|'evidence'|'chain'|'checklist'|'fefo'|'celebrate'} InteractiveType */

/**
 * @type {Array<{
 *   id: string
 *   chapter: string
 *   title: string
 *   hook: string
 *   narrative: string
 *   roles: string[]
 *   visual: StepVisual
 *   flowRefs?: string[]
 *   funFact?: string
 *   interactive: { type: InteractiveType, [key: string]: unknown }
 * }>}
 */
export const bodegaStepByStepSteps = [
  {
    id: 'welcome',
    chapter: 'intro',
    title: 'Bienvenido a Polaria WMS',
    hook: 'Recorrido completo: del configurador TI al transportista con evidencias.',
    narrative:
      'Polaria WMS (antes «Bodega de Frío» en el Dev Hub) documenta diseño V2 + estado real jun 2026. El equipo TI crea empresa, tenant y bodegas vía API; el administrador de cuenta arma operador, catálogos e integraciones. Luego recepción, mapa y despacho (🔵 donde aún no hay API). Usa ← → o los botones.',
    roles: ['Todos los roles'],
    visual: 'aurora',
    interactive: { type: 'intro' },
  },
  {
    id: 'dual-world',
    chapter: 'intro',
    title: 'Plataforma TI, empresa y tenant',
    hook: 'Empresa ≠ tenant: el tenant es la unidad operativa bajo la empresa.',
    narrative:
      'El equipo TI tiene credenciales propias (configurador). Crea la empresa, asigna el administrador de cuenta y luego tenant y bodegas. Al ingresar, cualquier usuario de empresa pasa por POST /auth/prelogin (empresa + usuario) y luego contraseña; SSO Mateo opcional.',
    roles: [formatRoleLabel('configurador'), formatRoleLabel('administrador_cuenta')],
    visual: 'cloud',
    flowRefs: ['hdr_dueno', 'hdr_inqu'],
    interactive: {
      type: 'roles',
      cards: [
        {
          id: 'ti',
          label: 'Configurador (TI)',
          desc: 'Sesión TI → empresa → admin cuenta → tenant → bodegas',
          icon: 'building',
        },
        {
          id: 'empresa',
          label: 'Tenant operativo',
          desc: 'Operador, catálogos, proveedores y equipo de bodega',
          icon: 'cube',
        },
      ],
    },
  },
  {
    id: 'config-empresa',
    chapter: 'owner',
    title: 'Configurador crea la empresa',
    hook: 'Cliente jurídico del SaaS — puede tener varios tenants.',
    narrative:
      'Primero se registra la empresa (codigoEmpresa, razón social, contrato). Es el nivel “holding” o cliente comercial: agrupa tenants pero no opera inventario por sí sola.',
    roles: [formatRoleLabel('configurador')],
    visual: 'crystal',
    flowRefs: ['config'],
    interactive: {
      type: 'chain',
      steps: ['Alta empresa en plataforma', 'Estado activa', 'Lista para dar de alta tenants'],
    },
  },
  {
    id: 'config-tenant',
    chapter: 'owner',
    title: 'Alta del tenant (codeCuenta)',
    hook: 'Cada tenant pertenece a una empresa.',
    narrative:
      'El configurador crea el tenant operativo (codeCuenta) con FK a codigo_empresa. Bodegas y usuarios del tenant usan ese codeCuenta; catálogos y órdenes los crea después el administrador de cuenta. Si el tenant es inválido o suspendido, el flujo se detiene.',
    roles: [formatRoleLabel('configurador')],
    visual: 'crystal',
    flowRefs: ['tenant_alta', 'v_tenant'],
    interactive: {
      type: 'branch',
      question: '¿El tenant pasa validación?',
      yesLabel: 'S — Tenant activo',
      noLabel: 'N — ID inválido / suspensión',
      yesOutcome: 'Avanzas a bodegas, capacidad y reglas del plano (tenant activo).',
      noOutcome: 'Bloqueo err_t: tenant inválido o suspendido.',
      yesNext: 'estructura',
      noNext: 'blocked-hint',
    },
  },
  {
    id: 'estructura',
    chapter: 'owner',
    title: 'Bodegas vía API y capacidad',
    hook: 'POST /configuracion/bodegas — no insert directo en Supabase desde el browser.',
    narrative:
      'El configurador o administrador de cuenta crea bodegas internas con POST /configuracion/bodegas (bypass RLS en API). Bootstrap de layout con POST …/bootstrap-layout. Las integraciones externas las solicita el operador (POST /integracion/solicitudes) y las ve el configurador en /configurador/integracion. Cada bodega define slots, umbrales y kg; si la capacidad supera el plano, hay que ajustar.',
    roles: [formatRoleLabel('configurador'), formatRoleLabel('administrador_bodega')],
    visual: 'ice',
    flowRefs: ['estructura', 'v_cap'],
    funFact: 'En V2 el dashboard dejó de ser 12 posiciones fijas: ahora es dinámico por rol.',
    interactive: {
      type: 'branch',
      question: '¿Capacidad física < límite del plano?',
      yesLabel: 'S — Cabe en el plano',
      noLabel: 'N — Espacio insuficiente',
      yesOutcome: 'Siguiente: TI crea y asigna al administrador de cuenta (responsable del cliente).',
      noOutcome: 'err_c: debes redimensionar slots o subir el límite contratado.',
    },
  },
  {
    id: 'ti-admin',
    chapter: 'owner',
    title: 'TI asigna administrador de cuenta',
    hook: 'Responsable del cliente — no crea la empresa ni las bodegas después.',
    narrative:
      'Tras crear la empresa, TI da de alta al administrador_cuenta con codigo_empresa y credenciales Auth. Ese admin ingresará con login V2 (empresa + usuario + contraseña). Luego TI completa tenant y bodegas antes de entregar operación.',
    roles: [formatRoleLabel('configurador')],
    visual: 'crystal',
    flowRefs: ['ti_admin', 'sub_doc_auth'],
    interactive: {
      type: 'chain',
      steps: [
        'Alta en Auth + rol administrador_cuenta',
        'codigo_cuenta = codeCuenta del tenant',
        'Entrega de credenciales al cliente',
      ],
    },
  },
  {
    id: 'rbac',
    chapter: 'tenant',
    title: 'Admin arma equipo y permisos',
    hook: 'Cada rol ve solo su cola — ni más ni menos.',
    narrative:
      'El administrador de cuenta crea operador de cuenta, proveedores, compradores y asignacion_bodega (jefe, custodio, operario, procesador, transportista). Sin permiso en una acción: acceso denegado.',
    roles: [formatRoleLabel('administrador_cuenta'), 'Equipo de bodega'],
    visual: 'snow',
    flowRefs: ['v_perm', 'adm_cuenta'],
    interactive: {
      type: 'branch',
      question: '¿El usuario tiene permiso para esta acción?',
      yesLabel: 'S — Atribución OK',
      noLabel: 'N — Sin permisos',
      yesOutcome: 'Tenant listo: SOL, OC, recepción y operación diaria.',
      noOutcome: 'err_p: acceso denegado; revisar asignacion_bodega y matriz RBAC.',
    },
  },
  {
    id: 'admin-cuenta',
    chapter: 'tenant',
    title: 'Administrador de cuenta',
    hook: 'El configurador deja el tenant listo; el admin opera dentro de él.',
    narrative:
      'Tras el bridge INQUILINO, el administrador_cuenta (del tenant activo) da de alta operador_cuenta, catálogos y asignacion_bodega. Todo queda scoped al codeCuenta del tenant — la empresa solo agrupa tenants.',
    roles: [formatRoleLabel('administrador_cuenta')],
    visual: 'cloud',
    flowRefs: ['adm_cuenta', 'catalogo'],
    interactive: {
      type: 'chain',
      steps: [
        'Operador de cuenta',
        'Catálogos comerciales',
        'asignacion_bodega por bodega',
      ],
    },
  },
  {
    id: 'solicitud-compra',
    chapter: 'tenant',
    title: 'Solicitud de compra (SOL)',
    hook: 'Aprobación antes de la OC formal.',
    narrative:
      'El operador_cuenta crea la SOL (Borrador → Enviada). Si el administrador la aprueba, se genera orden_compra con id_orden_compra vinculado. Si rechazan, no hay recepción.',
    roles: [formatRoleLabel('operador_cuenta'), formatRoleLabel('administrador_cuenta')],
    visual: 'ice',
    flowRefs: ['sol', 'oc'],
    interactive: {
      type: 'branch',
      question: '¿SOL aprobada?',
      yesLabel: 'S — Genera OC',
      noLabel: 'N — Rechazada',
      yesOutcome: 'OC en estado Iniciado → recepción en bodega.',
      noOutcome: 'Sin OC: el flujo de ingreso no arranca.',
    },
  },
  {
    id: 'strip-oc',
    chapter: 'tenant',
    title: 'Strip + Orden de compra',
    hook: 'Limpia nulls antes de tocar inventario real.',
    narrative:
      'La función Strip elimina undefined/null en payloads hacia Supabase (PostgreSQL). Luego la cuenta genera OC (orden de compra) o SOL (solicitud previa). Estados: Iniciado → En recepción → Cerrado. Prefijo OC-####.',
    roles: [formatRoleLabel('administrador_cuenta'), formatRoleLabel('operador_cuenta')],
    visual: 'cloud',
    flowRefs: ['strip', 'sol', 'oc'],
    interactive: {
      type: 'chain',
      steps: ['Strip sanitiza JSON', 'OC o SOL con líneas en kg', 'Proveedor recibe pedido'],
    },
  },
  {
    id: 'proveedor',
    chapter: 'tenant',
    title: 'Proveedor y despacho',
    hook: 'Un proveedor bloqueado frena toda la cadena.',
    narrative:
      'Antes de agendar el camión se valida que el proveedor esté activo en catálogo. Integraciones externas (bodegas Fridem, etc.) tienen su propio sub-flujo de solicitud de asignación.',
    roles: [formatRoleLabel('operador_cuenta'), formatRoleLabel('transportista')],
    visual: 'ice',
    flowRefs: ['v_prov', 'prov'],
    interactive: {
      type: 'branch',
      question: '¿Proveedor activo en catálogo?',
      yesLabel: 'S — Despacha mercancía',
      noLabel: 'N — Proveedor bloqueado',
      yesOutcome: 'Transporte hacia bodega (TV pendiente del lado compra).',
      noOutcome: 'Alerta operativa; no se agenda ingreso hasta desbloquear.',
    },
  },
  {
    id: 'transporte-in',
    chapter: 'inbound',
    title: 'Transporte hacia la bodega',
    hook: 'El camión va cargado de expectativas y kg.',
    narrative:
      'Registro del viaje de entrada, ETA y vínculo a la OC. El custodio prepara la recepción: conciliación ciega en V2 (conteo sin ver cantidades esperadas) para evitar sesgo.',
    roles: [formatRoleLabel('transportista'), formatRoleLabel('custodio')],
    visual: 'snow',
    flowRefs: ['trans1', 'recp'],
    interactive: {
      type: 'chain',
      steps: ['Camión en ruta', 'Llegada a muelle', 'Custodio abre recepción'],
    },
  },
  {
    id: 'conteo-ciego',
    chapter: 'inbound',
    title: 'Conteo ciego vs OC',
    hook: '¿Coincide lo que pesaste con lo que pediste?',
    narrative:
      'Input manual de kg por línea. Si no coincide: registrar diferencia o nota de ajuste y volver a validar (línea discontinua en el diagrama). Si coincide: pasar a verificación documental.',
    roles: [formatRoleLabel('custodio'), formatRoleLabel('jefe_bodega')],
    visual: 'crystal',
    flowRefs: ['ciego', 'val_ciego', 'inc_recp'],
    interactive: {
      type: 'branch',
      question: '¿El conteo ciego coincide con la OC?',
      yesLabel: 'S — Match perfecto',
      noLabel: 'N — Diferencia detectada',
      yesOutcome: 'Flujo a documentos y temperatura.',
      noOutcome: 'inc_recp → reintento val_ciego hasta conciliar o escalar.',
    },
  },
  {
    id: 'documentos',
    chapter: 'inbound',
    title: 'Documentos y papelería',
    hook: 'Sin guías válidas no hay mercancía en sistema.',
    narrative:
      'Guías, certificados sanitarios y referencias de lote. Papelería incompleta = bloqueo err_doc. Solo con documentos OK se evalúa temperatura de ingreso.',
    roles: [formatRoleLabel('custodio')],
    visual: 'cloud',
    flowRefs: ['v_doc', 'v_doc_ok', 'err_doc'],
    interactive: {
      type: 'checklist',
      items: [
        { id: 'guia', label: 'Guía de despacho', required: true },
        { id: 'sanitario', label: 'Certificado sanitario', required: true },
        { id: 'lote', label: 'Trazabilidad de lote', required: true },
      ],
    },
  },
  {
    id: 'temperatura-ingreso',
    chapter: 'inbound',
    title: 'Temperatura en muelle',
    hook: 'Sensores + override del jefe con firma.',
    narrative:
      'Si la temperatura está fuera de rango, el jefe puede autorizar con motivo y firma digital. Sin justificación válida: RECHAZO TOTAL + log de incidente. Si está OK: inspección física.',
    roles: [formatRoleLabel('custodio'), formatRoleLabel('jefe_bodega')],
    visual: 'ice',
    flowRefs: ['v_temp1', 'override', 'motivo', 'rechazo'],
    interactive: { type: 'temp', min: -30, max: 8, threshold: 4, unit: '°C' },
  },
  {
    id: 'inspeccion',
    chapter: 'inbound',
    title: 'Inspección física',
    hook: 'Daño visible → cuarentena, no al mapa.',
    narrative:
      'Estado físico de cajas y empaque. Si falla: cuarentena (inc_cal) y vuelta a inspección tras resolver. Si OK: las cajas pasan a inboundBoxes[] — existen en sistema pero aún no ocupan slots.',
    roles: [formatRoleLabel('custodio'), formatRoleLabel('operario')],
    visual: 'snow',
    flowRefs: ['insp', 'v_cal', 'inc_cal', 'ingreso'],
    interactive: {
      type: 'branch',
      question: '¿Estado físico de la mercancía OK?',
      yesLabel: 'S — Aprobada',
      noLabel: 'N — Daño / cuarentena',
      yesOutcome: 'Guardar en inboundBoxes (zona de entrada).',
      noOutcome: 'Cuarentena + alerta; loop hasta liberar o rechazar.',
    },
  },
  {
    id: 'inbound-boxes',
    chapter: 'warehouse',
    title: 'Zona de entrada (inboundBoxes)',
    hook: 'La mercancía “existe” pero aún no tiene casa.',
    narrative:
      'Cada caja lleva temperatura, peso, cliente comercial y vínculos al catálogo. El jefe o custodio crea órdenes de trabajo tipo a_bodega para moverlas al mapa principal.',
    roles: [
      formatRoleLabel('custodio'),
      formatRoleLabel('jefe_bodega'),
      formatRoleLabel('operario'),
    ],
    visual: 'aurora',
    flowRefs: ['ingreso', 'asignar'],
    funFact: 'inboundBoxes y outboundBoxes son arrays en el estado operativo de bodega en Supabase (PostgreSQL).',
    interactive: {
      type: 'slots',
      mode: 'inbound',
      slots: 6,
      label: 'Toca las cajas para registrarlas en zona de entrada',
    },
  },
  {
    id: 'locking',
    chapter: 'warehouse',
    title: 'Locking en tiempo real',
    hook: 'Dos operarios no pueden reservar el mismo slot.',
    narrative:
      'Al asignar ubicación se intenta reservar el slot. Si ya está reservado: sugerir adyacente y reintentar (línea punteada). Lock exitoso → ubicación física → liberar lock → estado Ocupado.',
    roles: [formatRoleLabel('operario'), formatRoleLabel('jefe_bodega')],
    visual: 'crystal',
    flowRefs: ['locking', 'lock', 'v_lock', 'almacen', 'unlock'],
    interactive: {
      type: 'slots',
      mode: 'map',
      slots: 12,
      lockedIndex: 4,
      label: 'Reserva un slot libre — el #5 está bloqueado por otro operario',
    },
  },
  {
    id: 'monitor-alertas',
    chapter: 'warehouse',
    title: 'Sensores y alertas',
    hook: 'Temperatura fuera de rango despierta al jefe.',
    narrative:
      'Monitor lee sensores por slot. Fuera de rango → alerta crítica. SLA: si no hay intervención en X minutos, escalar a gerencia (alerta roja). Cerrar alerta exige motivo y operario asignado.',
    roles: [
      formatRoleLabel('jefe_bodega'),
      formatRoleLabel('administrador_bodega'),
      formatRoleLabel('operario'),
    ],
    visual: 'ice',
    flowRefs: ['monitor', 'v_rango', 'alerta', 'sla', 'escalar'],
    interactive: {
      type: 'branch',
      question: '¿Hubo intervención antes del SLA?',
      yesLabel: 'S — Alerta atendida',
      noLabel: 'N — SLA vencido',
      yesOutcome: 'Registro en historial + vuelta al monitoreo cíclico.',
      noOutcome: 'Escalar a gerencia — alerta roja visible para todos los admins.',
    },
  },
  {
    id: 'procesamiento',
    chapter: 'process',
    title: 'Transformación y balance de masa',
    hook: 'Primario → secundario + merma + sobrante.',
    narrative:
      'Solicitud de procesamiento: validar materia prima lista (si no: esperar descongelación en loop). Zona limpia OK → ejecutar. La suma de pesos debe cuadrar; merma injustificada bloquea con auditoría.',
    roles: [
      formatRoleLabel('procesador'),
      formatRoleLabel('jefe_bodega'),
      formatRoleLabel('operador_cuenta'),
    ],
    visual: 'snow',
    flowRefs: ['sol_proc', 'ejec_proc', 'balance', 'v_merma', 'bloq_p'],
    interactive: {
      type: 'balance',
      inputKg: 100,
      outputs: [
        { id: 'sec', label: 'Secundario', kg: 72 },
        { id: 'mer', label: 'Merma', kg: 18 },
        { id: 'sob', label: 'Sobrante', kg: 8 },
      ],
    },
  },
  {
    id: 'orden-venta',
    chapter: 'outbound',
    title: 'Orden de venta y FEFO',
    hook: 'Primero vence, primero sale.',
    narrative:
      'OV con líneas hacia comprador. Sin stock: notificar faltante. Con stock: FEFO por fecha de vencimiento, picking y reserva de slots. Prefijo VE-####.',
    roles: [
      formatRoleLabel('administrador_cuenta'),
      formatRoleLabel('operador_cuenta'),
      formatRoleLabel('operario'),
    ],
    visual: 'cloud',
    flowRefs: ['sol_venta', 'valid_stock', 'fefo', 'picking'],
    interactive: {
      type: 'fefo',
      lots: [
        { id: 'a', label: 'Lote A', days: 3 },
        { id: 'b', label: 'Lote B', days: 12 },
        { id: 'c', label: 'Lote C', days: 7 },
      ],
    },
  },
  {
    id: 'salida-cruzada',
    chapter: 'outbound',
    title: 'Salida cruzada (peso camión)',
    hook: '¿Lo que pesó el camión = lo que salió del picking?',
    narrative:
      'Validación de peso en muelle de salida. Diferencia → bloqueo alerta_s y revisión de zona de picking (reintento). Temp del camión fuera de rango → cambiar vehículo o alerta.',
    roles: [formatRoleLabel('custodio'), formatRoleLabel('transportista')],
    visual: 'crystal',
    flowRefs: ['salida_cruzada', 'v_temp2', 'bloqueo_d'],
    interactive: {
      type: 'branch',
      question: '¿Peso del camión == total picking?',
      yesLabel: 'S — Cuadra',
      noLabel: 'N — Diferencia',
      yesOutcome: 'Verificar temperatura del camión refrigerado.',
      noOutcome: 'Bloqueo: revisar picking y reintentar salida cruzada.',
    },
  },
  {
    id: 'despacho',
    chapter: 'outbound',
    title: 'Empaque, despacho y carga',
    hook: 'De outboundBoxes a dispatchedBoxes.',
    narrative:
      'Registro de salida, cartonaje contra OV si aplica, carga al camión. Carga incompleta → err_carga y vuelta a picking. Completa → segundo tramo de transporte hacia el cliente.',
    roles: [
      formatRoleLabel('custodio'),
      formatRoleLabel('operario'),
      formatRoleLabel('transportista'),
    ],
    visual: 'ice',
    flowRefs: ['empaque', 'despacho', 'v_carga', 'tv_viaje', 'trans2'],
    interactive: {
      type: 'chain',
      steps: [
        'Empaque / registro salida',
        'Cargar camión',
        'contador → TV-####',
        'Transporte al cliente',
      ],
    },
  },
  {
    id: 'entrega',
    chapter: 'finale',
    title: 'Entrega al cliente',
    hook: 'TV-#### con trazabilidad hasta el último metro.',
    narrative:
      'viaje_transporte vinculado a la OV. El transportista registra cantidades, conformidad e incidencias. Sin evidencias no hay cierre: foto + firma + geolocalización obligatorias.',
    roles: [formatRoleLabel('transportista'), 'Comprador (externo)'],
    visual: 'snow',
    flowRefs: ['entrega', 'v_firma', 'err_f', 'historial'],
    interactive: {
      type: 'evidence',
      items: [
        { id: 'foto', label: 'Foto de entrega' },
        { id: 'firma', label: 'Firma digital' },
        { id: 'gps', label: 'Ubicación GPS' },
      ],
    },
  },
  {
    id: 'fin-ok',
    chapter: 'finale',
    title: 'FIN: Cerrado-OK',
    hook: 'Ciclo completo — compra → bodega → venta → evidencia.',
    narrative:
      'Estado final verde. movimiento_inventario y auditoria_operacion por tenant. Recorrido: empresa → tenant → SOL/OC → recepción → mapa → procesamiento → OV/FEFO → TV-#### → evidencias.',
    roles: ['Todos'],
    visual: 'aurora',
    flowRefs: ['historial', 'fin_ok'],
    interactive: { type: 'celebrate' },
  },
]

export function getBodegaStepById(id) {
  return bodegaStepByStepSteps.find((s) => s.id === id) ?? null
}

export function getBodegaStepIndex(id) {
  return bodegaStepByStepSteps.findIndex((s) => s.id === id)
}

export const BODEGA_STEP_COUNT = bodegaStepByStepSteps.length
