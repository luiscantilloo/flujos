import { getFlowApplicationById, getPortalPhaseMeta, PORTAL_BRAND } from '../data/portalConfig.js'
import { getHubProject } from '../data/hubProjects.js'
import { getReferenceTopic } from '../data/referenceTopics.js'
import { paths } from './paths.js'

/**
 * Título y subtítulo del header según la URL actual.
 * @param {string} pathname
 * @param {{ flowAppId?: string, docId?: string, topicId?: string, projectId?: string, stepProjectId?: string }} params
 */
export function getRouteMeta(pathname, params = {}) {
  if (pathname === paths.home) {
    return getPortalPhaseMeta('main')
  }

  if (pathname === paths.flows) {
    return getPortalPhaseMeta('flows')
  }

  if (pathname.startsWith('/flujos/') && params.flowAppId) {
    const app = getFlowApplicationById(params.flowAppId)
    if (app) return { title: app.name, subtitle: app.summary }
    return { title: 'Flujo no encontrado', subtitle: 'El diagrama solicitado no existe.' }
  }

  if (pathname === paths.docs || pathname.startsWith('/documentacion')) {
    return getPortalPhaseMeta('docs')
  }

  if (pathname === paths.devResources) {
    return getPortalPhaseMeta('dev-resources')
  }

  if (pathname === paths.projectStructure) {
    return getPortalPhaseMeta('project-structure')
  }

  if (pathname === paths.stackArchitecture || pathname === '/arquitectura-stack') {
    return getPortalPhaseMeta('stack-architecture')
  }

  if (pathname === paths.stepByStep() || pathname.startsWith('/paso-a-paso')) {
    const base = getPortalPhaseMeta('step-by-step')
    if (params.stepProjectId) {
      const project = getHubProject(params.stepProjectId)
      if (project) return { title: `Paso a paso · ${project.name}`, subtitle: base.subtitle }
    }
    return base
  }

  if (pathname.startsWith('/referencia/') && params.topicId) {
    return getPortalPhaseMeta('reference', {
      topicId: params.topicId,
      projectId: params.projectId ?? null,
    })
  }

  return { title: PORTAL_BRAND.title, subtitle: PORTAL_BRAND.tagline }
}

/**
 * Botón atrás del layout según la ruta actual.
 * @returns {{ show: boolean, label: string, to: string } | { show: false }}
 */
export function getBackNavigation(pathname, params = {}) {
  if (pathname === paths.home) {
    return { show: false }
  }

  if (pathname.startsWith('/flujos/') && pathname !== paths.flows) {
    return { show: true, label: 'Lista de flujos', to: paths.flows }
  }

  if (pathname === paths.flows) {
    return { show: true, label: 'Menú principal', to: paths.home }
  }

  if (pathname.startsWith('/documentacion/') && params.docId) {
    return { show: true, label: 'Índice de documentación', to: paths.docs }
  }

  if (pathname.startsWith('/documentacion') || pathname === paths.docs) {
    return { show: true, label: 'Menú principal', to: paths.home }
  }

  if (pathname.startsWith('/referencia/') && params.topicId && params.projectId) {
    return { show: true, label: 'Cambiar proyecto', to: paths.reference(params.topicId) }
  }

  if (pathname.startsWith('/referencia/')) {
    return { show: true, label: 'Menú principal', to: paths.home }
  }

  if (pathname.startsWith('/paso-a-paso/') && params.stepProjectId) {
    return { show: true, label: 'Cambiar proyecto', to: paths.stepByStep() }
  }

  if (pathname.startsWith('/paso-a-paso')) {
    return { show: true, label: 'Menú principal', to: paths.home }
  }

  if (pathname === paths.devResources) {
    return { show: true, label: 'Menú principal', to: paths.home }
  }

  if (pathname === paths.projectStructure || pathname === paths.stackArchitecture || pathname === '/arquitectura-stack') {
    return { show: true, label: 'Menú principal', to: paths.home }
  }

  return { show: true, label: 'Menú principal', to: paths.home }
}

/** Valida topic de referencia. */
export function isValidReferenceTopic(topicId) {
  return Boolean(getReferenceTopic(topicId))
}

export function isValidHubProject(projectId) {
  return Boolean(getHubProject(projectId))
}
