/**
 * Índice de documentos servidos desde `/public/docs/`.
 */
export const documentationItems = [
  {
    id: 'bodega-frio-v2',
    title: 'Bodega de frío — Documentación técnica y operacional (v1.0)',
    summary:
      'Visión de negocio, checklist maestra, README, arquitectura, API, variables, instalación, glosario, flujos end-to-end y runbooks.',
    filePath: '/docs/documentacion_bodega_frio_v2.md',
    format: 'markdown',
    sourceNote: 'Documento vivo consolidado desde repos web/api/db/widget.',
  },
  {
    id: 'bodega-frio-documentacion-v20',
    title: 'Bodega de frío — Documentación técnica (V2.0)',
    summary:
      'Arquitectura actualizada Jul 2026: web/api/db/widget, mapa con locks+FEFO, RLS, módulos por rol y estado real de implementación.',
    filePath: '/docs/bodega_de_frio_documentacion_v2_0.md',
    format: 'markdown',
    sourceNote: 'Actualizado desde auditoría técnica de repos Polaria (web/api/db/widget).',
  },
  {
    id: 'manual-usuario-polaria-wms',
    title: 'Manual de usuario — Polaria WMS',
    summary:
      'Manual operativo por rol (configurador, admin cuenta, operador, jefe, custodio, operario, procesador, transportista) con procesos y funciones.',
    filePath: '/docs/manual-de-usuario/manual_usuario_polaria_wms.md',
    format: 'markdown',
    sourceNote: 'Creado para soporte Mateo (guía de respuestas por rol y flujo).',
  },
  {
    id: 'guia-explicacion-er',
    title: 'Guía para explicar las tablas (paso a paso, lenguaje fácil)',
    summary:
      'Cuento del 0 al 31: analogías, guiones simples y detalle técnico opcional para explicar el ER sin jerga.',
    filePath: '/docs/guia_explicacion_tablas_er.md',
    format: 'markdown',
    sourceNote: 'Generado desde src/data/erExplanationDocument.js',
  },
  {
    id: 'guia-documentacion-general',
    title: 'Guía: cómo documentar un proyecto de software',
    summary:
      'Plantilla y buenas prácticas generales alineadas con la checklist y el estilo de la documentación de Bodega de Frío.',
    filePath: '/docs/guia_documentacion_proyectos.md',
    format: 'markdown',
    sourceNote: 'Redacción original para este repositorio.',
  },
]

export function getDocumentationItemById(id) {
  return documentationItems.find((d) => d.id === id) ?? null
}
