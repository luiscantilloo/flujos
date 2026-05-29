/**
 * Temas de referencia por proyecto (arquitectura, API, etc.).
 * `view`: markdown | glossary | checklist | database
 */
export const referenceTopics = {
  architecture: {
    id: 'architecture',
    title: 'Arquitectura',
    subtitle: 'Capas del sistema, orquestador y persistencia en Supabase.',
    icon: 'ServerStack',
    accent: 'emerald',
    view: 'markdown',
    sectionPattern: /diagrama de arquitectura/i,
  },
  api: {
    id: 'api',
    title: 'API y endpoints',
    subtitle: 'Contratos HTTP, modos de subida y respuestas del backend.',
    icon: 'CodeBracket',
    accent: 'sky',
    view: 'markdown',
    sectionPattern: /documentación de api/i,
  },
  'env-vars': {
    id: 'env-vars',
    title: 'Variables de entorno',
    subtitle: 'Supabase, Cloudinary, n8n y configuración local.',
    icon: 'Key',
    accent: 'rose',
    view: 'markdown',
    sectionPattern: /variables de entorno/i,
  },
  security: {
    id: 'security',
    title: 'Seguridad y RBAC',
    subtitle: 'Autenticación, roles, permisos y políticas de acceso.',
    icon: 'ShieldCheck',
    accent: 'rose',
    view: 'markdown',
    sectionPattern: /seguridad y autenticación/i,
  },
  onboarding: {
    id: 'onboarding',
    title: 'Onboarding dev',
    subtitle: 'Día 1, mapa del equipo y primer ticket recomendado.',
    icon: 'RocketLaunch',
    accent: 'emerald',
    view: 'markdown',
    sectionPattern: /onboarding/i,
  },
  runbooks: {
    id: 'runbooks',
    title: 'Runbooks',
    subtitle: 'Deploy, rollback, bodegas nuevas y diagnóstico.',
    icon: 'Wrench',
    accent: 'amber',
    view: 'markdown',
    sectionPattern: /runbooks/i,
  },
  testing: {
    id: 'testing',
    title: 'Testing',
    subtitle: 'Framework, convenciones y casos críticos a cubrir.',
    icon: 'Beaker',
    accent: 'emerald',
    view: 'markdown',
    sectionPattern: /documentación de testing/i,
  },
  glossary: {
    id: 'glossary',
    title: 'Glosario de dominio',
    subtitle: 'Términos de negocio y su representación en código.',
    icon: 'LightBulb',
    accent: 'amber',
    view: 'glossary',
    sectionPattern: /glosario/i,
  },
  checklist: {
    id: 'checklist',
    title: 'Checklist del proyecto',
    subtitle: 'Estado de README, tests, runbooks y documentación.',
    icon: 'ClipboardCheck',
    accent: 'violet',
    view: 'checklist',
    sectionPattern: /checklist maestra|estado de la documentación/i,
  },
  database: {
    id: 'database',
    title: 'Modelo de datos',
    subtitle: 'Esquema normalizado, tablas PostgreSQL en Supabase y diagramas.',
    icon: 'CircleStack',
    accent: 'cyan',
    view: 'database',
  },
}

export function getReferenceTopic(topicId) {
  return referenceTopics[topicId] ?? null
}
