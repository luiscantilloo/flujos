/**
 * Índice de documentos servidos desde `/public/docs/`.
 */
export const documentationItems = [
  {
    id: 'novedades-2026-09-15',
    title: 'Novedades sep 2026 — Polaria WMS 2.5.34',
    summary:
      'Pedido IA, editar OV, captura QR de surtido, lista de precio, equivalencias, impresoras, bodega default, migraciones 068–080.',
    filePath: '/docs/novedades_2026-09-15.md',
    format: 'markdown',
    sourceNote: 'Captura sep 2026 (web, api, db, Widget-react, este hub) respecto de 2.4.3.',
  },
  {
    id: 'novedades-2026-08-29',
    title: 'Novedades 29 ago 2026 — Polaria WMS 2.4.3',
    summary:
      'Índice del día: tope de sesión 12 h, cierre de Mateo, enlaces/PDF, Editar en Creación, teléfonos +país, alias comprador–producto (067). Manuales y Drive incluidos.',
    filePath: '/docs/novedades_2026-08-29.md',
    format: 'markdown',
    sourceNote: 'Captura del chat de producto 29 ago 2026 (web, db, Widget-react, este hub).',
  },
  {
    id: 'bodega-frio-documentacion-v20',
    title: 'Bodega de frío — Documentación técnica (generación V2 · producto 2.5.34)',
    summary:
      'Empresa vs tenant, arquitectura lectura/escritura, modelo dual, stack, flujos, API real, precio_producto, emp_*, Mateo. Producto 2.5.34 · Sep 2026.',
    filePath: '/docs/bodega_de_frio_documentacion_v2_0.md',
    format: 'markdown',
    sourceNote: 'Mantenido a mano (Supabase, ago 2026). No regenerar desde el .txt del Word.',
  },
  {
    id: 'polaria-wms-mapa-actual',
    title: 'Polaria WMS — mapa actual (web, API, BD, Mateo)',
    summary:
      'Producto 2.5.34. Captura sep 2026: captura QR, IA pedido, lista de precio, equivalencias, impresoras, migraciones 068–080, Mateo Support.',
    filePath: '/docs/polaria_wms_mapa_actual.md',
    format: 'markdown',
    sourceNote: 'Redacción a partir de polaria-wms-web, api, db y Widget-react (ago 2026).',
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
