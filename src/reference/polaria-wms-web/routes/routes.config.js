/**
 * Registro de rutas del WMS: id estable, path, app/ destino, roles y metadata UI.
 */
import { frioPaths } from './paths.js'

/** @typedef {'plataforma'|'cuenta'|'bodega'|'api'} RouteScope */

/**
 * @typedef {Object} FrioRouteDef
 * @property {string} id
 * @property {string} path
 * @property {string} appSegment — carpeta bajo app/(dashboard)/ o (auth)/
 * @property {RouteScope} scope
 * @property {string[]} roles — ids WMS; '*' = cualquier autenticado del scope
 * @property {string} label
 * @property {boolean} [sidebar]
 */

/** @type {FrioRouteDef[]} */
export const FRIO_ROUTE_REGISTRY = [
  // —— Auth ——
  {
    id: 'auth.login',
    path: frioPaths.auth.login,
    appSegment: 'app/(auth)/login/page.tsx',
    scope: 'plataforma',
    roles: ['*'],
    label: 'Login empresa',
    sidebar: false,
  },
  {
    id: 'auth.plataforma',
    path: frioPaths.auth.plataforma,
    appSegment: 'app/(auth)/plataforma/page.tsx',
    scope: 'plataforma',
    roles: ['configurador'],
    label: 'Login configurador TI',
    sidebar: false,
  },
  {
    id: 'auth.recuperar',
    path: frioPaths.auth.recuperar,
    appSegment: 'app/(auth)/recuperar/page.tsx',
    scope: 'plataforma',
    roles: ['*'],
    label: 'Recuperar contraseña',
    sidebar: false,
  },

  // —— Dashboard ——
  {
    id: 'dashboard.home',
    path: frioPaths.dashboard,
    appSegment: 'app/(dashboard)/page.tsx',
    scope: 'bodega',
    roles: ['*'],
    label: 'Inicio',
    sidebar: true,
  },

  // —— Ingreso ——
  {
    id: 'ingreso.root',
    path: frioPaths.ingreso.root,
    appSegment: 'app/(dashboard)/ingreso/page.tsx',
    scope: 'bodega',
    roles: ['custodio', 'jefe_bodega', 'administrador_bodega', 'operador_cuenta', 'administrador_cuenta'],
    label: 'Ingreso',
    sidebar: true,
  },
  {
    id: 'ingreso.recepcion',
    path: frioPaths.ingreso.recepcion,
    appSegment: 'app/(dashboard)/ingreso/recepcion/page.tsx',
    scope: 'bodega',
    roles: ['custodio', 'jefe_bodega'],
    label: 'Recepción',
    sidebar: true,
  },
  {
    id: 'ingreso.oc',
    path: frioPaths.ingreso.ordenesCompra,
    appSegment: 'app/(dashboard)/ingreso/ordenes-compra/page.tsx',
    scope: 'cuenta',
    roles: ['operador_cuenta', 'administrador_cuenta'],
    label: 'Órdenes de compra',
    sidebar: true,
  },
  {
    id: 'ingreso.sol',
    path: frioPaths.ingreso.solicitudesCompra,
    appSegment: 'app/(dashboard)/ingreso/solicitudes-compra/page.tsx',
    scope: 'cuenta',
    roles: ['operador_cuenta', 'administrador_cuenta'],
    label: 'Solicitudes de compra',
    sidebar: true,
  },
  {
    id: 'ingreso.cajas',
    path: frioPaths.ingreso.cajas,
    appSegment: 'app/(dashboard)/ingreso/cajas/page.tsx',
    scope: 'bodega',
    roles: ['custodio', 'jefe_bodega'],
    label: 'Cajas en entrada',
    sidebar: true,
  },

  // —— Mapa ——
  {
    id: 'mapa.root',
    path: frioPaths.mapa.root,
    appSegment: 'app/(dashboard)/mapa/page.tsx',
    scope: 'bodega',
    roles: ['operario', 'jefe_bodega', 'custodio', 'administrador_bodega', 'procesador'],
    label: 'Mapa de bodega',
    sidebar: true,
  },
  {
    id: 'mapa.cola',
    path: frioPaths.mapa.cola,
    appSegment: 'app/(dashboard)/mapa/cola/page.tsx',
    scope: 'bodega',
    roles: ['operario', 'jefe_bodega'],
    label: 'Cola operativa',
    sidebar: true,
  },

  // —— Procesamiento ——
  {
    id: 'procesamiento.root',
    path: frioPaths.procesamiento.root,
    appSegment: 'app/(dashboard)/procesamiento/page.tsx',
    scope: 'bodega',
    roles: ['procesador', 'jefe_bodega', 'operador_cuenta', 'administrador_cuenta'],
    label: 'Procesamiento',
    sidebar: true,
  },

  // —— Ventas ——
  {
    id: 'ventas.ov',
    path: frioPaths.ventas.ordenesVenta,
    appSegment: 'app/(dashboard)/ventas/ordenes-venta/page.tsx',
    scope: 'cuenta',
    roles: ['operador_cuenta', 'administrador_cuenta'],
    label: 'Órdenes de venta',
    sidebar: true,
  },
  {
    id: 'ventas.picking',
    path: frioPaths.ventas.picking,
    appSegment: 'app/(dashboard)/ventas/picking/page.tsx',
    scope: 'bodega',
    roles: ['jefe_bodega', 'custodio', 'operario'],
    label: 'Picking',
    sidebar: true,
  },
  {
    id: 'ventas.salida',
    path: frioPaths.ventas.salida,
    appSegment: 'app/(dashboard)/ventas/salida/page.tsx',
    scope: 'bodega',
    roles: ['custodio', 'jefe_bodega'],
    label: 'Zona de salida',
    sidebar: true,
  },

  // —— Transporte ——
  {
    id: 'transporte.root',
    path: frioPaths.transporte.root,
    appSegment: 'app/(dashboard)/transporte/page.tsx',
    scope: 'bodega',
    roles: ['transportista', 'jefe_bodega', 'custodio'],
    label: 'Transporte',
    sidebar: true,
  },

  // —— Configuración ——
  {
    id: 'config.empresas',
    path: frioPaths.configuracion.empresas,
    appSegment: 'app/(dashboard)/configuracion/empresas/page.tsx',
    scope: 'plataforma',
    roles: ['configurador'],
    label: 'Empresas',
    sidebar: true,
  },
  {
    id: 'config.tenants',
    path: frioPaths.configuracion.tenants,
    appSegment: 'app/(dashboard)/configuracion/tenants/page.tsx',
    scope: 'plataforma',
    roles: ['configurador'],
    label: 'Tenants',
    sidebar: true,
  },
  {
    id: 'config.bodegas',
    path: frioPaths.configuracion.bodegas,
    appSegment: 'app/(dashboard)/configuracion/bodegas/page.tsx',
    scope: 'plataforma',
    roles: ['configurador', 'administrador_bodega', 'administrador_cuenta'],
    label: 'Bodegas',
    sidebar: true,
  },
  {
    id: 'config.usuarios',
    path: frioPaths.configuracion.usuarios,
    appSegment: 'app/(dashboard)/configuracion/usuarios/page.tsx',
    scope: 'cuenta',
    roles: ['administrador_cuenta', 'configurador'],
    label: 'Usuarios',
    sidebar: true,
  },
  {
    id: 'config.catalogos.productos',
    path: frioPaths.configuracion.catalogos.productos,
    appSegment: 'app/(dashboard)/configuracion/catalogos/productos/page.tsx',
    scope: 'cuenta',
    roles: ['administrador_cuenta', 'operador_cuenta'],
    label: 'Productos',
    sidebar: true,
  },

  // —— Reportes ——
  {
    id: 'reportes.root',
    path: frioPaths.reportes.root,
    appSegment: 'app/(dashboard)/reportes/page.tsx',
    scope: 'cuenta',
    roles: ['administrador_cuenta', 'operador_cuenta', 'administrador_bodega'],
    label: 'Reportes',
    sidebar: true,
  },

  // —— API (Route Handlers) ——
  {
    id: 'api.pedido',
    path: frioPaths.api.pedidoProveedor,
    appSegment: 'app/api/pedido-proveedor/route.ts',
    scope: 'api',
    roles: ['*'],
    label: 'API pedido proveedor',
    sidebar: false,
  },
  {
    id: 'api.evidencia',
    path: frioPaths.api.evidenciaTransporte,
    appSegment: 'app/api/evidencia-transporte/route.ts',
    scope: 'api',
    roles: ['*'],
    label: 'API evidencia transporte',
    sidebar: false,
  },
]

export function getRouteByPath(pathname) {
  const normalized = pathname.split('?')[0].replace(/\/$/, '') || '/'
  return (
    FRIO_ROUTE_REGISTRY.find((r) => r.path === normalized) ??
    FRIO_ROUTE_REGISTRY.find((r) => normalized.startsWith(r.path + '/'))
  )
}

export function getRouteById(id) {
  return FRIO_ROUTE_REGISTRY.find((r) => r.id === id) ?? null
}
