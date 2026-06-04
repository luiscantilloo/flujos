/**
 * Roles operativos del WMS — definición acordada con el negocio y el paso a paso.
 * @typedef {'plataforma'|'cuenta'|'bodega'} RolNivel
 */

export const WMS_ROLES = [
  {
    id: 'configurador',
    codigo: 'configurador',
    nombre: 'Configurador (TI)',
    nivel: 'plataforma',
    descripcion:
      'Equipo TI del proveedor SaaS con credenciales propias (Supabase Auth). Inicia sesión en el panel de plataforma, crea empresas y asigna el administrador de cuenta de cada cliente.',
    creadoPor: null,
    pasoAPaso: ['config-empresa', 'config-tenant', 'estructura', 'ti-admin'],
  },
  {
    id: 'administrador_cuenta',
    codigo: 'administrador_cuenta',
    nombre: 'Administrador de cuenta',
    nivel: 'cuenta',
    descripcion:
      'Responsable del cliente, creado por TI y vinculado a codigoEmpresa. Ingresa con login V2 (empresa + usuario + contraseña). Gestiona tenant, catálogos y equipo.',
    creadoPor: 'configurador',
    pasoAPaso: ['rbac', 'admin-cuenta', 'strip-oc', 'orden-venta', 'proveedor'],
  },
  {
    id: 'operador_cuenta',
    codigo: 'operador_cuenta',
    nombre: 'Operador de cuenta',
    nivel: 'cuenta',
    descripcion:
      'Opera el tenant a nivel comercial: SOL, OC, OV. Lo crea el administrador de cuenta.',
    creadoPor: 'administrador_cuenta',
    pasoAPaso: ['strip-oc', 'orden-venta'],
  },
  {
    id: 'administrador_bodega',
    codigo: 'administrador_bodega',
    nombre: 'Administrador de bodega',
    nivel: 'bodega',
    descripcion: 'Responsable de la bodega asignada a la empresa: configuración operativa y supervisión.',
    creadoPor: 'administrador_cuenta',
    pasoAPaso: ['estructura', 'monitor-alertas'],
  },
  {
    id: 'jefe_bodega',
    codigo: 'jefe_bodega',
    nombre: 'Jefe de bodega',
    nivel: 'bodega',
    descripcion: 'Jefe operativo de la bodega: prioriza órdenes de trabajo, alertas, override de temperatura.',
    creadoPor: 'administrador_cuenta',
    pasoAPaso: ['conteo-ciego', 'temperatura-ingreso', 'inbound-boxes', 'monitor-alertas', 'procesamiento'],
  },
  {
    id: 'custodio',
    codigo: 'custodio',
    nombre: 'Custodio',
    nivel: 'bodega',
    descripcion: 'Recibe mercancía, valida documentos y temperatura, y despacha salidas en muelle.',
    creadoPor: 'administrador_cuenta',
    pasoAPaso: [
      'transporte-in',
      'conteo-ciego',
      'documentos',
      'temperatura-ingreso',
      'inspeccion',
      'inbound-boxes',
      'salida-cruzada',
      'despacho',
    ],
  },
  {
    id: 'operario',
    codigo: 'operario',
    nombre: 'Operario',
    nivel: 'bodega',
    descripcion: 'Ejecuta órdenes de trabajo y movimientos de cajas/slots en la bodega.',
    creadoPor: 'administrador_cuenta',
    pasoAPaso: ['inspeccion', 'inbound-boxes', 'locking', 'despacho'],
  },
  {
    id: 'procesador',
    codigo: 'procesador',
    nombre: 'Procesador',
    nivel: 'bodega',
    descripcion: 'Encargado de la línea de procesamiento (primario → secundario, merma).',
    creadoPor: 'administrador_cuenta',
    pasoAPaso: ['procesamiento'],
  },
  {
    id: 'transportista',
    codigo: 'transportista',
    nombre: 'Transportista',
    nivel: 'bodega',
    descripcion: 'Conduce viajes TV, registra entregas y evidencias (foto, firma, GPS).',
    creadoPor: 'administrador_cuenta',
    pasoAPaso: ['transporte-in', 'salida-cruzada', 'despacho', 'entrega'],
  },
]

export const WMS_ROLE_BY_ID = Object.fromEntries(WMS_ROLES.map((r) => [r.id, r]))

export function getWmsRole(id) {
  return WMS_ROLE_BY_ID[id] ?? null
}

export function getRolesByNivel(nivel) {
  return WMS_ROLES.filter((r) => r.nivel === nivel)
}

/** Etiqueta legible para UI (paso a paso, diagramas) */
export function formatRoleLabel(roleId) {
  return WMS_ROLE_BY_ID[roleId]?.nombre ?? roleId
}
