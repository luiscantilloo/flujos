/**
 * Proyectos del Dev Hub. Cada uno define su documentación fuente y referencias disponibles.
 */
export const hubProjects = [
  {
    id: 'bodega-frio',
    name: 'Bodega de frío',
    summary:
      'WMS multi-rol: empresa → tenant → bodega. Producto Next.js + NestJS + Supabase; este Dev Hub documenta flujos y ER.',
    accent: 'sky',
    tags: ['WMS', 'Empresa · Tenant', 'Supabase'],
    enabled: true,
    /** Documento principal para secciones de referencia (v1.0 operacional). */
    documentationDocId: 'bodega-frio-v2',
  },
]

export function getHubProject(id) {
  return hubProjects.find((p) => p.id === id) ?? null
}

export function getEnabledHubProjects() {
  return hubProjects.filter((p) => p.enabled !== false)
}
