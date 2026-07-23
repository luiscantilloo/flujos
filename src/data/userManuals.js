/**
 * Manual de Usuario — Polaria WMS.
 * Fuente de verdad de la sección `/manual-usuario`.
 *
 * Objetivo: explicar, en lenguaje claro y por rol, cómo funciona cada usuario del
 * WMS (qué ve, qué puede hacer, paso a paso y límites). Está pensado como base de
 * conocimiento para **Mateo Support** (el asistente de IA) y para onboarding humano.
 *
 * Alineado a los repos polaria-wms-web (pantallas y navegación por rol),
 * polaria-wms-api (permisos y endpoints) y polaria-wms-db (roles y estados) — Jul 2026.
 */
import { WMS_ROLES } from './wmsRoles.js'

/**
 * Guías detalladas por rol. La clave es el `id` del rol en wmsRoles.js.
 * @typedef {Object} RoleGuide
 */
export const MANUAL_ROLE_GUIDES = {
  configurador: {
    resumen: 'Equipo de TI del proveedor SaaS. Da de alta empresas, cuentas, bodegas y el primer administrador de cada cliente. No opera mercancía.',
    quienEs: 'Persona del equipo de plataforma (Polaria). Trabaja a nivel global, no pertenece a ninguna empresa cliente.',
    comoIngresa: [
      'Entra a la web e introduce su correo electrónico.',
      'No necesita código de empresa (es usuario de plataforma).',
      'Introduce su contraseña. El sistema lo lleva al panel de configurador (/configurador).',
    ],
    pantallaInicial: 'Panel de configurador con 3 accesos: Creación, Creación y asignación, e Integración.',
    menus: ['Creación (Empresas, Cuentas, Bodega interna, Bodega externa)', 'Asignación (Usuarios)', 'Integración (bandeja de solicitudes)'],
    puedeHacer: [
      'Crear y editar EMPRESAS (razón social, teléfono, activar/desactivar).',
      'Crear y editar CUENTAS (tenants) y sincronizar sus bodegas.',
      'Crear bodegas internas y externas, y armar su layout (zonas y ubicaciones).',
      'Crear usuarios de cualquier cuenta (incluido el administrador de cuenta).',
      'Revisar y atender la bandeja global de solicitudes de integración con bodega externa.',
      'Tiene acceso total (bypass) para tareas de soporte, pero su función es configurar, no operar.',
    ],
    noPuedeHacer: [
      'No gestiona el día a día de mercancía (compras/ventas/inventario) de los clientes.',
    ],
    tareas: [
      {
        titulo: 'Dar de alta un cliente nuevo (de cero)',
        pasos: [
          'Crear la EMPRESA en Creación → Empresas.',
          'Crear la CUENTA (tenant) asociada a esa empresa en Creación → Cuentas.',
          'Crear la(s) BODEGA(S) en Creación → Bodega interna/externa.',
          'Armar el layout de la bodega interna (zonas de ingreso, almacenamiento, salida y procesamiento).',
          'Crear el ADMINISTRADOR DE CUENTA en Asignación → Usuarios y entregarle el acceso.',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿El configurador ve la mercancía de los clientes?', a: 'Puede verla para soporte, pero su trabajo es la configuración inicial (empresas, cuentas, bodegas y usuarios), no la operación.' },
      { q: '¿Necesita código de empresa para entrar?', a: 'No. Es usuario de plataforma; entra solo con correo y contraseña.' },
    ],
  },
  administrador_cuenta: {
    resumen: 'Responsable del cliente. Administra su equipo, catálogos y la operación comercial (compras y ventas) de su cuenta.',
    quienEs: 'La persona a cargo de la empresa cliente. La crea el configurador y hereda su empresa y cuenta.',
    comoIngresa: [
      'Introduce su correo. Si el sistema lo pide, escribe el código de empresa.',
      'Introduce su contraseña y entra al panel administrativo de su cuenta.',
    ],
    pantallaInicial: 'Panel administrativo con 3 accesos: Asignación y creación, Catálogo y Reportes.',
    menus: ['Inicio', 'Compras', 'Procesamiento', 'Ventas', 'Transporte', 'Administración (Asignación/creación, Catálogo, Reportería)'],
    puedeHacer: [
      'Crear usuarios de su cuenta (operador de cuenta y equipo de bodega).',
      'Gestionar catálogos: proveedores, clientes, compradores, camiones, plantas y productos (incluye importar por Excel).',
      'Crear/editar productos primarios y secundarios.',
      'Vincular usuarios a bodegas internas y externas.',
      'APROBAR o rechazar solicitudes de compra (SOL).',
      'Ver órdenes de compra, órdenes de venta y reportes de inventario por etapas.',
    ],
    noPuedeHacer: [
      'No crea empresas ni cuentas (eso es del configurador).',
      'No ejecuta el trabajo físico de bodega (mover cajas, bloquear slots).',
    ],
    tareas: [
      {
        titulo: 'Aprobar una solicitud de compra (SOL)',
        pasos: [
          'Ir a Compras → pestaña Solicitudes.',
          'Abrir la solicitud en estado "pendiente de aprobación".',
          'Revisar productos, pesos y proveedor.',
          'Pulsar Aprobar (o Rechazar). Al aprobar, queda lista para convertirse en orden de compra.',
        ],
      },
      {
        titulo: 'Cargar el catálogo de productos',
        pasos: [
          'Ir a Administración → Catálogo.',
          'Crear productos manualmente o usar Importar Excel.',
          'Definir si son primarios o secundarios y sus reglas de conversión/merma.',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿Quién puede aprobar compras?', a: 'El administrador de cuenta (y el configurador). El operador de cuenta las crea pero no las aprueba.' },
      { q: '¿Puedo cargar muchos productos a la vez?', a: 'Sí, desde Administración → Catálogo con Importar Excel.' },
    ],
  },
  operador_cuenta: {
    resumen: 'Opera el lado comercial del cliente: crea solicitudes/órdenes de compra, órdenes de venta y solicitudes de procesamiento.',
    quienEs: 'Colaborador de la cuenta encargado de la gestión comercial. Lo crea el administrador de cuenta.',
    comoIngresa: ['Correo → (código de empresa si se solicita) → contraseña.'],
    pantallaInicial: 'Hub con 4 opciones: Proveedor/Compras, Ventas, Bodega interna y Bodega externa.',
    menus: ['Inicio', 'Compras', 'Procesamiento', 'Ventas'],
    puedeHacer: [
      'Crear y editar solicitudes de compra (SOL) y enviarlas a aprobación.',
      'Convertir una SOL aprobada en orden de compra (OC) y emitirla.',
      'Crear órdenes de venta (OV) eligiendo comprador, productos con stock, kilos y precio.',
      'Crear solicitudes de procesamiento (primario → secundario).',
      'Solicitar integración con una bodega externa.',
    ],
    noPuedeHacer: [
      'No aprueba sus propias solicitudes de compra (lo hace el administrador de cuenta).',
      'No ejecuta operación física de bodega.',
    ],
    tareas: [
      {
        titulo: 'Crear una solicitud de compra (SOL)',
        pasos: [
          'Ir a Compras → + Nueva solicitud.',
          'Elegir proveedor, productos del catálogo, peso (kg) por línea y bodega destino.',
          'Guardar (queda en borrador) y pulsar Enviar a aprobación.',
        ],
      },
      {
        titulo: 'Crear una orden de venta (OV)',
        pasos: [
          'Ir a Ventas → Órdenes → + Crear.',
          'Elegir comprador y productos con stock disponible.',
          'Indicar kilos y precio por línea y confirmar.',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿Por qué no puedo aprobar mi solicitud?', a: 'La aprobación es responsabilidad del administrador de cuenta o del configurador, para mantener control.' },
    ],
  },
  administrador_bodega: {
    resumen: 'Responsable de una bodega. Supervisa el estado de la bodega, recepciones, transporte y reportes.',
    quienEs: 'Encargado de la bodega asignada. Lo crea el administrador de cuenta.',
    comoIngresa: ['Correo → código de empresa → contraseña. Si tiene varias bodegas, elige la bodega activa en la barra superior.'],
    pantallaInicial: 'Estado de bodega (mapa de la bodega) del administrador de bodega.',
    menus: ['Inicio', 'Ingreso', 'Mapa', 'Procesamiento', 'Transporte', 'Reportes de bodega'],
    puedeHacer: [
      'Ver el estado de la bodega (mapa de slots por zona).',
      'Cerrar recepciones de órdenes de compra.',
      'Bloquear/forzar liberación de posiciones en el mapa.',
      'Participar en despacho y transporte, y consultar reportes de la bodega.',
      'Atender llamadas de operarios.',
    ],
    noPuedeHacer: [
      'No aprueba solicitudes de compra (es rol comercial de cuenta).',
    ],
    tareas: [
      {
        titulo: 'Supervisar el estado de la bodega',
        pasos: [
          'Elegir la bodega activa en la barra superior.',
          'Abrir Estado de bodega / Mapa.',
          'Revisar zonas de ingreso, almacenamiento, picking y procesamiento.',
        ],
      },
    ],
    integraMateo: true,
    faq: [],
  },
  jefe_bodega: {
    resumen: 'Jefe operativo de la bodega. Prioriza el trabajo: crea órdenes de trabajo, asigna tareas, gestiona alertas y orquesta el procesamiento y las salidas.',
    quienEs: 'Quien dirige la operación diaria dentro de la bodega. Lo crea el administrador de cuenta.',
    comoIngresa: ['Correo → código de empresa → contraseña. Elige bodega activa si tiene varias.'],
    pantallaInicial: 'Estado de bodega del jefe, con una barra de acciones (Ingresos, Bodega a bodega, Revisar, Crear salida).',
    menus: ['Inicio', 'Ingreso', 'Mapa', 'Procesamiento', 'Transporte'],
    puedeHacer: [
      'Crear órdenes de trabajo (OT): a_bodega, a_salida, revisar.',
      'Asignar tareas y alertas a operarios y procesadores.',
      'Crear solicitudes de procesamiento y asignar el operario que mueve el insumo.',
      'Registrar ingresos manuales y crear salidas vinculadas a órdenes de venta.',
      'Atender llamadas de operarios y cerrar alertas.',
      'Cerrar recepciones y armar paquetes de despacho.',
    ],
    noPuedeHacer: [
      'No aprueba compras ni gestiona catálogos comerciales.',
    ],
    tareas: [
      {
        titulo: 'Crear una salida para una venta',
        pasos: [
          'Desde el estado de bodega, pulsar Crear salida.',
          'Vincular la salida a la orden de venta correspondiente.',
          'Asignar el operario que ejecutará el movimiento.',
        ],
      },
      {
        titulo: 'Lanzar un procesamiento',
        pasos: [
          'Crear la solicitud de procesamiento (producto primario → secundario y kilos).',
          'Asignar un operario para mover el insumo a la zona de procesamiento.',
          'El procesador ejecuta y cierra; luego se generan OT de retorno a bodega.',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿Quién ejecuta las órdenes de trabajo que creo?', a: 'Los operarios. Tú las creas y asignas; ellos las ejecutan en el mapa.' },
    ],
  },
  custodio: {
    resumen: 'Recibe mercancía en el muelle, valida documentos y temperatura, y apoya el despacho de salidas.',
    quienEs: 'Persona de bodega responsable del ingreso y control físico en recepción. Lo crea el administrador de cuenta.',
    comoIngresa: ['Correo → código de empresa → contraseña. Elige bodega activa.'],
    pantallaInicial: 'Vista de ingreso con el layout de la bodega y pestañas de Orden de compra y Orden de venta.',
    menus: ['Inicio', 'Ingreso', 'Mapa'],
    puedeHacer: [
      'Registrar y cerrar la recepción de una orden de compra (conteo ciego + temperatura).',
      'Consultar órdenes de compra y de venta en tránsito.',
      'Bloquear posiciones del mapa durante la operación.',
      'Apoyar el armado de paquetes de despacho.',
    ],
    noPuedeHacer: [
      'No crea órdenes de trabajo (eso es del jefe).',
    ],
    tareas: [
      {
        titulo: 'Recepcionar una orden de compra',
        pasos: [
          'Ir a Ingreso y elegir la OC pendiente (emitida o parcialmente recibida).',
          'Registrar cantidades recibidas, temperatura y ubicación de ingreso.',
          'Cerrar la recepción: el sistema concilia contra lo esperado (conteo ciego).',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿Qué es el conteo ciego?', a: 'Registras lo que realmente llega sin ver las cantidades esperadas; el sistema compara al cerrar y marca diferencias.' },
    ],
  },
  operario: {
    resumen: 'Ejecuta el trabajo físico: mueve cajas entre slots según las órdenes de trabajo y completa tareas de la cola.',
    quienEs: 'Operario de bodega. Lo crea el administrador de cuenta y lo asigna a una bodega.',
    comoIngresa: ['Correo → código de empresa → contraseña. Elige bodega activa.'],
    pantallaInicial: 'Cola de tareas (operación) con las órdenes que le fueron asignadas.',
    menus: ['Inicio', 'Operación', 'Mapa'],
    puedeHacer: [
      'Completar tareas de la cola y ejecutar órdenes de trabajo (mover mercancía en el mapa).',
      'Bloquear la posición del mapa donde está trabajando (evita choques con otros).',
      'Iniciar el movimiento de insumo en un procesamiento.',
      'Crear alertas y llamar al jefe si algo se traba.',
      'Enviar su "presencia" (heartbeat) para aparecer como disponible.',
    ],
    noPuedeHacer: [
      'No crea ni asigna órdenes de trabajo (las ejecuta).',
      'No aprueba compras ni maneja catálogos.',
    ],
    tareas: [
      {
        titulo: 'Ejecutar una tarea de la cola',
        pasos: [
          'Abrir Operación y elegir la tarea asignada.',
          'Bloquear la posición del mapa donde vas a trabajar.',
          'Realizar el movimiento físico y marcar la tarea como completada.',
          'Si algo impide continuar, crear una alerta o Llamar al jefe.',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿Por qué debo bloquear la posición?', a: 'Para que dos operarios no trabajen la misma posición a la vez. Al terminar, se libera automáticamente.' },
    ],
  },
  procesador: {
    resumen: 'Trabaja la línea de procesamiento: transforma producto primario en secundario y registra la merma.',
    quienEs: 'Especialista de la línea de procesamiento. Lo crea el administrador de cuenta.',
    comoIngresa: ['Correo → código de empresa → contraseña. Elige bodega activa.'],
    pantallaInicial: 'Cola de solicitudes de procesamiento en curso.',
    menus: ['Inicio', 'Ingreso', 'Operación', 'Procesamiento'],
    puedeHacer: [
      'Tomar solicitudes de procesamiento que están en proceso.',
      'Cerrar el procesamiento indicando kilos resultantes y desperdicio (merma).',
      'Llamar al jefe o crear alertas cuando lo necesita.',
    ],
    noPuedeHacer: [
      'No crea la solicitud de procesamiento (la crea el jefe u operador de cuenta).',
    ],
    tareas: [
      {
        titulo: 'Cerrar un procesamiento',
        pasos: [
          'Abrir la solicitud en estado "en proceso".',
          'Registrar los kilos resultantes del producto secundario y la merma.',
          'Cerrar: la solicitud pasa a pendiente de cierre y se generan OT de retorno a bodega.',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿Qué es la merma?', a: 'El peso que se pierde al transformar el producto (recortes, agua, etc.). Se registra al cerrar el procesamiento.' },
    ],
  },
  transportista: {
    resumen: 'Conduce los viajes de entrega y registra la evidencia (foto, firma) al entregar la mercancía.',
    quienEs: 'Conductor asignado a los viajes de transporte. Lo crea el administrador de cuenta.',
    comoIngresa: ['Correo → código de empresa → contraseña.'],
    pantallaInicial: 'Listado de viajes de transporte / entregas.',
    menus: ['Inicio', 'Ingreso', 'Transporte'],
    puedeHacer: [
      'Ver los viajes asignados con su venta, cliente y kilos.',
      'Registrar la entrega paso a paso: confirmación, foto, firma y cierre.',
    ],
    noPuedeHacer: [
      'No arma el paquete de despacho (lo hacen jefe/custodio/administrador de bodega).',
    ],
    tareas: [
      {
        titulo: 'Registrar una entrega',
        pasos: [
          'Abrir Transporte y elegir el viaje.',
          'Pulsar Realizar entrega y seguir los pasos: confirmar, tomar foto, capturar firma.',
          'Cerrar la entrega: el viaje y la orden de venta se cierran.',
        ],
      },
    ],
    integraMateo: true,
    faq: [
      { q: '¿La foto y la firma son obligatorias?', a: 'Sí, son la evidencia de que la entrega se hizo conforme. Se suben de forma segura.' },
    ],
  },
}

/**
 * Guías por proceso de negocio (cruzan varios roles).
 */
export const MANUAL_PROCESS_GUIDES = [
  {
    id: 'compras',
    titulo: 'Compras: de la solicitud a la recepción',
    resumen: 'Cómo se compra mercancía y entra a la bodega, desde la SOL hasta cerrar la recepción.',
    actores: ['operador_cuenta', 'administrador_cuenta', 'custodio', 'jefe_bodega'],
    pasos: [
      { actor: 'operador_cuenta', texto: 'Crea la solicitud de compra (SOL) con proveedor, productos y kilos, y la envía a aprobación.' },
      { actor: 'administrador_cuenta', texto: 'Aprueba (o rechaza) la SOL.' },
      { actor: 'operador_cuenta', texto: 'Convierte la SOL aprobada en orden de compra (OC), completa el destino y la emite.' },
      { actor: 'operador_cuenta', texto: 'Opcional: notifica al proveedor (integración n8n).' },
      { actor: 'custodio', texto: 'Recepciona la mercancía: registra cantidades, temperatura y ubicación, y cierra con conteo ciego.' },
    ],
    estados: 'SOL: borrador → pendiente_aprobacion → aprobada → convertida. OC: borrador → emitida → parcialmente_recibida → recibida → cerrada.',
  },
  {
    id: 'ventas',
    titulo: 'Ventas: de la orden a la entrega',
    resumen: 'Cómo sale la mercancía hacia el cliente, desde la OV hasta la entrega con evidencia.',
    actores: ['operador_cuenta', 'jefe_bodega', 'operario', 'transportista'],
    pasos: [
      { actor: 'operador_cuenta', texto: 'Crea la orden de venta (OV) con comprador, productos, kilos y precio, y la emite (reserva stock).' },
      { actor: 'jefe_bodega', texto: 'Crea la salida vinculada a la OV y asigna un operario.' },
      { actor: 'operario', texto: 'Ejecuta las tareas de picking/movimiento en el mapa.' },
      { actor: 'jefe_bodega', texto: 'Arma el paquete de despacho (viaje + guías).' },
      { actor: 'transportista', texto: 'Realiza la entrega y registra foto y firma; se cierran el viaje y la OV.' },
    ],
    estados: 'OV: borrador → confirmada → en_preparacion → parcialmente_despachada → despachada → cerrada.',
  },
  {
    id: 'procesamiento',
    titulo: 'Procesamiento: primario a secundario',
    resumen: 'Cómo se transforma un producto primario en secundario controlando la merma.',
    actores: ['operador_cuenta', 'jefe_bodega', 'operario', 'procesador'],
    pasos: [
      { actor: 'jefe_bodega', texto: 'Crea la solicitud de procesamiento (producto primario → secundario y kilos).' },
      { actor: 'jefe_bodega', texto: 'Asigna un operario para mover el insumo a la zona de procesamiento.' },
      { actor: 'operario', texto: 'Inicia el procesamiento: se descuenta el stock primario.' },
      { actor: 'procesador', texto: 'Ejecuta y cierra registrando kilos resultantes y merma.' },
      { actor: 'operario', texto: 'Aplica las OT de retorno para ubicar el producto secundario en el mapa.' },
      { actor: 'jefe_bodega', texto: 'Marca la solicitud como terminada.' },
    ],
    estados: 'Procesamiento: pendiente → en_proceso → pendiente_cierre → terminada.',
  },
  {
    id: 'inventario',
    titulo: 'Inventario y mapa en tiempo real',
    resumen: 'Cómo se ve y se opera el estado de la bodega con bloqueos para evitar choques.',
    actores: ['administrador_bodega', 'jefe_bodega', 'custodio', 'operario'],
    pasos: [
      { actor: 'operario', texto: 'Abre el Mapa con la bodega activa y ve las posiciones en tiempo real.' },
      { actor: 'operario', texto: 'Bloquea la posición donde va a trabajar.' },
      { actor: 'operario', texto: 'Realiza el movimiento y libera la posición (se libera sola al completar la tarea).' },
      { actor: 'jefe_bodega', texto: 'Si una posición quedó bloqueada por error, puede forzar la liberación.' },
    ],
    estados: 'Slots: libre, ocupado, reservado, en_proceso.',
  },
  {
    id: 'integracion',
    titulo: 'Integración con bodega externa',
    resumen: 'Cómo un cliente pide conectar una bodega externa (p. ej. Fridem) y el configurador la habilita.',
    actores: ['operador_cuenta', 'administrador_cuenta', 'configurador'],
    pasos: [
      { actor: 'operador_cuenta', texto: 'Desde Bodega externa → Integración, solicita la integración.' },
      { actor: 'configurador', texto: 'Revisa la bandeja global de solicitudes y habilita la integración.' },
    ],
    estados: 'Integración: activo, finalizado.',
  },
]

/**
 * Catálogo de funciones/acciones clave: quién puede, dónde se hace y qué efecto tiene.
 */
export const MANUAL_FUNCTIONS = [
  { accion: 'Aprobar solicitud de compra (SOL)', roles: ['administrador_cuenta', 'configurador'], donde: 'Compras → Solicitudes', efecto: 'La SOL pasa a aprobada y puede convertirse en OC.' },
  { accion: 'Convertir SOL en orden de compra (OC)', roles: ['operador_cuenta', 'administrador_cuenta', 'jefe_bodega'], donde: 'Compras → Solicitudes', efecto: 'Genera una OC en borrador a partir de la SOL aprobada.' },
  { accion: 'Emitir orden de compra', roles: ['operador_cuenta', 'administrador_cuenta', 'jefe_bodega'], donde: 'Compras → Órdenes', efecto: 'La OC pasa de borrador a emitida (valida destino y capacidad).' },
  { accion: 'Cerrar recepción (conteo ciego)', roles: ['custodio', 'jefe_bodega', 'administrador_bodega', 'administrador_cuenta', 'configurador'], donde: 'Ingreso / Recepción', efecto: 'Concilia lo recibido vs lo esperado y actualiza el inventario.' },
  { accion: 'Bloquear posición del mapa', roles: ['operario', 'custodio', 'jefe_bodega', 'administrador_bodega', 'configurador'], donde: 'Mapa', efecto: 'Reserva la posición para operar sin choques con otros usuarios.' },
  { accion: 'Forzar liberación de posición', roles: ['jefe_bodega', 'administrador_bodega', 'configurador'], donde: 'Mapa', efecto: 'Libera una posición bloqueada por otro usuario.' },
  { accion: 'Crear orden de trabajo (OT)', roles: ['jefe_bodega', 'configurador'], donde: 'Estado de bodega / Operaciones', efecto: 'Genera trabajo (a_bodega, a_salida, revisar) para que el operario lo ejecute.' },
  { accion: 'Ejecutar orden de trabajo', roles: ['operario', 'configurador'], donde: 'Operación / Mapa', efecto: 'Realiza el movimiento de inventario asociado a la OT.' },
  { accion: 'Crear orden de venta (OV)', roles: ['operador_cuenta'], donde: 'Ventas → Órdenes', efecto: 'Registra una venta con productos y precios; al emitir reserva stock.' },
  { accion: 'Cerrar procesamiento (merma)', roles: ['procesador', 'configurador'], donde: 'Procesamiento', efecto: 'Registra kilos resultantes y merma; pasa a pendiente de cierre.' },
  { accion: 'Registrar entrega', roles: ['transportista', 'administrador_bodega', 'jefe_bodega', 'configurador'], donde: 'Transporte', efecto: 'Guarda foto y firma; cierra el viaje y la OV.' },
  { accion: 'Crear usuarios', roles: ['configurador', 'administrador_cuenta'], donde: 'Asignación / Administración', efecto: 'Configurador crea en cualquier cuenta; admin de cuenta solo en la suya.' },
  { accion: 'Solicitar integración bodega externa', roles: ['operador_cuenta', 'administrador_cuenta'], donde: 'Bodega externa → Integración', efecto: 'Envía la solicitud a la bandeja del configurador.' },
]

/** Etiqueta legible del rol (fallback al id). */
function roleLabel(roleId) {
  return WMS_ROLES.find((r) => r.id === roleId)?.nombre ?? roleId
}

/** Entradas navegables del manual (para el índice y las rutas). */
export const MANUAL_ENTRIES = [
  ...WMS_ROLES.map((r) => ({
    id: `rol-${r.id}`,
    category: 'roles',
    roleId: r.id,
    title: r.nombre,
    summary: MANUAL_ROLE_GUIDES[r.id]?.resumen ?? r.descripcion,
    icon: 'UserCircle',
    accent: r.nivel === 'plataforma' ? 'violet' : r.nivel === 'cuenta' ? 'sky' : 'emerald',
  })),
  ...MANUAL_PROCESS_GUIDES.map((p) => ({
    id: `proceso-${p.id}`,
    category: 'procesos',
    processId: p.id,
    title: p.titulo,
    summary: p.resumen,
    icon: 'ArrowPath',
    accent: 'amber',
  })),
  {
    id: 'funciones',
    category: 'funciones',
    title: 'Funciones y acciones (quién puede qué)',
    summary: 'Tabla de referencia rápida: cada acción del sistema, los roles que la pueden hacer y su efecto.',
    icon: 'ClipboardCheck',
    accent: 'cyan',
  },
]

export const MANUAL_INDEX_GROUPS = [
  { id: 'roles', label: 'Manuales por rol', description: 'Un manual por cada rol: qué ve, qué puede hacer y paso a paso.' },
  { id: 'procesos', label: 'Guías por proceso', description: 'Flujos completos que cruzan varios roles.' },
  { id: 'funciones', label: 'Funciones y acciones', description: 'Referencia rápida de permisos por acción.' },
]

export function getManualEntry(entryId) {
  return MANUAL_ENTRIES.find((e) => e.id === entryId) ?? null
}

export function isValidManualEntry(entryId) {
  return Boolean(getManualEntry(entryId))
}

const NIVEL_LABEL = { plataforma: 'Plataforma', cuenta: 'Cuenta', bodega: 'Bodega' }

function formatRoleManualMarkdown(roleId) {
  const role = WMS_ROLES.find((r) => r.id === roleId)
  const g = MANUAL_ROLE_GUIDES[roleId]
  if (!role || !g) return `No hay manual para el rol \`${roleId}\`.`

  const lines = [
    `# Manual del rol: ${role.nombre}`,
    '',
    `> **Para soporte (Mateo):** ${g.resumen}`,
    '',
    `| Dato | Detalle |`,
    `| --- | --- |`,
    `| Código de rol | \`${role.codigo}\` |`,
    `| Nivel | ${NIVEL_LABEL[role.nivel] ?? role.nivel} |`,
    `| Lo crea | ${role.creadoPor ? roleLabel(role.creadoPor) : 'Es usuario de plataforma (no lo crea nadie dentro del cliente)'} |`,
    '',
    '## ¿Quién es este usuario?',
    '',
    g.quienEs,
    '',
    '## Cómo ingresa',
    '',
    ...g.comoIngresa.map((s) => `1. ${s}`),
    '',
    `**Al entrar ve:** ${g.pantallaInicial}`,
    '',
    '## Menú / navegación',
    '',
    ...g.menus.map((m) => `- ${m}`),
    '',
    '## Qué puede hacer',
    '',
    ...g.puedeHacer.map((p) => `- ${p}`),
    '',
    '## Qué NO puede hacer',
    '',
    ...(g.noPuedeHacer.length ? g.noPuedeHacer.map((p) => `- ${p}`) : ['- (Sin restricciones destacadas más allá de su alcance de rol.)']),
    '',
  ]

  if (g.tareas?.length) {
    lines.push('## Tareas paso a paso', '')
    for (const t of g.tareas) {
      lines.push(`### ${t.titulo}`, '')
      t.pasos.forEach((p, i) => lines.push(`${i + 1}. ${p}`))
      lines.push('')
    }
  }

  if (g.integraMateo) {
    lines.push(
      '## Ayuda con Mateo',
      '',
      'Este rol tiene acceso al asistente **Mateo** desde el botón "Mateo IA" en la barra superior. Puede abrir el chat embebido sin salir del WMS para resolver dudas operativas.',
      '',
    )
  }

  if (g.faq?.length) {
    lines.push('## Preguntas frecuentes', '')
    for (const f of g.faq) {
      lines.push(`**${f.q}**`, '', f.a, '')
    }
  }

  return lines.join('\n')
}

function formatProcessManualMarkdown(processId) {
  const p = MANUAL_PROCESS_GUIDES.find((x) => x.id === processId)
  if (!p) return `No hay guía para el proceso \`${processId}\`.`
  const lines = [
    `# Proceso: ${p.titulo}`,
    '',
    `> ${p.resumen}`,
    '',
    `**Roles que participan:** ${p.actores.map(roleLabel).join(' · ')}`,
    '',
    '## Paso a paso',
    '',
    '| # | Rol | Acción |',
    '| --- | --- | --- |',
    ...p.pasos.map((s, i) => `| ${i + 1} | ${roleLabel(s.actor)} | ${s.texto} |`),
    '',
    '## Estados involucrados',
    '',
    p.estados,
    '',
  ]
  return lines.join('\n')
}

function formatFunctionsManualMarkdown() {
  const lines = [
    '# Funciones y acciones (quién puede qué)',
    '',
    '> Referencia rápida para soporte: cada acción del WMS, los roles que la pueden ejecutar, dónde se hace y su efecto.',
    '',
    '| Acción | Roles permitidos | Dónde | Efecto |',
    '| --- | --- | --- | --- |',
    ...MANUAL_FUNCTIONS.map(
      (f) => `| ${f.accion} | ${f.roles.map(roleLabel).join(', ')} | ${f.donde} | ${f.efecto} |`,
    ),
    '',
  ]
  return lines.join('\n')
}

/** Devuelve el markdown de una entrada del manual por su id. */
export function getManualMarkdown(entryId) {
  const entry = getManualEntry(entryId)
  if (!entry) return ''
  if (entry.category === 'roles') return formatRoleManualMarkdown(entry.roleId)
  if (entry.category === 'procesos') return formatProcessManualMarkdown(entry.processId)
  if (entry.category === 'funciones') return formatFunctionsManualMarkdown()
  return ''
}

/** Manual completo concatenado (para descarga/indexación). */
export function formatFullManualMarkdown() {
  const parts = [
    '# Manual de Usuario — Polaria WMS',
    '',
    'Guía por rol, proceso y función del WMS Bodega de Frío. Pensado como base de conocimiento para el soporte (Mateo) y el onboarding del equipo.',
    '',
    '---',
    '',
  ]
  for (const r of WMS_ROLES) {
    parts.push(formatRoleManualMarkdown(r.id), '', '---', '')
  }
  for (const p of MANUAL_PROCESS_GUIDES) {
    parts.push(formatProcessManualMarkdown(p.id), '', '---', '')
  }
  parts.push(formatFunctionsManualMarkdown())
  return parts.join('\n')
}
