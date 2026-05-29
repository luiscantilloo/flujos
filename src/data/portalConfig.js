import { flowDefinitions, topLevelFlowKeys } from './flowsData.js'
import {
  APP_DEVELOPMENT_LEGEND,
  appDevelopmentFlowDefinitions,
  appDevelopmentTopLevelFlowKeys,
} from './appDevelopmentFlow.js'
import { documentationItems } from '../docs/docRegistry.js'
import { ENTITIES } from './bodegaDatabaseSchema.js'
import { getEnabledHubProjects, getHubProject } from './hubProjects.js'
import { getReferenceTopic } from './referenceTopics.js'
import { BODEGA_STEP_COUNT } from './bodegaStepByStepData.js'

/** Texto de la leyenda del diagrama (bodega de frío). */
export const BODEGA_FRIO_LEGEND =
  'DUEÑO (morado) → INQUILINO (morado puente). Varios nodos con anillo claro abren sub-flujos de documentación (OC, ingreso, mapa/slots, transporte, alertas, etc.) o Tenant/Owner. Amarillo + violeta: cierre con evidencias. Rojo: bloqueos. Verde: FIN. Líneas discontinuas: reintento o ciclo.'

export const PORTAL_BRAND = {
  title: 'Dev Hub',
  subtitle: 'Centro de desarrollo',
  tagline:
    'Flujos interactivos, documentación viva y referencias rápidas para el equipo. Todo en un solo lugar.',
}

export const portalCategories = [
  {
    id: 'explore',
    label: 'Explorar',
    description: 'Diagramas y documentación completa del producto.',
  },
  {
    id: 'reference',
    label: 'Referencia',
    description: 'Consulta rápida sin leer documentos enteros.',
  },
  {
    id: 'devtools',
    label: 'Herramientas',
    description: 'Checklist, onboarding, operación y stack.',
  },
  {
    id: 'soon',
    label: 'Próximamente',
    description: 'Funciones planificadas en el roadmap.',
  },
]

/**
 * Tarjetas del menú principal.
 * `action.type`: phase | doc-section
 */
