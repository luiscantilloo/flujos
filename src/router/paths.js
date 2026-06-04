/** Rutas públicas de la SPA (sin barra final). */
export const paths = {
  home: '/',
  flows: '/flujos',
  flow: (flowAppId) => `/flujos/${encodeURIComponent(flowAppId)}`,
  docs: '/documentacion',
  doc: (docId, headingId) => {
    const base = `/documentacion/${encodeURIComponent(docId)}`
    return headingId ? `${base}/${encodeURIComponent(headingId)}` : base
  },
  reference: (topicId, projectId) => {
    const base = `/referencia/${encodeURIComponent(topicId)}`
    return projectId ? `${base}/${encodeURIComponent(projectId)}` : base
  },
  devResources: '/recursos',
  projectStructure: '/estructura-proyecto',
  projectStructureTab: (tab) =>
    `/estructura-proyecto?tab=${encodeURIComponent(tab)}`,
  stackArchitecture: '/arquitectura',
  stackArchitectureEr: '/arquitectura?dbView=er',
  /** @deprecated Usar projectStructureTab o stackArchitecture */
  stackArchitectureTab: (tab, dbView) => {
    if (tab === 'frontend' || tab === 'backend') {
      return paths.projectStructureTab(tab)
    }
    const base = paths.stackArchitecture
    return dbView ? `${base}?dbView=${encodeURIComponent(dbView)}` : base
  },
  stepByStep: (projectId) =>
    projectId ? `/paso-a-paso/${encodeURIComponent(projectId)}` : '/paso-a-paso',
}
