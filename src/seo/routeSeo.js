import { getFlowApplicationById, getPortalPhaseMeta, PORTAL_BRAND } from '../data/portalConfig.js'
import { getDocumentationItemById } from '../docs/docRegistry.js'
import { getHubProject } from '../data/hubProjects.js'
import { getReferenceTopic } from '../data/referenceTopics.js'
import { paths } from '../router/paths.js'

const SITE_NAME = PORTAL_BRAND.title

/**
 * @param {string} pathname
 * @param {{ flowAppId?: string, docId?: string, topicId?: string, projectId?: string, stepProjectId?: string }} params
 */
export function getRouteSeo(pathname, params = {}) {
  const meta = { siteName: SITE_NAME }

  if (pathname === paths.home) {
    return {
      ...meta,
      title: `${PORTAL_BRAND.title} — ${PORTAL_BRAND.subtitle}`,
      description: PORTAL_BRAND.tagline,
      canonicalPath: paths.home,
    }
  }

  if (pathname === paths.flows) {
    const phase = getPortalPhaseMeta('flows')
    return { ...meta, title: phase.title, description: phase.subtitle, canonicalPath: paths.flows }
  }

  if (pathname.startsWith('/flujos/') && params.flowAppId) {
    const app = getFlowApplicationById(params.flowAppId)
    if (app) {
      return {
        ...meta,
        title: `${app.name} — Flujos`,
        description: app.summary,
        canonicalPath: paths.flow(params.flowAppId),
      }
    }
  }

  if (pathname === paths.docs) {
    const phase = getPortalPhaseMeta('docs')
    return { ...meta, title: phase.title, description: phase.subtitle, canonicalPath: paths.docs }
  }

  if (pathname.startsWith('/documentacion/') && params.docId) {
    const doc = getDocumentationItemById(params.docId)
    if (doc) {
      return {
        ...meta,
        title: doc.title,
        description: doc.summary,
        canonicalPath: paths.doc(params.docId),
        markdownSource: doc.filePath,
      }
    }
  }

  if (pathname === paths.stepByStep() || pathname.startsWith('/paso-a-paso')) {
    const phase = getPortalPhaseMeta('step-by-step')
    if (params.stepProjectId) {
      const project = getHubProject(params.stepProjectId)
      if (project) {
        return {
          ...meta,
          title: `Paso a paso · ${project.name}`,
          description: project.summary,
          canonicalPath: paths.stepByStep(params.stepProjectId),
        }
      }
    }
    return { ...meta, title: phase.title, description: phase.subtitle, canonicalPath: paths.stepByStep() }
  }

  if (pathname.startsWith('/referencia/') && params.topicId) {
    const topic = getReferenceTopic(params.topicId)
    const project = params.projectId ? getHubProject(params.projectId) : null
    if (topic) {
      return {
        ...meta,
        title: project ? `${topic.title} · ${project.name}` : topic.title,
        description: topic.subtitle,
        canonicalPath: paths.reference(params.topicId, params.projectId ?? undefined),
      }
    }
  }

  if (pathname === paths.projectStructure) {
    const phase = getPortalPhaseMeta('project-structure')
    return { ...meta, title: phase.title, description: phase.subtitle, canonicalPath: paths.projectStructure }
  }

  if (pathname === paths.stackArchitecture || pathname === '/arquitectura-stack') {
    const phase = getPortalPhaseMeta('stack-architecture')
    return { ...meta, title: phase.title, description: phase.subtitle, canonicalPath: paths.stackArchitecture }
  }

  if (pathname === paths.devResources) {
    const phase = getPortalPhaseMeta('dev-resources')
    return { ...meta, title: phase.title, description: phase.subtitle, canonicalPath: paths.devResources }
  }

  return {
    ...meta,
    title: PORTAL_BRAND.title,
    description: PORTAL_BRAND.tagline,
    canonicalPath: pathname,
  }
}
