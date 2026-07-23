/**
 * Documentación de testing — Polaria WMS.
 * Fuente de verdad de la referencia `/referencia/testing/bodega-frio`.
 * Alineado a los repos: polaria-wms-api, polaria-wms-web, polaria-wms-db, Widget-react (Jul 2026).
 */
import { POLARIA_STATUS_CALLOUT } from './polariaWmsMeta.js'

/** Frameworks y comandos por repositorio. */
export const POLARIA_TESTING_STACK = [
  {
    repo: 'polaria-wms-api',
    framework: 'Jest + ts-jest + Supertest (e2e)',
    unit: '37 archivos `*.spec.ts` (~212 casos)',
    e2e: '11 suites `test/*.e2e-spec.ts` (47 casos)',
    commands: ['npm test', 'npm run test:watch', 'npm run test:cov', 'npm run test:e2e'],
    config: 'rootDir `src`, `testRegex .*\\.spec\\.ts$`, `testEnvironment node`',
  },
  {
    repo: 'polaria-wms-web',
    framework: 'Vitest + Testing Library + jsdom',
    unit: '124 archivos `*.test.ts(x)` co-localizados',
    e2e: '—',
    commands: ['npm test', 'npm run test:watch'],
    config: '`vitest.config.ts`, setup `src/test/setup.ts`, mock Supabase en `src/test/create-supabase-mock.ts`',
  },
  {
    repo: 'Widget-react',
    framework: 'Vitest + happy-dom',
    unit: '8 archivos, 62 casos (solo módulos `lib/` + embed)',
    e2e: '—',
    commands: ['npm run test'],
    config: '`vite.config.ts` → `test.environment happy-dom`',
  },
  {
    repo: 'polaria-wms-db',
    framework: 'Scripts SQL de validación (Supabase)',
    unit: 'validate-rls-*.sql, validate-widget-auth-pol137.sql, validate-mapa-pol141.sql',
    e2e: '—',
    commands: ['supabase db push', 'psql < scripts/validate-rls-operativo.sql'],
    config: 'Validación de RLS multi-tenant y consistencia de esquema',
  },
]

/** Qué se cubre hoy, por dominio. */
export const POLARIA_TESTING_COVERAGE = [
  { area: 'Autenticación / SSO', detail: 'auth.service.spec.ts (23), auth.e2e-spec.ts (12), token widget (POL-137)' },
  { area: 'Aislamiento tenant', detail: 'tenant-scope.util.spec.ts (9) + tenant-isolation.e2e-spec.ts (cross-tenant rechazado)' },
  { area: 'Compras', detail: 'solicitud-compra.service.spec.ts (13), orden-compra.service.spec.ts (14)' },
  { area: 'Bodega / layout', detail: 'bodega-layout-bootstrap.service.spec.ts (9)' },
  { area: 'Inventario / mapa (POL-141)', detail: 'fefo-warehouse-state.util, assert-warehouse-state-lock.util, warehouse-state-lock.e2e (concurrencia)' },
  { area: 'Operaciones y procesamiento', detail: 'operaciones.e2e, operaciones-tareas.e2e, procesamiento-flujo.e2e' },
  { area: 'Web — navegación por rol', detail: 'navigation-role-gate.integration.test.ts (nav ↔ RBAC)' },
  { area: 'Web — pantallas', detail: 'ComprasPageContent.test.tsx, guards de auth, operational-pages.test.tsx' },
  { area: 'Widget Mateo', detail: 'authToken, webhook, conversationApi, cloudinary, storage, embed (POL-137)' },
]

/** Convenciones para nuevos tests. */
export const POLARIA_TESTING_CONVENTIONS = [
  'API (Jest): archivos `*.spec.ts` junto al código; e2e en `test/*.e2e-spec.ts` con Supertest.',
  'Web (Vitest): archivos `*.test.tsx` co-localizados; mockear Supabase con `create-supabase-mock.ts`.',
  'Nombrar los casos por comportamiento observable (dado/cuando/entonces), no por implementación.',
  'Cada corrección de bug debe llegar con un test que reproduzca el fallo.',
  'Validar siempre el aislamiento por tenant (codigo_cuenta / id_bodega) en flujos con escritura.',
]

/** Casos críticos que deben cubrirse siempre. */
export const POLARIA_TESTING_CRITICAL = [
  'RLS multi-tenant: ningún rol puede leer/escribir fuera de su empresa → cuenta → bodega.',
  'Máquinas de estado (SOL, OC, OV, OT, procesamiento): transiciones válidas e inválidas.',
  'Recepción por conciliación ciega: diferencias de cantidad y temperatura fuera de rango.',
  'Concurrencia en el mapa: lock/unlock de posiciones y `warehouse_state.version` (POL-141).',
  'SSO Mateo: código de un solo uso (60s) y JWT de widget (300s) — expiración y reintento 401.',
  'Guards por rol: cada endpoint rechaza roles no autorizados (RolesGuard + SensitiveWriteGuard).',
]

/** CI configurado. */
export const POLARIA_TESTING_CI =
  'polaria-wms-api: GitHub Actions (`.github/workflows/ci.yml`) — Node 20 → `npm ci` → `build` → `test` → `test:e2e` en push/PR a `main`.'

export function formatPolariaTestingMarkdown() {
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Documentación de testing',
    '',
    'Estrategia de pruebas de Polaria WMS a través de sus cuatro repositorios. Cada repo tiene su propio framework y comandos.',
    '',
    '### Framework y comandos por repositorio',
    '',
    '| Repositorio | Framework | Unit | E2E | Comandos |',
    '| --- | --- | --- | --- | --- |',
  ]
  for (const t of POLARIA_TESTING_STACK) {
    const cmds = t.commands.map((c) => `\`${c}\``).join(' · ')
    lines.push(`| [${t.repo}](https://github.com/PolariaTech/${t.repo}) | ${t.framework} | ${t.unit} | ${t.e2e} | ${cmds} |`)
  }

  lines.push('', '### Qué se cubre hoy', '', '| Área | Detalle |', '| --- | --- |')
  for (const c of POLARIA_TESTING_COVERAGE) {
    lines.push(`| ${c.area} | ${c.detail} |`)
  }

  lines.push('', '### Convenciones para nuevos tests', '')
  for (const c of POLARIA_TESTING_CONVENTIONS) lines.push(`- ${c}`)

  lines.push('', '### Casos críticos a cubrir', '')
  for (const c of POLARIA_TESTING_CRITICAL) lines.push(`- ${c}`)

  lines.push('', '### Integración continua', '', POLARIA_TESTING_CI)

  return lines.join('\n')
}
