import { POLARIA_STATUS_CALLOUT, POLARIA_WMS } from './polariaWmsMeta.js'

const TEST_SUITES = [
  {
    repo: 'polaria-wms-web',
    runner: 'Vitest 4 + Testing Library + jsdom',
    count: '125 archivos `*.test.ts(x)`',
    focus:
      'Auth/guards/SSO, navegación por rol, compras, ventas, procesamiento, mapa/estado bodega, route handlers n8n y Widget Mateo host.',
    config: '`vitest.config.ts`, `src/test/setup.ts`, `src/test/create-supabase-mock.ts`',
  },
  {
    repo: 'polaria-wms-api',
    runner: 'Jest 30 + Supertest',
    count: '37 unitarios `*.spec.ts` + 11 suites e2e',
    focus:
      'Auth, tenant isolation, usuarios, compras/recepción, warehouse_state locking, operaciones, procesamiento y Mateo widget.',
    config: '`jest.config` Nest, `test/jest-e2e.json`, `.github/workflows/ci.yml`',
  },
  {
    repo: 'polaria-wms-db',
    runner: 'SQL smoke/RLS scripts',
    count: 'Validadores por política y dominio',
    focus:
      'Aislamiento multi-tenant, RLS operativo, widget auth, mapa POL-141, alineación schema y seeds demo.',
    config: '`scripts/validate-*.sql`, `scripts/verify-*.sql`, `scripts/README.md`',
  },
  {
    repo: 'Widget-react',
    runner: 'Vitest 4 + happy-dom',
    count: '8 archivos `*.test.ts`',
    focus: 'Contrato embed, tokenFetcher, webhook n8n, Cloudinary, storage y conversation API.',
    config: '`vitest.config.ts`, `src/embed.test.ts`, `src/lib/*.test.ts`',
  },
]

const CRITICAL_SCENARIOS = [
  ['Auth + tenant', 'prelogin/login, `GET /auth/me`, roles y redirección dashboard por rol.'],
  ['Aislamiento RLS', 'un tenant no lee ni opera datos de otra cuenta; bodega filtra por `id_bodega`.'],
  ['Alta plataforma', 'configurador crea empresa/cuenta/bodega, bootstrap layout y admin cuenta.'],
  ['Compras', 'SOL → aprobación/rechazo → OC → recepción contra OC con diferencias.'],
  ['Inventario', '`warehouse_state` por ubicación/producto/lote, lock/unlock y movimientos auditables.'],
  ['Operaciones', 'OT, tareas, alertas, llamadas al jefe y presencia operaria.'],
  ['Procesamiento', 'asignación, inicio, cierre con merma/sobrante y órdenes post-cierre.'],
  ['Ventas/transporte', 'OV, emisión, paquete despacho, entrega y evidencias Cloudinary.'],
  ['Mateo', 'SSO handoff/exchange, widget-token, conversación y mensajes persistidos.'],
]

export function formatPolariaTestingMarkdown() {
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Documentación de testing — Polaria WMS',
    '',
    `Fuente auditada: ${POLARIA_WMS.statusDate}. Esta referencia reemplaza la sección legacy V1 y resume los tests reales de los cuatro repositorios del ecosistema.`,
    '',
    '### Matriz por repositorio',
    '',
    '| Repo | Runner | Cobertura actual | Foco | Configuración |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const suite of TEST_SUITES) {
    lines.push(
      `| [${suite.repo}](${POLARIA_WMS.repos[suite.repo === 'Widget-react' ? 'widget' : suite.repo.replace('polaria-wms-', '')]?.url ?? '#'}) | ${suite.runner} | ${suite.count} | ${suite.focus} | ${suite.config} |`,
    )
  }

  lines.push(
    '',
    '### Comandos recomendados',
    '',
    '| Repo | Comando | Cuándo usarlo |',
    '| --- | --- | --- |',
    '| `polaria-wms-web` | `npm test` | UI, servicios frontend, guards y route handlers. |',
    '| `polaria-wms-web` | `npm run lint && npm run build` | Validar Next.js, TypeScript y rutas. |',
    '| `polaria-wms-api` | `npm test` | Unitarios NestJS por módulo. |',
    '| `polaria-wms-api` | `npm run test:e2e` | Contratos HTTP, guards, tenant isolation y flujos críticos. |',
    '| `polaria-wms-api` | `npm run build` | Prisma generate + SWC + tipos del cliente generado. |',
    '| `polaria-wms-db` | `psql -f scripts/validate-rls-multitenant.sql` | Validar RLS local/remoto según entorno. |',
    '| `polaria-wms-db` | `psql -f scripts/validate-widget-auth-pol137.sql` | Validar protección de conversaciones Widget Mateo. |',
    '| `Widget-react` | `npm test` | Contrato embebible, token y APIs externas mockeadas. |',
    '| `flujo` | `npm run lint && npm run build` | Verificar que el Dev Hub renderiza documentación y referencias. |',
    '',
    '### Casos críticos que soporte debe conocer',
    '',
    '| Caso | Qué debe probarse |',
    '| --- | --- |',
  )

  for (const [scenario, detail] of CRITICAL_SCENARIOS) {
    lines.push(`| ${scenario} | ${detail} |`)
  }

  lines.push(
    '',
    '### Convenciones de prueba',
    '',
    '- Mantener fixtures por tenant; nunca reutilizar datos cruzados entre cuentas.',
    '- Para API, probar éxito, rol no autorizado, tenant equivocado y payload inválido.',
    '- Para UI, probar gates visibles y navegación real por rol, no solo render de componentes aislados.',
    '- Para DB, cada migración de RLS nueva debe tener al menos una validación positiva y una negativa.',
    '- Para Mateo Widget, separar el JWT de n8n del Bearer WMS usado para historial de conversaciones.',
    '',
    '### Brechas abiertas',
    '',
    '- Falta formalizar pruebas de carga, estrés, soak y SLOs por módulo.',
    '- Falta automatizar todos los scripts SQL de `polaria-wms-db` dentro de CI remoto.',
    '- Faltan pruebas e2e browser completas para la experiencia multi-rol de bodega.',
  )

  return lines.join('\n')
}
