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
    sourceNote: 'Generado desde documentacion_bodega_frio_v2.docx.',
  },
  {
    id: 'bodega-frio-documentacion-v20',
    title: 'Bodega de frío — Documentación técnica (V2.0)',
    summary:
      'Stack, arquitectura, cambios V1→V2, flujos operativos, Supabase, API internas, integraciones, variables de entorno, despliegue y troubleshooting.',
    filePath: '/docs/bodega_de_frio_documentacion_v2_0.md',
    format: 'markdown',
    sourceNote: 'Generado desde BodegaDeFrio_DocumentacionV2.docx.',
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
