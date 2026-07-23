import { POLARIA_STATUS_CALLOUT, POLARIA_WMS } from './polariaWmsMeta.js'

const TESTING_SUMMARY = [
  {
    repo: 'polaria-wms-web',
    stack: 'Vitest + Testing Library (jsdom)',
    command: 'npm test',
    coverage: '465 tests detectados · 454 pasando · 11 fallando (última revisión Jul 2026)',
    focus: 'Auth/guards, mapa realtime, estado bodega, compras, recepción, integración, operaciones',
  },
  {
    repo: 'polaria-wms-api',
    stack: 'Jest unit + e2e (Nest testing)',
    command: 'npm test && npm run test:e2e',
    coverage: '37+ suites unitarias y 12 suites e2e (mucho mock; poco BD real)',
    focus: 'Guards, auth, compras, inventario/locks, operaciones, procesamiento, Mateo widget',
  },
  {
    repo: 'polaria-wms-db',
    stack: 'SQL validation scripts + Supabase CLI checks',
    command: 'psql -f scripts/validate-*.sql',
    coverage: 'Validaciones RLS, multitenant, mapa POL-141, widget POL-137/POL-138',
    focus: 'RLS, aislación tenant/bodega, consistencia warehouse_state, políticas widget_*',
  },
  {
    repo: 'Widget-react',
    stack: 'Vitest (happy-dom)',
    command: 'npm test',
    coverage: '62 tests en 8 archivos',
    focus: 'token auth, webhook, repositorio conversaciones, storage, API embed',
  },
]

const WEB_CRITICAL_TESTS = [
  'src/hooks/warehouse/useWarehouseStateRealtime.test.tsx',
  'src/modules/warehouses/estado-bodega/utils/*.test.ts',
  'src/modules/inventory/shared/services/inventory-api.service.ts (contratos lock/unlock)',
  'src/modules/purchases/* (solicitudes, órdenes, recepción)',
  'src/app/api/*/route.test.ts (n8n/Cloudinary/alertas)',
]

const API_CRITICAL_TESTS = [
  'test/warehouse-state-lock.e2e-spec.ts',
  'src/modules/inventory/utils/fefo-warehouse-state.util.spec.ts',
  'src/modules/operations/utils/map-ejecutar-orden-error.spec.ts',
  'test/procesamiento-flujo.e2e-spec.ts',
  'test/mateo-widget-auth.e2e-spec.ts',
]

const DB_VALIDATION_SCRIPTS = [
  'scripts/validate-phase1.sql',
  'scripts/validate-rls-multitenant.sql',
  'scripts/validate-rls-operativo.sql',
  'scripts/validate-mapa-pol141.sql',
  'scripts/validate-widget-auth-pol137.sql',
  'scripts/validate-rls-pol138.sql',
]

const TESTING_GAPS = [
  'Polaria web: 11 pruebas fallando en recepción, smoke operativos y barra de acciones jefe bodega.',
  'Polaria API: la mayoría de e2e usa mocks; falta validación end-to-end contra BD real para concurrencia.',
  'Polaria DB: no hay CI activa en el repo; validaciones SQL dependen de ejecución manual.',
  'Widget-react: documentación desactualizada en conteo de tests y variables legacy ya eliminadas.',
]

export function formatPolariaTestingMarkdown() {
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Documentación de testing — Bodega Frío / Polaria WMS',
    '',
    `Fuentes: [${POLARIA_WMS.repos.web.name}](${POLARIA_WMS.repos.web.url}) · [${POLARIA_WMS.repos.api.name}](${POLARIA_WMS.repos.api.url}) · [${POLARIA_WMS.repos.db.name}](${POLARIA_WMS.repos.db.url}) · [${POLARIA_WMS.repos.widget.name}](${POLARIA_WMS.repos.widget.url})`,
    '',
    '### Matriz de estrategia por repositorio',
    '',
    '| Repositorio | Stack de pruebas | Comando base | Cobertura observada | Áreas críticas |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const item of TESTING_SUMMARY) {
    lines.push(`| ${item.repo} | ${item.stack} | \`${item.command}\` | ${item.coverage} | ${item.focus} |`)
  }

  lines.push(
    '',
    '### Suites críticas recomendadas para regresión rápida',
    '',
    '**Frontend (`polaria-wms-web`)**',
    ...WEB_CRITICAL_TESTS.map((item) => `- \`${item}\``),
    '',
    '**Backend (`polaria-wms-api`)**',
    ...API_CRITICAL_TESTS.map((item) => `- \`${item}\``),
    '',
    '**Base de datos (`polaria-wms-db`)**',
    ...DB_VALIDATION_SCRIPTS.map((item) => `- \`${item}\``),
    '',
    '### Flujo mínimo antes de release',
    '',
    '1. Ejecutar lint + tests unitarios del frontend y resolver fallos abiertos.',
    '2. Ejecutar unit + e2e de API, priorizando inventario/locks/procesamiento/compras.',
    '3. Correr scripts SQL de validación RLS y mapa para confirmar aislamiento por tenant.',
    '4. Ejecutar smoke del Widget Mateo embebido en entorno WMS (token, mensaje, historial).',
    '',
    '### Hallazgos y brechas actuales',
    '',
    ...TESTING_GAPS.map((item) => `- 🟡 ${item}`),
    '',
    '### Checklist QA para soporte (Mateo Support)',
    '',
    '- [ ] Login por empresa/tenant funciona para al menos un rol de cuenta y un rol de bodega.',
    '- [ ] Mapa refleja cambios de `warehouse_state` en menos de 2 s con realtime activo.',
    '- [ ] Lock/unlock responde 200 para roles permitidos y 403 para roles no permitidos.',
    '- [ ] Flujo SOL → OC → recepción cierra sin inconsistencias de estado.',
    '- [ ] Widget Mateo envía mensajes, persiste conversación y recupera historial al recargar.',
    '- [ ] No hay fugas de datos cross-tenant en listados de inventario/compras/conversaciones.',
  )

  return lines.join('\n')
}
