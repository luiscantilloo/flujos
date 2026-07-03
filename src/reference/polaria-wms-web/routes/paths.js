/**
 * Rutas URL del WMS — espejo de app/ (App Router).
 * Los grupos (auth) y (dashboard) no aparecen en la URL.
 * Copiar a polaria-wms-web/routes/paths.ts (referencia Dev Hub).
 */

const enc = (v) => encodeURIComponent(String(v))

export const frioPaths = {
  root: '/',

  auth: {
    login: '/login',
    recuperar: '/recuperar',
    plataforma: '/plataforma',
  },

  dashboard: '/',

  ingreso: {
    root: '/ingreso',
    recepcion: '/ingreso/recepcion',
    recepcionOc: (ocId) => `/ingreso/recepcion/${enc(ocId)}`,
    ordenesCompra: '/ingreso/ordenes-compra',
    ordenCompraNueva: '/ingreso/ordenes-compra/nueva',
    ordenCompra: (ocId) => `/ingreso/ordenes-compra/${enc(ocId)}`,
    solicitudesCompra: '/ingreso/solicitudes-compra',
    solicitudCompraNueva: '/ingreso/solicitudes-compra/nueva',
    solicitudCompra: (solId) => `/ingreso/solicitudes-compra/${enc(solId)}`,
    cajas: '/ingreso/cajas',
  },

  mapa: {
    root: '/mapa',
    cola: '/mapa/cola',
    ordenTrabajo: (ordenId) => `/mapa/cola/${enc(ordenId)}`,
    slot: (slotId) => `/mapa/slot/${enc(slotId)}`,
  },

  procesamiento: {
    root: '/procesamiento',
    solicitudes: '/procesamiento/solicitudes',
    solicitudNueva: '/procesamiento/solicitudes/nueva',
    solicitud: (id) => `/procesamiento/solicitudes/${enc(id)}`,
  },

  ventas: {
    ordenesVenta: '/ventas/ordenes-venta',
    ordenVentaNueva: '/ventas/ordenes-venta/nueva',
    ordenVenta: (ovId) => `/ventas/ordenes-venta/${enc(ovId)}`,
    picking: '/ventas/picking',
    salida: '/ventas/salida',
  },

  transporte: {
    root: '/transporte',
    viajes: '/transporte/viajes',
    viaje: (tvId) => `/transporte/viajes/${enc(tvId)}`,
  },

  configuracion: {
    empresas: '/configuracion/empresas',
    empresaNueva: '/configuracion/empresas/nueva',
    empresa: (codigoEmpresa) => `/configuracion/empresas/${enc(codigoEmpresa)}`,
    tenants: '/configuracion/tenants',
    tenantNuevo: '/configuracion/tenants/nuevo',
    tenant: (codeCuenta) => `/configuracion/tenants/${enc(codeCuenta)}`,
    bodegas: '/configuracion/bodegas',
    bodegaNueva: '/configuracion/bodegas/nueva',
    bodega: (warehouseId) => `/configuracion/bodegas/${enc(warehouseId)}`,
    usuarios: '/configuracion/usuarios',
    usuarioNuevo: '/configuracion/usuarios/nuevo',
    usuario: (uid) => `/configuracion/usuarios/${enc(uid)}`,
    catalogos: {
      productos: '/configuracion/catalogos/productos',
      clientes: '/configuracion/catalogos/clientes',
      proveedores: '/configuracion/catalogos/proveedores',
      compradores: '/configuracion/catalogos/compradores',
      camiones: '/configuracion/catalogos/camiones',
      plantas: '/configuracion/catalogos/plantas',
    },
  },

  reportes: {
    root: '/reportes',
    exportar: '/reportes/exportar',
    merma: '/reportes/merma',
    ocupacion: '/reportes/ocupacion',
  },

  api: {
    pedidoProveedor: '/api/pedido-proveedor',
    evidenciaTransporte: '/api/evidencia-transporte',
    health: '/api/health',
  },
}

/** Rutas públicas (sin sesión de dashboard). */
export const FRIO_PUBLIC_PATHS = new Set([
  frioPaths.auth.login,
  frioPaths.auth.recuperar,
  frioPaths.auth.plataforma,
  frioPaths.api.health,
])

/** Prefijos solo configurador (plataforma). */
export const FRIO_PLATAFORMA_PREFIXES = [
  '/configuracion/empresas',
  '/configuracion/tenants',
  frioPaths.auth.plataforma,
]