export const portalMainSections = [
  {
    id: 'flows',
    category: 'explore',
    title: 'Flujos interactivos',
    description: 'Diagramas React Flow por instalación o proceso de negocio.',
    icon: 'GitBranch',
    accent: 'violet',
    enabled: true,
    featured: true,
    badge: null,
    keywords: ['diagrama', 'react flow', 'bodega', 'desarrollo', 'wms'],
    action: { type: 'phase', phase: 'flows' },
  },
  {
    id: 'step-by-step',
    category: 'explore',
    title: 'Paso a paso',
    description:
      'Recorrido interactivo del WMS: nubes de hielo, ramas S/N, mini-simulaciones y todo el flujo de punta a punta.',
    icon: 'Snowflake',
    accent: 'cyan',
    enabled: true,
    featured: true,
    badge: `${BODEGA_STEP_COUNT} pasos`,
    keywords: ['onboarding', 'tutorial', 'interactivo', 'bodega', 'recorrido', 'hielo'],
    action: { type: 'phase', phase: 'step-by-step' },
  },
  {
    id: 'stack-architecture',
    category: 'explore',
    title: 'Arquitectura del proyecto',
    description:
      'Carpetas del frontend y backend, y tablas Supabase. Árbol interactivo con copia en un clic.',
    icon: 'Squares2X2',
    accent: 'emerald',
    enabled: true,
    featured: true,
    badge: 'Interactivo',
    keywords: ['arquitectura', 'carpetas', 'estructura', 'supabase', 'tablas', 'frontend', 'backend'],
    action: { type: 'phase', phase: 'stack-architecture' },
  },
  {
    id: 'documentation',
    category: 'explore',
    title: 'Documentación',
    description: 'Guías técnicas, arquitectura, API y buenas prácticas del proyecto.',
    icon: 'BookOpen',
    accent: 'sky',
    enabled: true,
    featured: true,
    badge: `${documentationItems.length} documentos`,
    keywords: ['docs', 'guía', 'readme', 'markdown'],
    action: { type: 'phase', phase: 'docs' },
  },
  {
    id: 'database',
    category: 'reference',
    title: 'Modelo de datos',
    description:
      'Esquema normalizado (3NF), tablas PostgreSQL en Supabase, claves PK/FK, diagramas ER y de clases.',
    icon: 'CircleStack',
    accent: 'cyan',
    enabled: true,
    badge: `${ENTITIES.length} entidades`,
    keywords: ['supabase', 'postgres', 'tablas', 'er', 'normalización', 'schema'],
    action: { type: 'reference', topic: 'database' },
  },
  {
    id: 'glossary',
    category: 'reference',
    title: 'Glosario de dominio',
    description: 'Términos de negocio y su representación en código — OC, OV, slots, merma…',
    icon: 'LightBulb',
    accent: 'amber',
    enabled: true,
    badge: '20+ términos',
    keywords: ['glosario', 'vocabulario', 'dominio', 'negocio'],
    action: { type: 'reference', topic: 'glossary' },
  },
  {
    id: 'architecture',
    category: 'reference',
    title: 'Arquitectura',
    description: 'Capas del sistema, orquestador y persistencia en Supabase.',
    icon: 'ServerStack',
    accent: 'emerald',
    enabled: true,
    keywords: ['arquitectura', 'capas', 'dashboard', 'supabase'],
    action: { type: 'reference', topic: 'architecture' },
  },
  {
    id: 'api',
    category: 'reference',
    title: 'API y endpoints',
    description: 'Contratos HTTP, modos de subida y respuestas del backend.',
    icon: 'CodeBracket',
    accent: 'sky',
    enabled: true,
    keywords: ['api', 'rest', 'endpoints', 'http'],
    action: { type: 'reference', topic: 'api' },
  },
  {
    id: 'env-vars',
    category: 'reference',
    title: 'Variables de entorno',
    description: 'Supabase, Cloudinary, n8n y atajos de login para desarrollo.',
    icon: 'Key',
    accent: 'rose',
    enabled: true,
    keywords: ['env', 'variables', 'configuración', '.env'],
    action: { type: 'reference', topic: 'env-vars' },
  },
  {
    id: 'checklist',
    category: 'devtools',
    title: 'Checklist del proyecto',
    description: 'Estado de README, tests, runbooks, seguridad y documentación pendiente.',
    icon: 'ClipboardCheck',
    accent: 'violet',
    enabled: true,
    keywords: ['checklist', 'estado', 'documentación', 'dod'],
    action: { type: 'reference', topic: 'checklist' },
  },
  {
    id: 'onboarding',
    category: 'devtools',
    title: 'Onboarding dev',
    description: 'Día 1, mapa del equipo y primer ticket recomendado.',
    icon: 'RocketLaunch',
    accent: 'emerald',
    enabled: true,
    keywords: ['onboarding', 'nuevo', 'equipo', 'primer día'],
    action: { type: 'reference', topic: 'onboarding' },
  },
  {
    id: 'runbooks',
    category: 'devtools',
    title: 'Runbooks',
    description: 'Deploy, rollback, bodegas nuevas, diagnóstico y rotación de secretos.',
    icon: 'Wrench',
    accent: 'amber',
    enabled: true,
    keywords: ['runbook', 'deploy', 'producción', 'operación'],
    action: { type: 'reference', topic: 'runbooks' },
  },
  {
    id: 'dev-resources',
    category: 'devtools',
    title: 'Stack y scripts',
    description: 'Tecnologías, comandos npm, instalación local y enlaces útiles.',
    icon: 'CommandLine',
    accent: 'sky',
    enabled: true,
    keywords: ['stack', 'npm', 'scripts', 'instalación', 'node'],
    action: { type: 'phase', phase: 'dev-resources' },
  },
  {
    id: 'security',
    category: 'reference',
    title: 'Seguridad y RBAC',
    description: 'Autenticación, roles, permisos y políticas de acceso.',
    icon: 'ShieldCheck',
    accent: 'rose',
    enabled: true,
    keywords: ['seguridad', 'auth', 'rbac', 'roles'],
    action: { type: 'reference', topic: 'security' },
  },
  {
    id: 'testing',
    category: 'devtools',
    title: 'Testing',
    description: 'Framework, convenciones y casos críticos a cubrir.',
    icon: 'Beaker',
    accent: 'emerald',
    enabled: true,
    keywords: ['testing', 'tests', 'vitest', 'jest'],
    action: { type: 'reference', topic: 'testing' },
  },
  {
    id: 'observability',
    category: 'soon',
    title: 'Observabilidad',
    description: 'Métricas, logs, alertas y monitoreo en producción.',
    icon: 'ChartBar',
    accent: 'slate',
    enabled: false,
    disabledHint: 'Próximamente',
    keywords: ['observabilidad', 'monitoreo', 'datadog'],
    action: { type: 'phase', phase: 'observability' },
  },
  {
    id: 'storybook',
    category: 'soon',
    title: 'Catálogo UI',
    description: 'Storybook y componentes reutilizables del design system.',
    icon: 'Cube',
    accent: 'slate',
    enabled: false,
    disabledHint: 'Próximamente',
    keywords: ['storybook', 'ui', 'componentes'],
    action: { type: 'phase', phase: 'storybook' },
  },
  {
    id: 'playground',
    category: 'soon',
    title: 'API Playground',
    description: 'Probar endpoints con ejemplos interactivos desde el navegador.',
    icon: 'GlobeAlt',
    accent: 'slate',
    enabled: false,
    disabledHint: 'Próximamente',
    keywords: ['playground', 'swagger', 'openapi'],
    action: { type: 'phase', phase: 'playground' },
  },
]

