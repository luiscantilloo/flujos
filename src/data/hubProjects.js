/**
 * Proyectos del Dev Hub. Cada uno define su documentación fuente y referencias disponibles.
 */
import { POLARIA_WMS } from './polariaWmsMeta.js'

export const hubProjects = [
  {
    id: 'bodega-frio',
    name: 'Polaria WMS',
    legacyName: 'Bodega de frío',
    summary:
      'WMS SaaS multi-rol: empresa → tenant → bodega. Producto en polaria-wms-web + polaria-wms-api + polaria-wms-db; este Dev Hub documenta diseño y estado real.',
    accent: 'sky',
    tags: ['Polaria WMS', 'Empresa · Tenant', 'Supabase'],
    repos: POLARIA_WMS.repos,
    enabled: true,
    /** Documento principal para secciones de referencia (v1.0 operacional). */
    documentationDocId: 'bodega-frio-v2',
    /** Documento diseño objetivo V2. */
    designDocId: 'bodega-frio-documentacion-v20',
  },
]

export function getHubProject(id) {
  return hubProjects.find((p) => p.id === id) ?? null
}

export function getEnabledHubProjects() {
  return hubProjects.filter((p) => p.enabled !== false)
}
