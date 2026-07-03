/**
 * Ítems de sidebar por rol — usa frioPaths (no strings sueltos).
 */
import { frioPaths } from './paths.js'

/** @typedef {{ label: string, href: string, icon?: string }} NavItem */

/** @type {Record<string, NavItem[]>} */
export const NAVIGATION_BY_ROLE = {
  configurador: [
    { label: 'Inicio', href: frioPaths.dashboard },
    { label: 'Empresas', href: frioPaths.configuracion.empresas },
    { label: 'Tenants', href: frioPaths.configuracion.tenants },
    { label: 'Bodegas', href: frioPaths.configuracion.bodegas },
    { label: 'Usuarios', href: frioPaths.configuracion.usuarios },
  ],

  administrador_cuenta: [
    { label: 'Inicio', href: frioPaths.dashboard },
    { label: 'SOL / OC', href: frioPaths.ingreso.solicitudesCompra },
    { label: 'Órdenes de compra', href: frioPaths.ingreso.ordenesCompra },
    { label: 'Órdenes de venta', href: frioPaths.ventas.ordenesVenta },
    { label: 'Catálogo productos', href: frioPaths.configuracion.catalogos.productos },
    { label: 'Proveedores', href: frioPaths.configuracion.catalogos.proveedores },
    { label: 'Compradores', href: frioPaths.configuracion.catalogos.compradores },
    { label: 'Usuarios', href: frioPaths.configuracion.usuarios },
    { label: 'Bodegas', href: frioPaths.configuracion.bodegas },
    { label: 'Reportes', href: frioPaths.reportes.root },
  ],

  operador_cuenta: [
    { label: 'Inicio', href: frioPaths.dashboard },
    { label: 'Solicitudes de compra', href: frioPaths.ingreso.solicitudesCompra },
    { label: 'Órdenes de compra', href: frioPaths.ingreso.ordenesCompra },
    { label: 'Órdenes de venta', href: frioPaths.ventas.ordenesVenta },
    { label: 'Procesamiento', href: frioPaths.procesamiento.root },
  ],

  administrador_bodega: [
    { label: 'Mapa', href: frioPaths.mapa.root },
    { label: 'Ingreso', href: frioPaths.ingreso.root },
    { label: 'Reportes', href: frioPaths.reportes.root },
  ],

  jefe_bodega: [
    { label: 'Inicio', href: frioPaths.dashboard },
    { label: 'Mapa', href: frioPaths.mapa.root },
    { label: 'Cola operativa', href: frioPaths.mapa.cola },
    { label: 'Recepción', href: frioPaths.ingreso.recepcion },
    { label: 'Procesamiento', href: frioPaths.procesamiento.root },
    { label: 'Picking', href: frioPaths.ventas.picking },
    { label: 'Salida', href: frioPaths.ventas.salida },
    { label: 'Transporte', href: frioPaths.transporte.root },
  ],

  custodio: [
    { label: 'Recepción', href: frioPaths.ingreso.recepcion },
    { label: 'Cajas entrada', href: frioPaths.ingreso.cajas },
    { label: 'Mapa', href: frioPaths.mapa.root },
    { label: 'Salida', href: frioPaths.ventas.salida },
    { label: 'Transporte', href: frioPaths.transporte.root },
  ],

  operario: [
    { label: 'Cola operativa', href: frioPaths.mapa.cola },
    { label: 'Mapa', href: frioPaths.mapa.root },
  ],

  procesador: [
    { label: 'Procesamiento', href: frioPaths.procesamiento.root },
    { label: 'Mapa', href: frioPaths.mapa.root },
  ],

  transportista: [
    { label: 'Viajes', href: frioPaths.transporte.viajes },
    { label: 'Transporte', href: frioPaths.transporte.root },
  ],
}

export function getNavigationForRole(roleId) {
  return NAVIGATION_BY_ROLE[roleId] ?? [{ label: 'Inicio', href: frioPaths.dashboard }]
}
