import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { documentationItems } from '../../src/docs/docRegistry.js'
import { extractSectionByTitle } from '../../src/docs/utils/extractMarkdownSection.js'
import { PORTAL_BRAND, portalMainSections, flowApplications } from '../../src/data/portalConfig.js'
import { hubProjects } from '../../src/data/hubProjects.js'
import { referenceTopics } from '../../src/data/referenceTopics.js'
import { bodegaStepByStepSteps, BODEGA_STEP_COUNT } from '../../src/data/bodegaStepByStepData.js'
import { WEB_TREE, API_TREE } from '../../src/data/polariaStructureTrees.js'
import { ENTITIES, SCHEMA_META } from '../../src/data/bodegaDatabaseSchema.js'
import { formatFieldType } from '../../src/data/schemaFieldTypes.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

function readDocMarkdown(filePath) {
  const rel = filePath.replace(/^\//, '')
  return readFileSync(join(root, 'public', rel), 'utf8')
}

function treeToMarkdown(nodes, depth = 0) {
  return nodes
    .map((node) => {
      const indent = '  '.repeat(depth)
      const hint = node.hint ? ` — ${node.hint}` : ''
      const line = `${indent}- **${node.name}**${hint}`
      const kids = node.children?.length ? `\n${treeToMarkdown(node.children, depth + 1)}` : ''
      return line + kids
    })
    .join('\n')
}

function serializeFlowNodes(flow) {
  if (!flow?.nodes?.length) return ''
  return flow.nodes
    .map((node) => {
      const label = node.data?.label ?? node.id
      const type = node.type ?? 'node'
      return `- [${type}] ${label}`
    })
    .join('\n')
}

export function serializeFlowApplication(app) {
  const lines = [
    `# ${app.name}`,
    '',
    app.summary,
    '',
    '## Leyenda del diagrama',
    '',
    app.legendText,
    '',
  ]

  for (const key of app.topLevelFlowKeys ?? []) {
    const flow = app.flowDefinitions?.[key]
    if (!flow) continue
    lines.push(`## Diagrama: ${key}`, '', serializeFlowNodes(flow), '')
  }

  return lines.join('\n').trim()
}

export function serializeStepByStep() {
  const lines = [
    '# Paso a paso — Bodega de frío',
    '',
    `Recorrido interactivo del WMS con ${BODEGA_STEP_COUNT} paradas. Mismo camino que el diagrama React Flow.`,
    '',
  ]

  for (const step of bodegaStepByStepSteps) {
    lines.push(`## ${step.title}`, '', `*${step.hook}*`, '', step.narrative, '')
    if (step.roles?.length) lines.push(`**Roles:** ${step.roles.join(', ')}`, '')
    if (step.funFact) lines.push(`**Dato:** ${step.funFact}`, '')
    if (step.flowRefs?.length) lines.push(`**Nodos del diagrama:** ${step.flowRefs.join(', ')}`, '')
    lines.push('')
  }

  return lines.join('\n').trim()
}

export function serializeHome() {
  const lines = [
    `# ${PORTAL_BRAND.title}`,
    '',
    PORTAL_BRAND.tagline,
    '',
    '## Secciones del portal',
    '',
  ]

  for (const section of portalMainSections.filter((s) => s.enabled !== false)) {
    lines.push(`### ${section.title}`, '', section.description, '')
  }

  return lines.join('\n').trim()
}

export function serializeProjectStructure() {
  return [
    '# Estructura del proyecto — Polaria WMS',
    '',
    SCHEMA_META.subtitle,
    '',
    '## Frontend (polaria-wms-web/)',
    '',
    treeToMarkdown(WEB_TREE),
    '',
    '## Backend (polaria-wms-api/)',
    '',
    treeToMarkdown(API_TREE),
  ].join('\n')
}

export function serializeArchitecture() {
  return [
    '# Arquitectura de datos — Polaria WMS',
    '',
    SCHEMA_META.subtitle,
    '',
    `## Base de datos (${ENTITIES.length} entidades)`,
    '',
    ...ENTITIES.map((e) => `- **${e.name}** (\`${e.table ?? e.physical ?? e.id}\`): ${e.desc ?? ''}`),
  ].join('\n')
}

export function serializeDatabaseSchema() {
  const lines = [
    `# ${SCHEMA_META.title}`,
    '',
    SCHEMA_META.subtitle,
    '',
    `Motor: ${SCHEMA_META.engine} · Normalización: ${SCHEMA_META.normalization}`,
    '',
    '## Notas',
    '',
    ...SCHEMA_META.notes.map((n) => `- ${n}`),
    '',
    '## Entidades',
    '',
  ]

  for (const entity of ENTITIES) {
    lines.push(`### ${entity.name}`, '', entity.desc ?? '', '')
    if (entity.fields?.length) {
      lines.push('| Campo | Tipo | Notas |', '| --- | --- | --- |')
      for (const f of entity.fields) {
        const notes = [f.pk && 'PK', f.fk && `FK → ${f.fk}`, f.desc].filter(Boolean).join(' · ')
        lines.push(`| ${f.name} | ${formatFieldType(f)} | ${notes} |`)
      }
      lines.push('')
    }
  }

  return lines.join('\n').trim()
}

export function serializeDocsIndex() {
  const lines = ['# Documentación', '', 'Índice de documentos del Dev Hub.', '']
  for (const doc of documentationItems) {
    lines.push(`## ${doc.title}`, '', doc.summary, '', `Archivo Markdown: ${doc.filePath}`, '')
  }
  return lines.join('\n').trim()
}

export function serializeDoc(docId) {
  const doc = documentationItems.find((d) => d.id === docId)
  if (!doc) return null
  const body = readDocMarkdown(doc.filePath)
  return [`# ${doc.title}`, '', doc.summary, '', body].join('\n')
}

export function serializeReferenceTopic(topicId, projectId) {
  const topic = referenceTopics[topicId]
  const project = hubProjects.find((p) => p.id === projectId)
  if (!topic) return null

  if (!project) {
    return [
      `# ${topic.title}`,
      '',
      topic.subtitle,
      '',
      'Selecciona un proyecto en la aplicación interactiva para ver el detalle.',
      '',
      '## Proyectos disponibles',
      '',
      ...hubProjects.map((p) => `- **${p.name}**: ${p.summary}`),
    ].join('\n')
  }

  if (topic.view === 'database') {
    return [`# ${topic.title} · ${project.name}`, '', topic.subtitle, '', serializeDatabaseSchema()].join('\n\n')
  }

  const doc = documentationItems.find((d) => d.id === project.documentationDocId)
  if (!doc) {
    return `# ${topic.title}\n\nSin documento vinculado para ${project.name}.`
  }

  const full = readDocMarkdown(doc.filePath)

  if (topic.view === 'markdown') {
    const section = extractSectionByTitle(full, topic.sectionPattern)
    return [
      `# ${topic.title} · ${project.name}`,
      '',
      topic.subtitle,
      '',
      section || full,
    ].join('\n\n')
  }

  if (topic.view === 'glossary') {
    const section = extractSectionByTitle(full, topic.sectionPattern)
    return [`# Glosario · ${project.name}`, '', section || 'Sección de glosario no encontrada.'].join('\n\n')
  }

  if (topic.view === 'checklist') {
    const section = extractSectionByTitle(full, /estado de la documentación|checklist maestra/i)
    return [`# Checklist · ${project.name}`, '', section || 'Sección de checklist no encontrada.'].join('\n\n')
  }

  return `# ${topic.title}\n\n${topic.subtitle}`
}

/** @returns {Array<{ path: string, title: string, description: string, markdown: string, markdownSource?: string }>} */
export function collectReadableRoutes() {
  const routes = [
    {
      path: '/',
      title: `${PORTAL_BRAND.title} — ${PORTAL_BRAND.subtitle}`,
      description: PORTAL_BRAND.tagline,
      markdown: serializeHome(),
    },
    {
      path: '/flujos',
      title: 'Flujos interactivos',
      description: 'Diagramas React Flow por instalación o proceso de negocio.',
      markdown: [
        '# Flujos interactivos',
        '',
        ...flowApplications.map((app) => `## ${app.name}\n\n${app.summary}\n\nRuta: /flujos/${app.id}`),
      ].join('\n\n'),
    },
    {
      path: '/documentacion',
      title: 'Documentación',
      description: 'Referencias del producto y guía general.',
      markdown: serializeDocsIndex(),
    },
    {
      path: '/estructura-proyecto',
      title: 'Estructura del proyecto',
      description: 'Carpetas polaria-wms-web y polaria-wms-api.',
      markdown: serializeProjectStructure(),
    },
    {
      path: '/arquitectura',
      title: 'Arquitectura',
      description: 'Modelo de datos Supabase y entidades 3NF.',
      markdown: serializeArchitecture(),
    },
    {
      path: '/arquitectura-stack',
      title: 'Arquitectura',
      description: 'Alias legado de /arquitectura.',
      markdown: serializeArchitecture(),
    },
    {
      path: '/paso-a-paso',
      title: 'Paso a paso',
      description: 'Recorrido interactivo del WMS Bodega de frío.',
      markdown: [
        '# Paso a paso',
        '',
        'Recorridos interactivos con temática de hielo.',
        '',
        ...hubProjects.map((p) => `## ${p.name}\n\n${p.summary}\n\nRuta: /paso-a-paso/${p.id}`),
      ].join('\n\n'),
    },
    {
      path: '/recursos',
      title: 'Stack y scripts',
      description: 'Comandos, tecnologías y enlaces de desarrollo.',
      markdown: [
        '# Stack y scripts',
        '',
        'Recursos de desarrollo: tecnologías, comandos npm e instalación local.',
        '',
        'Consulta la aplicación interactiva para la vista completa con capas del stack.',
      ].join('\n'),
    },
  ]

  for (const app of flowApplications) {
    routes.push({
      path: `/flujos/${app.id}`,
      title: `${app.name} — Flujo`,
      description: app.summary,
      markdown: serializeFlowApplication(app),
    })
  }

  for (const doc of documentationItems) {
    const md = serializeDoc(doc.id)
    if (!md) continue
    routes.push({
      path: `/documentacion/${doc.id}`,
      title: doc.title,
      description: doc.summary,
      markdown: md,
      markdownSource: doc.filePath,
    })
  }

  for (const project of hubProjects) {
    routes.push({
      path: `/paso-a-paso/${project.id}`,
      title: `Paso a paso · ${project.name}`,
      description: project.summary,
      markdown: project.id === 'bodega-frio' ? serializeStepByStep() : `# ${project.name}\n\n${project.summary}`,
    })
  }

  for (const topicId of Object.keys(referenceTopics)) {
    routes.push({
      path: `/referencia/${topicId}`,
      title: referenceTopics[topicId].title,
      description: referenceTopics[topicId].subtitle,
      markdown: serializeReferenceTopic(topicId, null),
    })

    for (const project of hubProjects) {
      const md = serializeReferenceTopic(topicId, project.id)
      if (!md) continue
      routes.push({
        path: `/referencia/${topicId}/${project.id}`,
        title: `${referenceTopics[topicId].title} · ${project.name}`,
        description: referenceTopics[topicId].subtitle,
        markdown: md,
      })
    }
  }

  return routes
}
