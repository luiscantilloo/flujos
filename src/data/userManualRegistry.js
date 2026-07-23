/**
 * Índice del Manual de usuario — Mateo Support y operación.
 * Archivos en `/public/docs/manual-usuario/`.
 */

export const USER_MANUAL_CATEGORIES = [
  {
    id: 'roles',
    label: 'Manuales por rol',
    description: 'Qué ve y qué puede hacer cada perfil en Polaria WMS.',
  },
  {
    id: 'procesos',
    label: 'Procesos de negocio',
    description: 'Flujos end-to-end: compras, inventario, ventas, transporte…',
  },
  {
    id: 'soporte',
    label: 'Soporte Mateo',
    description: 'Preguntas frecuentes, errores comunes y glosario rápido.',
  },
]

export const userManualItems = [
  // —— Roles ——
  {
    id: 'rol-configurador',
    category: 'roles',
    title: 'Configurador (TI)',
    summary: 'Panel de plataforma: empresas, cuentas, bodegas y usuarios cross-tenant.',
    filePath: '/docs/manual-usuario/roles/configurador.md',
    roleId: 'configurador',
    keywords: ['configurador', 'plataforma', 'empresa', 'onboarding', 'ti'],
  },
  {
    id: 'rol-administrador-cuenta',
    category: 'roles',
    title: 'Administrador de cuenta',
    summary: 'Catálogos, proveedores, clientes, usuarios y bodegas del tenant.',
    filePath: '/docs/manual-usuario/roles/administrador-cuenta.md',
    roleId: 'administrador_cuenta',
    keywords: ['admin', 'cuenta', 'catálogo', 'proveedor', 'cliente'],
  },
  {
    id: 'rol-operador-cuenta',
    category: 'roles',
    title: 'Operador de cuenta',
    summary: 'SOL, OC, OV, integración externa y procesamiento a nivel comercial.',
    filePath: '/docs/manual-usuario/roles/operador-cuenta.md',
    roleId: 'operador_cuenta',
    keywords: ['operador', 'compras', 'ventas', 'solicitud'],
  },
  {
    id: 'rol-administrador-bodega',
    category: 'roles',
    title: 'Administrador de bodega',
    summary: 'Supervisión del grid de bodega, reportes y permisos de escritura.',
    filePath: '/docs/manual-usuario/roles/administrador-bodega.md',
    roleId: 'administrador_bodega',
    keywords: ['admin bodega', 'estado bodega', 'reportes'],
  },
  {
    id: 'rol-jefe-bodega',
    category: 'roles',
    title: 'Jefe de bodega',
    summary: 'Ingresos, salidas, transferencias, asignación de operarios y procesamiento.',
    filePath: '/docs/manual-usuario/roles/jefe-bodega.md',
    roleId: 'jefe_bodega',
    keywords: ['jefe', 'ingreso', 'salida', 'transferencia', 'asignar'],
  },
  {
    id: 'rol-custodio',
    category: 'roles',
    title: 'Custodio',
    summary: 'Recepción física, OC en piso, OV y paquetes de despacho.',
    filePath: '/docs/manual-usuario/roles/custodio.md',
    roleId: 'custodio',
    keywords: ['custodio', 'recepción', 'muelle', 'ingreso'],
  },
  {
    id: 'rol-operario',
    category: 'roles',
    title: 'Operario',
    summary: 'Cola de tareas, movimientos de cajas, lock de posiciones y llamada al jefe.',
    filePath: '/docs/manual-usuario/roles/operario.md',
    roleId: 'operario',
    keywords: ['operario', 'tarea', 'picking', 'movimiento'],
  },
  {
    id: 'rol-procesador',
    category: 'roles',
    title: 'Procesador',
    summary: 'Cierre de solicitudes de procesamiento y declaración de merma.',
    filePath: '/docs/manual-usuario/roles/procesador.md',
    roleId: 'procesador',
    keywords: ['procesador', 'merma', 'transformación', 'primario'],
  },
  {
    id: 'rol-transportista',
    category: 'roles',
    title: 'Transportista',
    summary: 'Guías de envío, entregas y evidencias (foto, firma).',
    filePath: '/docs/manual-usuario/roles/transportista.md',
    roleId: 'transportista',
    keywords: ['transportista', 'entrega', 'viaje', 'evidencia'],
  },
  // —— Procesos ——
  {
    id: 'proceso-compras',
    category: 'procesos',
    title: 'Compras: SOL → OC → Recepción',
    summary: 'Ciclo completo de solicitud de compra hasta stock en bodega.',
    filePath: '/docs/manual-usuario/procesos/compras-sol-oc-recepcion.md',
    keywords: ['sol', 'oc', 'orden compra', 'recepción', 'proveedor'],
  },
  {
    id: 'proceso-inventario',
    category: 'procesos',
    title: 'Inventario y mapa en vivo',
    summary: 'warehouse_state, Realtime, lock/unlock y FEFO.',
    filePath: '/docs/manual-usuario/procesos/inventario-mapa.md',
    keywords: ['mapa', 'inventario', 'slot', 'lock', 'fefo'],
  },
  {
    id: 'proceso-procesamiento',
    category: 'procesos',
    title: 'Procesamiento (frío)',
    summary: 'Primario a secundario, merma, OT post-cierre.',
    filePath: '/docs/manual-usuario/procesos/procesamiento-frio.md',
    keywords: ['procesamiento', 'merma', 'transformación'],
  },
  {
    id: 'proceso-ventas',
    category: 'procesos',
    title: 'Ventas y despacho',
    summary: 'OV, reserva de stock, picking y salida a muelle.',
    filePath: '/docs/manual-usuario/procesos/ventas-despacho.md',
    keywords: ['ov', 'orden venta', 'despacho', 'picking'],
  },
  {
    id: 'proceso-transporte',
    category: 'procesos',
    title: 'Transporte y entregas',
    summary: 'Paquetes de despacho, viajes y evidencias de entrega.',
    filePath: '/docs/manual-usuario/procesos/transporte-entregas.md',
    keywords: ['transporte', 'guía', 'entrega', 'cloudinary'],
  },
  {
    id: 'proceso-integracion',
    category: 'procesos',
    title: 'Integración bodega externa',
    summary: 'Solicitudes scraping/API/CSV y bandeja del configurador.',
    filePath: '/docs/manual-usuario/procesos/integracion-bodega-externa.md',
    keywords: ['integración', 'externa', 'fridem', 'scraping'],
  },
  {
    id: 'proceso-mateo',
    category: 'procesos',
    title: 'Mateo Support (widget)',
    summary: 'Chat embebido, tokens, historial y escalamiento a soporte humano.',
    filePath: '/docs/manual-usuario/procesos/mateo-support.md',
    keywords: ['mateo', 'widget', 'chat', 'soporte', 'n8n'],
  },
  // —— Soporte ——
  {
    id: 'soporte-faq',
    category: 'soporte',
    title: 'Preguntas frecuentes',
    summary: 'Respuestas rápidas para Mateo Support sobre login, roles y errores.',
    filePath: '/docs/manual-usuario/soporte/preguntas-frecuentes.md',
    keywords: ['faq', 'error', 'login', 'no puedo'],
  },
  {
    id: 'soporte-glosario',
    category: 'soporte',
    title: 'Glosario rápido',
    summary: 'Siglas y términos WMS en lenguaje simple.',
    filePath: '/docs/manual-usuario/soporte/glosario-rapido.md',
    keywords: ['glosario', 'sol', 'oc', 'ov', 'ot', 'tenant'],
  },
]

export function getUserManualItemById(id) {
  return userManualItems.find((d) => d.id === id) ?? null
}

export function getUserManualItemsByCategory(categoryId) {
  return userManualItems.filter((d) => d.category === categoryId)
}
