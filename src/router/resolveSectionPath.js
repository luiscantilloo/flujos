import { paths } from './paths.js'

/**
 * Convierte la acción de una tarjeta del portal en una ruta navegable.
 * @param {{ action?: { type: string, phase?: string, topic?: string, docId?: string, headingId?: string } }} section
 * @returns {string | null}
 */
export function getSectionPath(section) {
  const action = section?.action
  if (!action) return null

  if (action.type === 'phase') {
    switch (action.phase) {
      case 'main':
        return paths.home
      case 'flows':
        return paths.flows
      case 'docs':
        return paths.docs
      case 'manual':
        return paths.manual()
      case 'dev-resources':
        return paths.devResources
      case 'project-structure':
        return paths.projectStructure
      case 'stack-architecture':
        return paths.stackArchitecture
      case 'step-by-step':
        return paths.stepByStep()
      default:
        return null
    }
  }

  if (action.type === 'reference' && action.topic) {
    return paths.reference(action.topic)
  }

  if (action.type === 'doc-section' && action.docId) {
    return paths.doc(action.docId, action.headingId ?? undefined)
  }

  return null
}
