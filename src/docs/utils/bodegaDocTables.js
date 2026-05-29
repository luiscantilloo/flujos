/**
 * Utilidades para detectar tablas y encabezados en el texto plano del Word.
 */

export const TABLE_HEADERS = {
  checklist: ['#', 'Elemento de Documentación', 'Prioridad', 'Estado'],
  readme_sections: ['Sección', 'Contenido'],
  layers: ['Capa', 'Descripción'],
  kv2: ['Variable', 'Descripción'],
  kv2_const: ['Constante de código', 'Descripción'],
  glossary: ['Término', 'Definición de negocio', 'Representación en el sistema'],
  flow_steps: ['#', 'Actor', 'Acción'],
  api_attr: ['Atributo', 'Detalle'],
  http_resp: ['Código HTTP', 'Condición', 'Body de respuesta'],
  body_fields: ['Campo', 'Requerido', 'Descripción'],
  prereq: ['Herramienta', 'Versión requerida'],
  scripts: ['Comando', 'Descripción'],
  troubleshoot: ['Problema', 'Solución'],
  branches: ['Tipo', 'Formato', 'Ejemplo'],
  commits: ['Prefijo', 'Cuándo usarlo'],
  tests_modules: ['Módulo', 'Qué cubre'],
  adr_list: ['ID', 'Decisión', 'Justificación identificada'],
  adr_template: ['Campo', 'Contenido esperado'],
  edge_cases: ['Situación', 'Qué cambia en el flujo'],
  changelog: ['Versión', 'Estado'],
  rbac: ['Rol', 'Acceso al mapa de bodega'],
  secrets: ['Secreto', 'Regla de manejo'],
  env_compare: ['Aspecto', 'Desarrollo (dev)', 'Producción (prod)'],
  promote: ['Flujo', 'Descripción'],
  observability: ['Propósito', 'Herramienta recomendada'],
  semver: ['Componente', 'Cuándo incrementar', 'Ejemplo'],
  migration_known: ['Escenario', 'Descripción'],
  ui_components: ['Componente', 'Descripción'],
  compliance: ['Normativa', 'Aplicabilidad al sistema'],
  team_map: ['Área', 'Responsable / Contacto'],
  functions: ['Función', 'Descripción'],
}

export const MAIN_SECTION_RE = /^(?:—\.\s+)?(\d+)\.\s+(.+)$/

export const SUBSECTION_NUM_RE = /^(\d+\.\d+)\s+(.+)$/

export const FLOW_SUB_RE = /^Flujo\s+(\d+\.\d+)\s+—\s+(.+)$/

export const SUBTITLE_LINES = new Set([
  'Propósito del sistema',
  'Público objetivo',
  'Hilo conductor: compra → bodega → venta',
  'Contenido del README.md',
  'Capas del sistema',
  'Componente orquestador: BodegaDashboard.tsx',
  'Capa de persistencia: lib/bodegaCloudState.ts',
  'Modos de subida',
  'Body de la solicitud',
  'Respuestas',
  'Prerrequisitos',
  'Pasos de instalación',
  'Scripts disponibles',
  'Troubleshooting de instalación',
  'Convención de ramas',
  'Convención de commits (Conventional Commits)',
  'Definition of Done',
  'Casos borde y combinaciones',
  'Plantilla para nuevos ADRs',
  'ADRs identificados en el código',
  'Framework y configuración',
  'Qué se testea',
  'Convención para nuevos tests',
  'Casos críticos a cubrir',
  'Autenticación',
  'Autorización (RBAC)',
  'Manejo de secretos',
  'Recomendaciones para producción',
  'Staging (recomendado)',
  'Promoción de código entre entornos',
  'Herramientas recomendadas',
  'Métricas clave a monitorear',
  '¿Qué constituye un cambio MAJOR en este proyecto?',
  'Plantilla para notas de migración',
  'Migraciones conocidas pendientes',
  'Componentes UI atómicos identificados',
  'Normativas identificadas',
  'Convención utilizada',
  'Versión actual',
  'Día 1 — Configuración del entorno',
  'Día 1 — Comprensión del proyecto',
  'Mapa del equipo — A quién preguntar qué',
  'Primer ticket recomendado',
  'Estado de la documentación del proyecto',
])

export function escapeMdCell(s) {
  return String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')
    .trim()
}

export function renderTable(cols, rows) {
  const head = `| ${cols.map(escapeMdCell).join(' | ')} |`
  const sep = `| ${cols.map(() => '---').join(' | ')} |`
  const body = rows.map((row) => `| ${row.map(escapeMdCell).join(' | ')} |`).join('\n')
  return `${head}\n${sep}\n${body}\n\n`
}

export function isEmojiOnly(line) {
  const tr = line.trim()
  if (!tr || tr.length > 8) return false
  // Dígitos sueltos y texto ASCII no son líneas «solo emoji» (evita romper tablas # / 1 / 2).
  if (/[A-Za-z0-9]/.test(tr)) return false
  return /[\p{Extended_Pictographic}]/u.test(tr)
}

