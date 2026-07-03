/**
 * Seguridad Polaria WMS — referencia Dev Hub.
 * Stack: Supabase Auth + PostgreSQL RLS + NestJS guards.
 * Incluye evaluación técnica (seguridad y escalabilidad).
 */
import { POLARIA_WMS, POLARIA_RLS_STRATEGY, POLARIA_STATUS_CALLOUT } from './polariaWmsMeta.js'
import { WMS_ROLES } from './wmsRoles.js'

/** Observaciones de la evaluación técnica — estado vs implementación actual */
const SECURITY_OBSERVATIONS = [
  {
    title: 'Defensa en profundidad sin modelo de amenazas explícito',
    detail:
      'No basta con listar capas; hay que demostrar contra qué ataques protegen: XSS, replay, credential stuffing, escalamiento horizontal mal configurado, amenazas internas (insider), entre otros.',
    status: 'partial',
  },
  {
    title: 'Auth centralizado (Supabase) no equivale a seguridad completa',
    detail:
      'Falta detallar controles operativos: MFA obligatoria por rol crítico, políticas de contraseña, bloqueo progresivo ante intentos fallidos, rate limiting por IP/usuario, detección de abuso.',
    status: 'partial',
  },
  {
    title: 'JWT + sesiones controladas: falta gobernanza de sesión',
    detail:
      'Rotación de refresh token, revocación inmediata en incidentes, gestión de sesiones concurrentes, invalidación por cambio de privilegios.',
    status: 'partial',
  },
  {
    title: 'RLS / multi-tenant: excelente en teoría, delicado en práctica',
    detail:
      'El riesgo clásico es asumir que «tener RLS» ya es suficiente. Lo crítico es demostrar consistencia de scope en todas las rutas, queries y procesos batch/async.',
    status: 'partial',
  },
  {
    title: 'CORS restrictivo ayuda, pero no es control de acceso',
    detail:
      'CORS evita usos desde ciertos orígenes en el navegador, pero no detiene clientes maliciosos fuera del browser.',
    status: 'design',
  },
  {
    title: 'Auditoría y trazabilidad: falta inmutabilidad',
    detail:
      'Los logs críticos deben ser resistentes a manipulación, con retención, alertas y cadena forense mínima.',
    status: 'partial',
  },
  {
    title: 'Huecos reconocidos en la documentación',
    detail:
      'Reglas granulares por rol, refresh token robusto, auditoría de acciones críticas, SSO empresarial — seguridad en proceso de maduración.',
    status: 'partial',
  },
]

const SCALABILITY_OBSERVATIONS = [
  {
    title: '«Escalar sin reescribir» — falta validación de cuellos de botella',
    detail: 'Definir límites de throughput por módulo y estrategia ante saturación.',
    status: 'design',
  },
  {
    title: 'Multi-tenant y riesgo «noisy neighbor»',
    detail: 'Cuotas por tenant, rate limits por tenant, aislamiento de carga.',
    status: 'design',
  },
  {
    title: 'Realtime + estado operativo en vivo como hotspot',
    detail: 'Partición, control de concurrencia y backpressure para warehouse_state y cola operativa.',
    status: 'partial',
  },
  {
    title: 'PostgreSQL/Supabase escala bien, pero no infinitamente',
    detail: 'Índices por patrón real, connection pooling, jobs async/colas, archivado histórico, política de crecimiento.',
    status: 'partial',
  },
  {
    title: 'Separación lectura/escritura sin estrategia de consistencia',
    detail: 'Riesgo de drift entre vista operativa (lecturas web) y fuente transaccional (API).',
    status: 'partial',
  },
  {
    title: 'CI/CD y pruebas incompletos para escala',
    detail: 'Faltan pruebas de carga, estrés, soak y caos; SLOs de latencia y error.',
    status: 'design',
  },
  {
    title: 'DR y resiliencia multi-zona/región',
    detail: 'RPO/RTO, failover y simulaciones de caída no documentados explícitamente.',
    status: 'design',
  },
]

const STATUS_ICON = {
  done: '✅',
  partial: '🟡',
  design: '🔵',
}

function roleTableRows() {
  return WMS_ROLES.map((r) => `| ${r.nombre} | \`${r.codigo}\` | ${r.nivel} | ${r.descripcion} |`).join('\n')
}

