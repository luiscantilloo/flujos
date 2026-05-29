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
  stackArchitecture: '/arquitectura-stack',
  stackArchitectureTab: (tab, dbView) => {
    const base = `/arquitectura-stack?tab=${encodeURIComponent(tab)}`
    return dbView ? `${base}&dbView=${encodeURIComponent(dbView)}` : base
  },
  stepByStep: (projectId) =>
    projectId ? `/paso-a-paso/${encodeURIComponent(projectId)}` : '/paso-a-paso',
}
