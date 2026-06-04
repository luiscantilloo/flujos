/**
 * Guards de ruta — middleware.ts y RoleGate importan desde aquí.
 */
import { FRIO_PLATAFORMA_PREFIXES, FRIO_PUBLIC_PATHS, frioPaths } from './paths.js'
import { getRouteByPath } from './routes.config.js'

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function isPublicPath(pathname) {
  const base = pathname.split('?')[0]
  if (FRIO_PUBLIC_PATHS.has(base)) return true
  if (base.startsWith('/api/health')) return true
  return false
}

/**
 * @param {string | null | undefined} roleId
 * @param {string} pathname
 * @returns {boolean}
 */
export function canAccessRoute(roleId, pathname) {
  const base = pathname.split('?')[0]
  if (isPublicPath(base)) return true
  if (!roleId) return false

  if (roleId === 'configurador') {
    if (base === frioPaths.auth.login) return false
    return true
  }

  if (FRIO_PLATAFORMA_PREFIXES.some((p) => base.startsWith(p))) {
    return false
  }

  const route = getRouteByPath(base)
  if (!route) return true
  if (route.roles.includes('*')) return true
  return route.roles.includes(roleId)
}

/**
 * Destino tras login según rol.
 * @param {string} roleId
 * @returns {string}
 */
export function getDefaultPathForRole(roleId) {
  switch (roleId) {
    case 'configurador':
      return frioPaths.configuracion.empresas
    case 'transportista':
      return frioPaths.transporte.viajes
    case 'operario':
      return frioPaths.mapa.cola
    case 'procesador':
      return frioPaths.procesamiento.root
    case 'custodio':
      return frioPaths.ingreso.recepcion
    case 'operador_cuenta':
      return frioPaths.ingreso.ordenesCompra
    default:
      return frioPaths.dashboard
  }
}