export function isMainSection(line) {
  const tr = line.trim()
  if (FLOW_SUB_RE.test(tr)) return false
  if (MAIN_SECTION_RE.test(tr) && tr.length <= 120) return true
  if (/^—\.\s+/.test(tr)) return true
  if (tr === '0. VISIÓN DE NEGOCIO') return true
  return false
}

export function formatMainSection(line) {
  const tr = line.trim()
  if (tr.startsWith('—.')) return tr.replace(/^—\.\s+/, '')
  return tr
}

export function isEndpoint(line) {
  return /^POST\s+\/api\//.test(line.trim())
}

export function isActoresLine(line) {
  return /^Actores:\s/.test(line.trim())
}

export function isListIntro(line) {
  const tr = line.trim()
  return tr === 'Sus responsabilidades son:' || tr === 'Un cambio está terminado cuando:'
}

export function isAudienceBullet(line) {
  const tr = line.trim()
  if (!tr || tr.length > 220) return false
  const starters = [
    'Personal de bodega',
    'Supervisores',
    'Custodios',
    'Procesador',
    'Administración',
    'Cuentas comerciales',
    'Configurador',
    'Transporte',
  ]
  return starters.some((s) => tr.startsWith(s))
}

export function isRunbookTitle(line) {
  return /^Runbook\s+\d+\s+—\s+/.test(line.trim())
}

export function isGitCommand(line) {
  const tr = line.trim()
  return /^(git |npm |node |cp )/.test(tr) || tr === 'http://localhost:3000'
}

export function isInstallStepTitle(line) {
  return [
    'Clonar el repositorio',
    'Instalar dependencias',
    'Crear el archivo de variables de entorno',
    'Iniciar el servidor de desarrollo',
    'Abrir la aplicación',
  ].includes(line.trim())
}

export function matchTableHeader(lines, i) {
  const trimmed = (lines[i]?.trim() ?? '').replace(/\s+/g, ' ')

  const pairs = [
    ['#', 'Etapa', 'Descripción', 'hilo_etapas', 3, 3],
    ['#', 'Actor', 'Acción', 'flow_steps', 3, 3],
    ['#', 'Elemento de Documentación', 'Prioridad', 'checklist', 4, 4],
    ['Sección', 'Contenido', null, 'readme_sections', 2, 2],
    ['Capa', 'Descripción', null, 'layers', 2, 2],
    ['Variable', 'Descripción', null, 'kv2', 2, 2],
    ['Constante de código', 'Descripción', null, 'kv2_const', 2, 2],
    ['Término', 'Definición de negocio', 'Representación en el sistema', 'glossary', 3, 3],
    ['Atributo', 'Detalle', null, 'api_attr', 2, 2],
    ['Código HTTP', 'Condición', 'Body de respuesta', 'http_resp', 3, 3],
    ['Campo', 'Requerido', 'Descripción', 'body_fields', 3, 3],
    ['Herramienta', 'Versión requerida', null, 'prereq', 2, 2],
    ['Comando', 'Descripción', null, 'scripts', 2, 2],
    ['Problema', 'Solución', null, 'troubleshoot', 2, 2],
    ['Tipo', 'Formato', 'Ejemplo', 'branches', 3, 3],
    ['Prefijo', 'Cuándo usarlo', null, 'commits', 2, 2],
    ['Módulo', 'Qué cubre', null, 'tests_modules', 2, 2],
    ['ID', 'Decisión', 'Justificación identificada', 'adr_list', 3, 3],
    ['Campo', 'Contenido esperado', null, 'adr_template', 2, 2],
    ['Situación', 'Qué cambia en el flujo', null, 'edge_cases', 2, 2],
    ['Versión', 'Estado', null, 'changelog', 2, 2],
    ['Rol', 'Acceso al mapa de bodega', null, 'rbac', 2, 2],
    ['Secreto', 'Regla de manejo', null, 'secrets', 2, 2],
    ['Aspecto', 'Desarrollo (dev)', 'Producción (prod)', 'env_compare', 3, 3],
    ['Flujo', 'Descripción', null, 'promote', 2, 2],
    ['Propósito', 'Herramienta recomendada', null, 'observability', 2, 2],
    ['Componente', 'Cuándo incrementar', 'Ejemplo', 'semver', 3, 3],
    ['Escenario', 'Descripción', null, 'migration_known', 2, 2],
    ['Componente', 'Descripción', null, 'ui_components', 2, 2],
    ['Normativa', 'Aplicabilidad al sistema', null, 'compliance', 2, 2],
    ['Área', 'Responsable / Contacto', null, 'team_map', 2, 2],
    ['Función', 'Descripción', null, 'functions', 2, 2],
  ]

  for (const [c0, c1, c2, key, colCount, headerLines] of pairs) {
    if (trimmed !== c0) continue
    if (lines[i + 1]?.trim() !== c1) continue
    if (c2 && lines[i + 2]?.trim() !== c2) continue
    const cols = TABLE_HEADERS[key] ?? (c2 ? [c0, c1, c2] : [c0, c1])
    return { key, cols, colCount, headerLines }
  }

  return null
}
