/**
 * Índice de documentos servidos desde `/public/docs/`.
 * Categorías: 'tecnica' | 'guia' | 'manual'
 */
export const documentationItems = [
  // ── Documentación técnica ──────────────────────────────────────────────────
  {
    id: 'bodega-frio-v2',
    category: 'tecnica',
    title: 'Bodega de frío — Documentación técnica y operacional (v1.0)',
    summary:
      'Visión de negocio, checklist maestra, README, arquitectura, API, variables, instalación, glosario, flujos end-to-end y runbooks.',
    filePath: '/docs/documentacion_bodega_frio_v2.md',
    format: 'markdown',
    sourceNote: 'Generado desde documentacion_bodega_frio_v2.docx.',
  },
  {
    id: 'bodega-frio-documentacion-v20',
    category: 'tecnica',
    title: 'Polaria WMS — Documentación técnica (V2.0)',
    summary:
      'Empresa vs tenant, arquitectura lectura/escritura, modelo dual 3NF+jsonb, Widget Mateo, stack completo, flujos V2, Supabase, API, despliegue. Actualizado Jul 2026.',
    filePath: '/docs/bodega_de_frio_documentacion_v2_0.md',
    format: 'markdown',
    sourceNote: 'Generado desde BodegaDeFrio_DocumentacionV2.docx. Actualizado Jul 2026.',
  },
  // ── Guías ──────────────────────────────────────────────────────────────────
  {
    id: 'guia-explicacion-er',
    category: 'guia',
    title: 'Guía para explicar las tablas (paso a paso, lenguaje fácil)',
    summary:
      'Cuento del 0 al 31: analogías, guiones simples y detalle técnico opcional para explicar el ER sin jerga.',
    filePath: '/docs/guia_explicacion_tablas_er.md',
    format: 'markdown',
    sourceNote: 'Generado desde src/data/erExplanationDocument.js',
  },
  {
    id: 'guia-documentacion-general',
    category: 'guia',
    title: 'Guía: cómo documentar un proyecto de software',
    summary:
      'Plantilla y buenas prácticas generales alineadas con la checklist y el estilo de la documentación de Bodega de Frío.',
    filePath: '/docs/guia_documentacion_proyectos.md',
    format: 'markdown',
    sourceNote: 'Redacción original para este repositorio.',
  },
  // ── Manuales de usuario ────────────────────────────────────────────────────
  {
    id: 'manual-de-usuario-indice',
    category: 'manual',
    title: 'Manual de Usuario — Índice general',
    summary:
      'Índice de todos los manuales por rol. Tabla de roles, jerarquía de creación y guía de uso para soporte Mateo.',
    filePath: '/docs/manual-de-usuario/00-indice.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-configurador',
    category: 'manual',
    title: 'Manual de Usuario — Configurador (TI)',
    summary:
      'Rol de plataforma. Crea empresas, tenants, bodegas y el primer administrador de cuenta. Login sin código de empresa. Gestiona integraciones globales.',
    filePath: '/docs/manual-de-usuario/01-configurador.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-administrador-cuenta',
    category: 'manual',
    title: 'Manual de Usuario — Administrador de Cuenta',
    summary:
      'Primer usuario del cliente (tenant). Gestiona usuarios, catálogos, bodegas, reportes. Crea todos los roles operativos de su empresa.',
    filePath: '/docs/manual-de-usuario/02-administrador-cuenta.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-operador-cuenta',
    category: 'manual',
    title: 'Manual de Usuario — Operador de Cuenta',
    summary:
      'Operación comercial del tenant: SOL, OC, OV y solicitudes de integración con bodegas externas.',
    filePath: '/docs/manual-de-usuario/03-operador-cuenta.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-administrador-bodega',
    category: 'manual',
    title: 'Manual de Usuario — Administrador de Bodega',
    summary:
      'Supervisión y gestión de la bodega asignada. Alertas, reportes y configuración operativa.',
    filePath: '/docs/manual-de-usuario/04-administrador-bodega.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-jefe-bodega',
    category: 'manual',
    title: 'Manual de Usuario — Jefe de Bodega',
    summary:
      'Control operativo diario: prioriza OT, conteo ciego, override de temperatura, alertas, supervisión de procesamiento y mapa en tiempo real.',
    filePath: '/docs/manual-de-usuario/05-jefe-bodega.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-custodio',
    category: 'manual',
    title: 'Manual de Usuario — Custodio',
    summary:
      'Guardián del muelle: recibe mercancía, valida documentos y temperatura, registra inbound boxes, gestiona salida cruzada y despacha OV.',
    filePath: '/docs/manual-de-usuario/06-custodio.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-operario',
    category: 'manual',
    title: 'Manual de Usuario — Operario',
    summary:
      'Ejecuta órdenes de trabajo (OT): mueve cajas entre slots, aplica locking, inspecciona mercancía y participa en despachos.',
    filePath: '/docs/manual-de-usuario/07-operario.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-procesador',
    category: 'manual',
    title: 'Manual de Usuario — Procesador',
    summary:
      'Línea de procesamiento: primario → secundario, balance de masa, registro de merma.',
    filePath: '/docs/manual-de-usuario/08-procesador.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
  {
    id: 'manual-transportista',
    category: 'manual',
    title: 'Manual de Usuario — Transportista',
    summary:
      'Viajes TV: inicia, registra entregas, sube evidencias (foto, firma, GPS) y cierra viajes.',
    filePath: '/docs/manual-de-usuario/09-transportista.md',
    format: 'markdown',
    sourceNote: 'Elaborado para soporte Mateo — Jul 2026.',
  },
]

export function getDocumentationItemById(id) {
  return documentationItems.find((d) => d.id === id) ?? null
}

export function getDocumentationItemsByCategory(category) {
  return documentationItems.filter((d) => d.category === category)
}

export function getManualItems() {
  return getDocumentationItemsByCategory('manual')
}
