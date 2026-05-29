/**
 * Recorrido interactivo «Paso a paso» — Bodega de frío.
 * Cubre el flujo principal (flowsData) y ramas S/N, reintentos y bloqueos.
 */

export const BODEGA_STEP_CHAPTERS = [
  { id: 'intro', label: 'Inicio', color: 'from-cyan-400/20 to-sky-500/10' },
  { id: 'owner', label: 'Dueño (SaaS)', color: 'from-violet-400/20 to-indigo-500/10' },
  { id: 'tenant', label: 'Inquilino', color: 'from-sky-400/20 to-cyan-500/10' },
  { id: 'inbound', label: 'Entrada', color: 'from-emerald-400/15 to-teal-500/10' },
  { id: 'warehouse', label: 'Bodega', color: 'from-blue-400/20 to-indigo-500/10' },
  { id: 'process', label: 'Proceso', color: 'from-amber-400/15 to-orange-500/10' },
  { id: 'outbound', label: 'Salida', color: 'from-rose-400/15 to-pink-500/10' },
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
    title: 'Bienvenido al túnel de frío',
    hook: '28 paradas. Cero aburrimiento. Todo el WMS en una sola travesía.',
    narrative:
      'Este recorrido sigue el mismo camino que el diagrama React Flow: desde que el configurador crea la cuenta hasta el cierre del viaje con foto, firma y GPS. Usa las flechas del teclado (← →) o los botones para avanzar. En cada nube de hielo hay algo que tocar, arrastrar o decidir.',
    roles: ['Todos'],
    visual: 'aurora',
    interactive: { type: 'intro' },
  },
  {
    id: 'dual-world',
    chapter: 'intro',
    title: 'Dos mundos, un mismo producto',
    hook: 'Morado arriba, operación abajo — el puente es el tenant.',
    narrative:
      'DUEÑO configura infraestructura SaaS: cuentas, bodegas, capacidad y roles. INQUILINO opera el día a día: OC, recepción, mapa, alertas, procesamiento y despacho. Sin tenant válido no cruzas el puente.',
    roles: ['Configurador', 'Admin Tenant', 'Operarios'],
    visual: 'cloud',
    flowRefs: ['hdr_dueno', 'hdr_inqu'],
    interactive: {
      type: 'roles',
      cards: [
        { id: 'dueno', label: 'Dueño', desc: 'Cuentas, bodegas, límites, RBAC', icon: 'building' },
        { id: 'inquilino', label: 'Inquilino', desc: 'OC → mapa → OV → camión', icon: 'cube' },
      ],
    },
  },
  {
    id: 'config-cuenta',
    chapter: 'owner',
    title: 'Configurador crea la cuenta',
    hook: 'Primer ladrillo del SaaS multi-cuenta.',
    narrative:
      'El configurador da de alta el tenant en Supabase (PostgreSQL): metadatos comerciales, estado activo y vínculo a bodegas. Si el ID es inválido o la cuenta está suspendida, el flujo se detiene en rojo — no hay atajos.',
    roles: ['Configurador'],
    visual: 'crystal',
    flowRefs: ['config', 'v_tenant'],
    interactive: {
      type: 'branch',
      question: '¿La cuenta pasa validación?',
      yesLabel: 'S — Cuenta activa',
      noLabel: 'N — ID inválido / suspensión',
      yesOutcome: 'Avanzas a definir bodegas, capacidad y reglas del plano.',
      noOutcome: 'Bloqueo: err_t. Nadie opera hasta regularizar con soporte.',
      yesNext: 'estructura',
      noNext: 'blocked-hint',
    },
  },
  {
    id: 'estructura',
    chapter: 'owner',
    title: 'Bodegas, capacidad y reglas',
    hook: 'El mapa físico debe caber en el plano digital.',
    narrative:
      'Se crean bodegas internas (y luego integraciones externas tipo Fridem). Cada una tiene slots, umbrales de temperatura y límites de kg. Si la capacidad física declarada supera el límite del plano, el sistema pide ajustar antes de seguir.',
    roles: ['Configurador', 'Admin bodega'],
    visual: 'ice',
    flowRefs: ['estructura', 'v_cap'],
    funFact: 'En V2 el dashboard dejó de ser 12 posiciones fijas: ahora es dinámico por rol.',
    interactive: {
      type: 'branch',
      question: '¿Capacidad física < límite del plano?',
      yesLabel: 'S — Cabe en el plano',
      noLabel: 'N — Espacio insuficiente',
      yesOutcome: 'Siguiente: crear perfiles Admin, Jefe, Custodio, Operario, Procesador…',
      noOutcome: 'err_c: debes redimensionar slots o subir el límite contratado.',
    },
  },
  {
    id: 'rbac',
    chapter: 'owner',
    title: 'Roles y permisos (RBAC)',
    hook: 'Cada rol ve solo su cola — ni más ni menos.',
    narrative:
      'Jefe prioriza órdenes de trabajo y alertas. Custodio concentra ingresos y recepción contra OC/OV. Operario ejecuta traslados. Procesador ve sobre todo solicitudes de transformación. Sin permiso explícito: denegar acción.',
    roles: ['Configurador', 'Todos los operativos'],
    visual: 'snow',
    flowRefs: ['perfiles', 'v_perm'],
    interactive: {
      type: 'branch',
      question: '¿El usuario tiene permiso para esta acción?',
      yesLabel: 'S — Atribución OK',
      noLabel: 'N — Sin permisos',
      yesOutcome: 'Cruzas el header-bridge hacia INQUILINO — operación diaria.',
      noOutcome: 'err_p: pantalla de acceso denegado; revisar matriz RBAC.',
    },
  },
  {
    id: 'strip-oc',
    chapter: 'tenant',
    title: 'Strip + Orden de compra',
    hook: 'Limpia nulls antes de tocar inventario real.',
    narrative:
      'La función Strip elimina undefined/null en payloads hacia Supabase (PostgreSQL). Luego la cuenta genera OC (orden de compra) o SOL (solicitud previa). Estados: Iniciado → En recepción → Cerrado. Prefijo OC-####.',
    roles: ['Admin Tenant', 'Operador Tenant'],
    visual: 'cloud',
    flowRefs: ['strip', 'oc'],
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
    roles: ['Admin Tenant', 'Transporte proveedor'],
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
    roles: ['Transporte', 'Custodio'],
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
    roles: ['Custodio', 'Jefe'],
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
    roles: ['Custodio'],
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
    roles: ['Custodio', 'Jefe de bodega'],
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
    roles: ['Custodio', 'Operario'],
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
    roles: ['Custodio', 'Jefe', 'Operario'],
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
    roles: ['Operario', 'Jefe'],
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
    roles: ['Jefe', 'Admin', 'Operario'],
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
    roles: ['Procesador', 'Jefe', 'Cuenta'],
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
    roles: ['Admin Tenant', 'Operador Tenant', 'Operario'],
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
    roles: ['Custodio', 'Transporte'],
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
    roles: ['Custodio', 'Operario', 'Transporte'],
    visual: 'ice',
    flowRefs: ['empaque', 'despacho', 'v_carga', 'trans2'],
    interactive: {
      type: 'chain',
      steps: ['Empaque / registro salida', 'Cargar camión', '¿Carga completa? → En ruta'],
    },
  },
  {
    id: 'entrega',
    chapter: 'finale',
    title: 'Entrega al cliente',
    hook: 'TV-#### con trazabilidad hasta el último metro.',
    narrative:
      'Viaje en viajesTransporte. El rol Transporte registra cantidades, conformidad, incidencias. Sin evidencias no hay cierre: foto + firma + geolocalización obligatorias.',
    roles: ['Transporte', 'Comprador'],
    visual: 'snow',
    flowRefs: ['entrega', 'v_firma', 'err_f'],
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
      'Estado final verde en el diagrama. Historial en Supabase (PostgreSQL) para auditoría, reportes de merma acumulada y KPIs operativos. Has recorrido configuración SaaS, recepción con ramas, mapa con locking, alertas, procesamiento, FEFO, salida cruzada y cierre con evidencias.',
    roles: ['Todos'],
    visual: 'aurora',
    flowRefs: ['fin_ok'],
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