export function formatPolariaSecurityMarkdown() {
  const rls = POLARIA_RLS_STRATEGY
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Seguridad y autenticación — Polaria WMS',
    '',
    `Stack actual: **Supabase Auth** + **PostgreSQL (RLS)** + **polaria-wms-api** (NestJS, JWT, guards). **No se usa Firebase** en el producto V2.`,
    '',
    'Repos: [polaria-wms-api](' + POLARIA_WMS.repos.api.url + ') · [polaria-wms-web](' + POLARIA_WMS.repos.web.url + ') · [polaria-wms-db](' + POLARIA_WMS.repos.db.url + ')',
    '',
    '### Autenticación',
    '',
    '| Aspecto | Implementación | Estado |',
    '| --- | --- | --- |',
    '| Proveedor | Supabase Auth (email/contraseña) | ✅ |',
    '| Flujo login | `POST /auth/prelogin` → validar empresa + usuario → `POST /auth/login` | ✅ |',
    '| Contextos | `platform` (configurador) · `tenant` (cuenta/bodega) | ✅ |',
    '| Token | JWT Sup + refresh Supabase; perfil vía `GET /auth/me` | ✅ |',
    '| SSO Mateo | `mateo-handoff` / `mateo-exchange` (código 60s) | ✅ |',
    '| Header cliente | `x-auth-client: wms \\| mateo` en prelogin/login | ✅ |',
    '| Logout | `POST /auth/logout` — invalida sesión Supabase | ✅ |',
    '',
    '> La autorización en cliente puede eludirse. **RLS en PostgreSQL** y **guards en la API** son la barrera real en servidor.',
    '',
    '### Autorización (RBAC)',
    '',
    'Roles definidos en el enum `WmsRol` (Prisma/Supabase). La API aplica `JwtAuthGuard`, `TenantGuard` y `RolesGuard` en rutas protegidas.',
    '',
    '| Rol | Código | Nivel | Alcance |',
    '| --- | --- | --- | --- |',
    roleTableRows(),
    '',
    '### ' + rls.title,
    '',
    '| Canal | Credencial | RLS |',
    '| --- | --- | --- |',
    ...rls.rows.map((r) => `| ${r.channel} | ${r.credential} | ${r.rls} |`),
    '',
    '**Tablas solo backend** (sin lectura directa desde web): `' + rls.backendOnlyTables.join('`, `') + '`.',
    '',
    '**Anti-patrones:**',
    ...rls.antiPatterns.map((a) => `- ${a}`),
    '',
    '### Guards API (NestJS)',
    '',
    '| Guard | Función |',
    '| --- | --- |',
    '| `JwtAuthGuard` | Valida JWT Supabase en header `Authorization` |',
    '| `TenantGuard` | Resuelve contexto tenant (`codeCuenta`, bodegas) desde JWT |',
    '| `RolesGuard` | Comprueba rol contra decorador `@Roles(...)` |',
    '',
    'Escrituras sensibles (bodegas, SOL/OC, usuarios) pasan por API con Prisma + `DATABASE_URL` (bypass RLS) y validación de tenant en código.',
    '',
    '### Manejo de secretos',
    '',
    '| Secreto | Regla |',
    '| --- | --- |',
    '| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor API. **Nunca** en el browser. |',
    '| `DATABASE_URL` (Prisma) | Solo polaria-wms-api. Bypass RLS controlado. |',
    '| `VITE_SUPABASE_ANON_KEY` | Pública por diseño; RLS limita acceso por fila. |',
    '| `MATEO_HANDOFF_SECRET` | Solo API; firma intercambio SSO. |',
    '| Contraseñas | Gestionadas por Supabase Auth; la app no las almacena. |',
    '| Cloudinary / n8n | Secretos en route handlers server-side (web) o env API. |',
    '',
    '---',
    '',
    '## Evaluación técnica — Seguridad y escalabilidad',
    '',
    '*Análisis crítico de la arquitectura (multi-tenant, RLS, JWT, API stateless, módulos, CI/CD).*',
    '',
    '### Resumen ejecutivo',
    '',
    'La documentación está bien orientada y comunica una arquitectura moderna con **Supabase** como pilar. Sin embargo, describe más una **intención sólida** que una **garantía operativa completa**: los pilares de diseño son correctos, pero falta evidencia de que estén formalizados, probados y operativizados.',
    '',
    '### Observaciones de seguridad',
    '',
  ]

  for (const [i, obs] of SECURITY_OBSERVATIONS.entries()) {
    const icon = STATUS_ICON[obs.status] ?? '🟡'
    lines.push(`${i + 1}. **${obs.title}** ${icon}`)
    lines.push('')
    lines.push(obs.detail)
    lines.push('')
  }

  lines.push('### Observaciones de escalabilidad', '')

  for (const [i, obs] of SCALABILITY_OBSERVATIONS.entries()) {
    const icon = STATUS_ICON[obs.status] ?? '🟡'
    lines.push(`${i + 1}. **${obs.title}** ${icon}`)
    lines.push('')
    lines.push(obs.detail)
    lines.push('')
  }

  lines.push(
    '### Veredicto',
    '',
    '| Dimensión | Evaluación |',
    '| --- | --- |',
    '| **Seguridad** | Buena base conceptual (Supabase Auth + RLS + guards API), pero controles críticos por formalizar y operativizar. |',
    '| **Escalabilidad** | Diseño modular y stateless correcto para crecer; faltan pruebas de carga y políticas de operación para crecimiento exigente. |',
    '',
    '### Checklist semáforo (hoja de ruta)',
    '',
    '| Prioridad | Ítem | Estado |',
    '| --- | --- | --- |',
    '| Alta | Modelo de amenazas documentado | 🔵 |',
    '| Alta | MFA + rate limiting en auth | 🔵 |',
    '| Alta | Gobernanza refresh token / revocación | 🟡 |',
    '| Alta | Tests de consistencia RLS (todas las rutas) | 🟡 |',
    '| Media | Auditoría inmutable (`auditoria_operacion`) | 🟡 |',
    '| Media | Rate limits por tenant | 🔵 |',
    '| Media | Pruebas de carga / estrés / SLOs | 🔵 |',
    '| Baja | DR documentado (RPO/RTO, failover) | 🔵 |',
    '',
    '**Leyenda:** ✅ implementado · 🟡 parcial / en progreso · 🔵 diseño / pendiente',
  )

  return lines.join('\n')
}