export const portalStats = {
  flows: 0,
  docs: documentationItems.length,
  glossaryTerms: 20,
  schemaEntities: ENTITIES.length,
  projects: getEnabledHubProjects().length,
}

/**
 * Cada ítem es una “aplicación de flujo” independiente.
 */
export const flowApplications = [
  {
    id: 'bodega-frio',
    name: 'Bodega de frío',
    summary: 'WMS: configuración del dueño (SaaS) y operación del inquilino en un solo diagrama.',
    flowDefinitions,
    topLevelFlowKeys,
    defaultRootKey: 'main',
    legendText: BODEGA_FRIO_LEGEND,
    accent: 'sky',
    tags: ['WMS', 'Multi-rol', 'Supabase'],
  },
  {
    id: 'app-desarrollo-logico',
    name: 'Desarrollo de aplicación (lógica y validaciones)',
    summary:
      'Flujo general: requisitos, contratos, capas, validación de datos con S/N, pruebas y despliegue; incluye subflujos detallados.',
    flowDefinitions: appDevelopmentFlowDefinitions,
    topLevelFlowKeys: appDevelopmentTopLevelFlowKeys,
    defaultRootKey: 'main',
    legendText: APP_DEVELOPMENT_LEGEND,
    accent: 'violet',
    tags: ['S/N', 'Validaciones', 'Arquitectura'],
  },
]

portalStats.flows = flowApplications.length

const flowsPortalEntry = portalMainSections.find((s) => s.id === 'flows')
if (flowsPortalEntry) flowsPortalEntry.badge = `${flowApplications.length} diagramas`

export function getFlowApplicationById(id) {
  return flowApplications.find((a) => a.id === id) ?? null
}

export function getPortalSectionById(id) {
  return portalMainSections.find((s) => s.id === id) ?? null
}

export function getPortalPhaseMeta(phase, referenceCtx = null) {
  if (phase === 'reference' && referenceCtx?.topicId) {
    const topic = getReferenceTopic(referenceCtx.topicId)
    const project = referenceCtx.projectId ? getHubProject(referenceCtx.projectId) : null
    if (topic) {
      if (!project) {
        return { title: topic.title, subtitle: 'Selecciona el proyecto' }
      }
      return { title: `${topic.title} · ${project.name}`, subtitle: topic.subtitle }
    }
  }

  const map = {
    main: { title: PORTAL_BRAND.title, subtitle: PORTAL_BRAND.tagline },
    flows: { title: 'Flujos interactivos', subtitle: 'Elige un diagrama para explorar el proceso.' },
    docs: { title: 'Documentación', subtitle: 'Referencias del producto y guía general.' },
    'dev-resources': { title: 'Stack y scripts', subtitle: 'Comandos, tecnologías y enlaces de desarrollo.' },
    'stack-architecture': {
      title: 'Arquitectura del proyecto',
      subtitle: 'Estructura de carpetas y tablas Supabase — explora y copia.',
    },
    'step-by-step': {
      title: 'Paso a paso',
      subtitle: 'Elige el proyecto y recorre el flujo de forma interactiva.',
    },
  }
  return map[phase] ?? { title: PORTAL_BRAND.title, subtitle: PORTAL_BRAND.tagline }
}
