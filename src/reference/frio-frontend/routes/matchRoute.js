/**
 * Helpers para enlazar pathname ↔ definición de ruta.
 */
import { FRIO_ROUTE_REGISTRY, getRouteByPath } from './routes.config.js'

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function isKnownAppPath(pathname) {
  return Boolean(getRouteByPath(pathname))
}

/**
 * Rutas visibles en sidebar para un rol.
 * @param {string} roleId
 */
export function getSidebarRoutesForRole(roleId) {
  return FRIO_ROUTE_REGISTRY.filter(
    (r) => r.sidebar && (r.roles.includes('*') || r.roles.includes(roleId)),
  )
}

/**
 * @param {string} id — ej. 'ingreso.oc'
 * @returns {string | null}
 */
export function hrefByRouteId(id) {
  const route = FRIO_ROUTE_REGISTRY.find((r) => r.id === id)
  return route?.path ?? null
}
