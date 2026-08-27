/**
 * Checklist del proyecto — Dev Hub (ago 2026).
 * No depende del Word v1.0; ChecklistPortal parsea la tabla de este markdown.
 */
import { POLARIA_STATUS_CALLOUT } from './polariaWmsMeta.js'

/** Filas: [elemento, prioridad, estado] — estado: Completo | Parcial | Pendiente */
const CHECKLIST_ROWS = [
  ['README de cada repo (web, api, db, widget, Dev Hub)', 'Alta', 'Completo'],
  ['Diagrama de arquitectura (Dev Hub)', 'Alta', 'Completo'],
  ['API OpenAPI / Swagger (`GET /api/docs`)', 'Alta', 'Completo'],
  ['Variables de entorno documentadas (API, web, widget)', 'Alta', 'Completo'],
  ['Guía de instalación local (Onboarding + Stack y scripts)', 'Alta', 'Completo'],
  ['CONTRIBUTING.md en repos de producto', 'Media', 'Pendiente'],
  ['Glosario de dominio (manual de usuario)', 'Alta', 'Completo'],
  ['Flujos de negocio E2E (diagramas + 19 guías de operador)', 'Alta', 'Completo'],
  ['Architecture Decision Records (ADRs del stack actual)', 'Media', 'Pendiente'],
  ['Documentación de testing (Jest e2e, Vitest, RLS)', 'Media', 'Completo'],
  ['Runbooks de operación y deploy (Nest/Render, Next/Vercel)', 'Media', 'Completo'],
  ['Guía de onboarding para nuevos desarrolladores', 'Media', 'Completo'],
  ['CHANGELOG.md en repos de producto', 'Media', 'Parcial'],
  ['Seguridad: Supabase Auth, RLS, guards Nest, RBAC', 'Alta', 'Completo'],
  ['Entornos local vs producción (puertos, secretos, hosting)', 'Media', 'Completo'],
  ['Observabilidad centralizada (métricas, alertas SLO)', 'Baja', 'Pendiente'],
  ['Política de versionado semántico (SemVer)', 'Baja', 'Parcial'],
  ['Migraciones Postgres 001–066 documentadas', 'Alta', 'Completo'],
  ['Storybook o catálogo de componentes UI', 'Baja', 'Pendiente'],
  ['Compliance y normativas aplicables', 'Baja', 'Pendiente'],
  ['Modelo Prisma de `precio_producto` (hoy solo Postgres + JS)', 'Alta', 'Pendiente'],
  ['Schema por empresa `emp_*` (migración 062)', 'Alta', 'Completo'],
  ['Mateo Support (widget, JWT, schema `mateo_support`)', 'Alta', 'Completo'],
  ['Mapa actual + estructura de carpetas web/API', 'Alta', 'Completo'],
  ['Playwright E2E en polaria-wms-web (producto)', 'Media', 'Pendiente'],
  ['Integración Fridem en producción', 'Media', 'Parcial'],
  ['FEFO automático completo en todas las salidas', 'Media', 'Parcial'],
  ['Manual de usuario para operadores (portal `/manual-usuario`)', 'Alta', 'Completo'],
]

export function formatPolariaChecklistMarkdown() {
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Estado de la documentación del proyecto',
    '',
    'Checklist viva de **Polaria WMS** (ago 2026). Completo = existe y está alineado al código actual. Parcial = hay algo, pero falta madurar. Pendiente = no hay entregable usable.',
    '',
    '| # | Elemento de Documentación | Prioridad | Estado |',
    '| --- | --- | --- | --- |',
  ]
  CHECKLIST_ROWS.forEach((row, i) => {
    lines.push(`| ${i + 1} | ${row[0]} | ${row[1]} | ${row[2]} |`)
  })
  lines.push(
    '',
    '> **Nota.** Los ADRs hay que escribirlos sobre el stack actual: Supabase Auth, PostgreSQL + RLS, Nest y `warehouse_state`.',
    '',
    'No regenerar la documentación V2.0 con `npm run docs:bodega-v20` a ciegas: pisa el markdown alineado a agosto 2026.',
  )
  return lines.join('\n')
}
