/**
 * Índice del Manual de usuario — Polaria WMS.
 * Archivos en `/public/docs/manual-usuario/`.
 */

export const USER_MANUAL_CATEGORIES = [
  {
    id: 'inicio',
    label: 'Empieza aquí',
    description: 'Cómo entrar al sistema y cómo elegir tu guía.',
  },
  {
    id: 'roles',
    label: 'Mi rol',
    description: 'Elige tu cargo. Ahí está el paso a paso de tu día a día.',
  },
  {
    id: 'procesos',
    label: 'Cómo se hace cada trabajo',
    description: 'La cadena completa: compras, mapa, ventas, transporte…',
  },
  {
    id: 'soporte',
    label: 'Ayuda',
    description: 'Si algo no sale, busca aquí. Palabras del sistema en lenguaje simple.',
  },
]

export const userManualItems = [
  {
    id: 'empezar',
    category: 'inicio',
    title: 'Cómo entrar y usar este manual',
    summary: 'Login, qué pantalla te toca y las palabras que vas a oír (SOL, OC, OV, mapa).',
    filePath: '/docs/manual-usuario/empezar.md',
    keywords: ['entrar', 'login', 'empezar', 'inicio', 'correo', 'contraseña', 'rol'],
  },
  {
    id: 'rol-configurador',
    category: 'roles',
    title: 'Configurador (TI)',
    summary: 'Crear empresas, cuentas, bodegas y el primer administrador. Panel de plataforma.',
    filePath: '/docs/manual-usuario/roles/configurador.md',
    roleId: 'configurador',
    keywords: ['configurador', 'plataforma', 'empresa', 'onboarding', 'ti'],
  },
  {
    id: 'rol-administrador-cuenta',
    category: 'roles',
    title: 'Administrador de cuenta',
    summary: 'Armar el equipo, catálogo, proveedores, clientes y aprobar compras.',
    filePath: '/docs/manual-usuario/roles/administrador-cuenta.md',
    roleId: 'administrador_cuenta',
    keywords: ['admin', 'cuenta', 'catálogo', 'proveedor', 'cliente', 'usuarios'],
  },
  {
    id: 'rol-operador-cuenta',
    category: 'roles',
    title: 'Operador de cuenta',
    summary: 'Pedir compras, emitir órdenes al proveedor y armar ventas.',
    filePath: '/docs/manual-usuario/roles/operador-cuenta.md',
    roleId: 'operador_cuenta',
    keywords: ['operador', 'compras', 'ventas', 'solicitud', 'proveedor'],
  },
  {
    id: 'rol-administrador-bodega',
    category: 'roles',
    title: 'Administrador de bodega',
    summary: 'Ver el estado de la bodega, el mapa y los reportes. Supervisar, no mover cajas.',
    filePath: '/docs/manual-usuario/roles/administrador-bodega.md',
    roleId: 'administrador_bodega',
    keywords: ['admin bodega', 'estado bodega', 'reportes', 'mapa'],
  },
  {
    id: 'rol-jefe-bodega',
    category: 'roles',
    title: 'Jefe de bodega',
    summary: 'Ingresos, transferencias, salidas y coordinar al equipo de piso.',
    filePath: '/docs/manual-usuario/roles/jefe-bodega.md',
    roleId: 'jefe_bodega',
    keywords: ['jefe', 'ingreso', 'salida', 'transferencia', 'asignar'],
  },
  {
    id: 'rol-custodio',
    category: 'roles',
    title: 'Custodio',
    summary: 'Recibir en muelle, registrar temperatura y armar el despacho.',
    filePath: '/docs/manual-usuario/roles/custodio.md',
    roleId: 'custodio',
    keywords: ['custodio', 'recepción', 'muelle', 'ingreso', 'despacho'],
  },
  {
    id: 'rol-operario',
    category: 'roles',
    title: 'Operario',
    summary: 'Cumplir las tareas del día: mover cajas, picking y llamar al jefe si hace falta.',
    filePath: '/docs/manual-usuario/roles/operario.md',
    roleId: 'operario',
    keywords: ['operario', 'tarea', 'picking', 'movimiento', 'llamar'],
  },
  {
    id: 'rol-procesador',
    category: 'roles',
    title: 'Procesador',
    summary: 'Cerrar el procesamiento: declarar merma y dejar el producto listo.',
    filePath: '/docs/manual-usuario/roles/procesador.md',
    roleId: 'procesador',
    keywords: ['procesador', 'merma', 'transformación', 'primario'],
  },
  {
    id: 'rol-transportista',
    category: 'roles',
    title: 'Transportista',
    summary: 'Ver las guías del viaje, entregar y sacar foto y firma.',
    filePath: '/docs/manual-usuario/roles/transportista.md',
    roleId: 'transportista',
    keywords: ['transportista', 'entrega', 'viaje', 'evidencia', 'firma'],
  },
  {
    id: 'proceso-compras',
    category: 'procesos',
    title: 'Compras: de la solicitud al ingreso',
    summary: 'Pedir, aprobar, emitir al proveedor y recibir en bodega.',
    filePath: '/docs/manual-usuario/procesos/compras-sol-oc-recepcion.md',
    keywords: ['sol', 'oc', 'orden compra', 'recepción', 'proveedor'],
  },
  {
    id: 'proceso-inventario',
    category: 'procesos',
    title: 'Inventario y mapa',
    summary: 'Cómo leer el mapa, bloquear un casillero y qué significa “en vivo”.',
    filePath: '/docs/manual-usuario/procesos/inventario-mapa.md',
    keywords: ['mapa', 'inventario', 'slot', 'lock', 'fefo', 'casillero'],
  },
  {
    id: 'proceso-procesamiento',
    category: 'procesos',
    title: 'Procesamiento en frío',
    summary: 'De producto primario a secundario, merma y volver a guardar.',
    filePath: '/docs/manual-usuario/procesos/procesamiento-frio.md',
    keywords: ['procesamiento', 'merma', 'transformación'],
  },
  {
    id: 'proceso-ventas',
    category: 'procesos',
    title: 'Ventas y despacho',
    summary: 'Crear la orden, emitirla, preparar en piso y sacar al muelle.',
    filePath: '/docs/manual-usuario/procesos/ventas-despacho.md',
    keywords: ['ov', 'orden venta', 'despacho', 'picking', 'precio'],
  },
  {
    id: 'proceso-transporte',
    category: 'procesos',
    title: 'Transporte y entregas',
    summary: 'Del paquete de despacho a la entrega con foto y firma.',
    filePath: '/docs/manual-usuario/procesos/transporte-entregas.md',
    keywords: ['transporte', 'guía', 'entrega', 'foto', 'firma'],
  },
  {
    id: 'proceso-integracion',
    category: 'procesos',
    title: 'Bodega externa',
    summary: 'Pedir a TI que conecte una bodega de terceros (por ejemplo Fridem).',
    filePath: '/docs/manual-usuario/procesos/integracion-bodega-externa.md',
    keywords: ['integración', 'externa', 'fridem'],
  },
  {
    id: 'proceso-mateo',
    category: 'procesos',
    title: 'Mateo (chat de ayuda)',
    summary: 'La burbuja de chat: cómo preguntar y qué hacer si no responde.',
    filePath: '/docs/manual-usuario/procesos/mateo-support.md',
    keywords: ['mateo', 'widget', 'chat', 'soporte', 'ayuda'],
  },
  {
    id: 'soporte-faq',
    category: 'soporte',
    title: 'No me deja… (preguntas frecuentes)',
    summary: 'Login, botones que no aparecen, mapa, ventas y chat.',
    filePath: '/docs/manual-usuario/soporte/preguntas-frecuentes.md',
    keywords: ['faq', 'error', 'login', 'no puedo', 'ayuda'],
  },
  {
    id: 'soporte-glosario',
    category: 'soporte',
    title: 'Glosario rápido',
    summary: 'SOL, OC, OV, merma, mapa y el resto, en una línea cada uno.',
    filePath: '/docs/manual-usuario/soporte/glosario-rapido.md',
    keywords: ['glosario', 'sol', 'oc', 'ov', 'ot', 'palabras'],
  },
]

export function getUserManualItemById(id) {
  return userManualItems.find((d) => d.id === id) ?? null
}

export function getUserManualItemsByCategory(categoryId) {
  return userManualItems.filter((d) => d.category === categoryId)
}
