import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { HiArrowLeft, HiOutlineCircleStack } from 'react-icons/hi2'
import {
  CLASS_DIAGRAM,
  ONBOARDING_CLASS_DIAGRAM,
  ENTITIES,
  ROL_SEED_ROWS,
  SCHEMA_ENUMS,
  SUPABASE_MAPPING,
  NORMALIZATION_RULES,
  SCHEMA_DOMAINS,
  SCHEMA_META,
  SCHEMA_ONBOARDING,
  AUTH_LOGIN_V20,
  V20_DOC_ID,
  V20_STORAGE_TREE,
  formatFieldType,
  getEntitiesByDomain,
  getEntityOnboarding,
  ONBOARDING_PHASE_LABELS,
} from '../data/bodegaDatabaseSchema.js'
import { WMS_ROLES } from '../data/wmsRoles.js'
import { Link } from 'react-router-dom'
import { paths } from '../router/paths.js'
import { MermaidDiagram } from './components/MermaidDiagram.jsx'
import { DatabaseErDiagramPanel } from '../architecture/DatabaseErDiagramPanel.jsx'

const ONBOARDING_ACCENT = {
  ti: 'border-purple-500/40 bg-purple-500/15 text-purple-200',
  admin: 'border-sky-500/40 bg-sky-500/15 text-sky-200',
  mixed: 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200',
  operacion: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
  system: 'border-slate-500/35 bg-slate-500/10 text-slate-300',
}

const DOMAIN_ACCENT = {
  ti: 'border-purple-500/30 bg-purple-500/10 text-purple-200',
  platform: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
  rbac: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
  catalog: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  purchase: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  warehouse: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
  processing: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200',
  sales: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  system: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
}

const TABS = [
  { id: 'overview', label: 'Visión general' },
  { id: 'er', label: 'Diagrama ER' },
  { id: 'class', label: 'Diagrama de clases' },
  { id: 'tables', label: 'Tablas / colecciones' },
]

function FieldBadge({ children, variant = 'default' }) {
  const styles =
    variant === 'pk'
      ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
      : variant === 'fk'
        ? 'border-sky-400/40 bg-sky-500/15 text-sky-200'
        : 'border-slate-600/50 bg-slate-800/60 text-slate-400'
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${styles}`}>
      {children}
    </span>
  )
}

function EntityCard({ entity, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const accent = DOMAIN_ACCENT[entity.domain] ?? DOMAIN_ACCENT.system
  const onboarding = getEntityOnboarding(entity.id)

  return (
    <article className="rounded-2xl border border-slate-700/60 bg-slate-900/45 shadow-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-5 text-left"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-mono text-xs font-bold ${accent}`}
        >
          {entity.table.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${accent}`}
            >
              {SCHEMA_DOMAINS.find((d) => d.id === entity.domain)?.label ?? entity.domain}
            </span>
            {onboarding ? (
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${ONBOARDING_ACCENT[onboarding.phase] ?? ONBOARDING_ACCENT.system}`}
              >
                {onboarding.label ?? ONBOARDING_PHASE_LABELS[onboarding.phase]}
              </span>
            ) : null}
          </div>
          <h3 className="text-base font-semibold text-slate-50">
            {entity.name}
            {entity.v20Type ? (
              <span className="ml-2 font-mono text-[10px] font-normal text-cyan-300/70">{entity.v20Type}</span>
            ) : null}
          </h3>
          {entity.v20Path ? (
            <p className="mt-1 font-mono text-xs text-emerald-200/90">{entity.v20Path}</p>
          ) : null}
          <p className="mt-1 font-mono text-[11px] text-slate-500">{entity.physical}</p>
          {entity.desc ? <p className="mt-2 text-sm text-slate-400">{entity.desc}</p> : null}
        </div>
        <span className="shrink-0 text-slate-500">{open ? '−' : '+'}</span>
      </button>

      {open ? (
        <div className="border-t border-slate-700/50 px-5 pb-5 pt-4">
          <div className="app-scroll-x rounded-xl border border-slate-700/50">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-950/50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Campo (modelo)</th>
                  <th className="px-3 py-2 font-medium">V2.0 / código</th>
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 font-medium">Claves</th>
                  <th className="px-3 py-2 font-medium">Notas</th>
                </tr>
              </thead>
              <tbody>
                {entity.fields.map((f) => (
                  <tr key={f.name} className="border-b border-slate-800/50 last:border-0">
                    <td className="px-3 py-2 font-mono text-xs text-violet-200">{f.name}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-amber-200/80">
                      {[f.v20Field, f.legacy].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-300">{formatFieldType(f)}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {f.pk ? <FieldBadge variant="pk">PK</FieldBadge> : null}
                        {f.fk ? <FieldBadge variant="fk">FK</FieldBadge> : null}
                        {f.unique ? <FieldBadge>UK</FieldBadge> : null}
                        {f.nullable ? <FieldBadge>NULL</FieldBadge> : null}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-400">
                      {[
                        f.fk,
                        f.enumRef && SCHEMA_ENUMS[f.enumRef]
                          ? `Valores: ${SCHEMA_ENUMS[f.enumRef].values.join(', ')}`
                          : null,
                        f.desc,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {entity.indexes?.length ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Índices</p>
              <ul className="mt-2 space-y-1">
                {entity.indexes.map((idx) => (
                  <li key={idx} className="font-mono text-xs text-cyan-200/90">
                    {idx}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {entity.relations?.length ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Relaciones</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {entity.relations.map((r) => (
                  <li key={`${r.entity}-${r.label}`}>
                    <span className="text-violet-300">{r.card}</span> → {r.entity} ({r.label})
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {entity.id === 'rol' ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filas semilla (9 roles)
              </p>
              <div className="app-scroll-x mt-2 rounded-xl border border-slate-700/50">
                <table className="w-full min-w-[28rem] text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700/60 bg-slate-950/50 text-slate-500">
                      <th className="px-3 py-2">id_rol</th>
                      <th className="px-3 py-2">nombre</th>
                      <th className="px-3 py-2">nivel</th>
                      <th className="px-3 py-2">puede_crear_rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROL_SEED_ROWS.map((row) => (
                      <tr key={row.id_rol} className="border-b border-slate-800/50 last:border-0">
                        <td className="px-3 py-1.5 font-mono text-violet-200">{row.id_rol}</td>
                        <td className="px-3 py-1.5 text-slate-200">{row.nombre}</td>
                        <td className="px-3 py-1.5 text-slate-400">{row.nivel}</td>
                        <td className="px-3 py-1.5 font-mono text-slate-500">{row.puede_crear_rol ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

export function DatabasePortal({ onBackToMain }) {
  const [tab, setTab] = useState('overview')
  const [query, setQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')

  const filteredEntities = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ENTITIES.filter((e) => {
      const matchDomain = domainFilter === 'all' || e.domain === domainFilter
      const matchQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.table.toLowerCase().includes(q) ||
        e.physical.toLowerCase().includes(q) ||
        (e.v20Path?.toLowerCase().includes(q) ?? false) ||
        e.fields.some((f) => f.name.toLowerCase().includes(q) || f.legacy?.toLowerCase().includes(q))
      return matchDomain && matchQuery
    })
  }, [query, domainFilter])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.14),transparent)]" />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
        <button
          type="button"
          onClick={onBackToMain}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 hover:bg-slate-900/80 hover:text-sky-300"
        >
          <HiArrowLeft className="h-4 w-4" aria-hidden />
          Menú principal
        </button>

        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-500/10">
            <HiOutlineCircleStack className="h-7 w-7 text-cyan-300" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
              Modelo relacional · {SCHEMA_META.engine}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
              {SCHEMA_META.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{SCHEMA_META.subtitle}</p>
            <p className="mt-2 text-sm text-purple-200/90">
              Raíz del modelo:{' '}
              <span className="font-semibold">
                {ENTITIES.find((e) => e.id === SCHEMA_META.rootEntity)?.name ?? 'Configurador (TI)'}
              </span>
              {' '}
              — no empieza en empresa.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {ENTITIES.length} entidades · Normalización {SCHEMA_META.normalization} · v{SCHEMA_META.version}
            </p>
          </div>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-2 border-b border-slate-800/80 pb-px"
          role="tablist"
          aria-label="Secciones del modelo"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={[
                'rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'border border-b-0 border-slate-700/70 bg-slate-900/80 text-cyan-200'
                  : 'text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === 'overview' ? (
            <div className="space-y-8">
              <section className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4">
                <h3 className="text-lg font-semibold text-slate-100">Fuente: documentación V2.0</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Este modelo replica la jerarquía de colecciones del{' '}
                  <Link
                    to={paths.doc(V20_DOC_ID)}
                    className="text-cyan-300 underline decoration-cyan-500/40 hover:text-cyan-200"
                  >
                    §7 Modelo de Datos
                  </Link>
                  . Los nombres en columna «V2.0 / código» coinciden con el documento y el código TypeScript.
                </p>
                <pre className="app-scroll-x mt-4 rounded-lg border border-slate-700/50 bg-slate-950/80 p-3 font-mono text-[11px] leading-relaxed text-emerald-200/90">
                  {V20_STORAGE_TREE}
                </pre>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-100">Tipos de columna (PostgreSQL)</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Los identificadores de negocio usan <code className="text-cyan-300">varchar</code>; usuarios y
                  eventos usan <code className="text-cyan-300">uuid</code>; estados y roles cerrados usan{' '}
                  <code className="text-cyan-300">enum</code> con valores listados abajo.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(SCHEMA_ENUMS).map(([key, def]) => (
                    <div
                      key={key}
                      className="rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2"
                    >
                      <p className="font-mono text-xs font-semibold text-violet-200">
                        {def.pg ?? key}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                        {def.values.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-100">{AUTH_LOGIN_V20.title}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className={`rounded-xl border p-4 ${ONBOARDING_ACCENT.ti}`}>
                    <p className="text-sm font-semibold">Configurador (TI)</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm">
                      {AUTH_LOGIN_V20.configurador.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>
                  <div className={`rounded-xl border p-4 ${ONBOARDING_ACCENT.admin}`}>
                    <p className="text-sm font-semibold">Usuario de empresa (cualquier rol)</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm">
                      {AUTH_LOGIN_V20.usuarioEmpresa.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-100">{SCHEMA_ONBOARDING.title}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  El modelo ER distingue qué tablas da de alta el configurador (TI) y cuáles el administrador de
                  cuenta del tenant.
                </p>
                <div className="mt-4 space-y-4">
                  {SCHEMA_ONBOARDING.phases.map((phase) => (
                    <div
                      key={phase.id}
                      className={`rounded-xl border p-4 ${ONBOARDING_ACCENT[phase.id] ?? ONBOARDING_ACCENT.system}`}
                    >
                      <p className="text-sm font-semibold">{phase.label}</p>
                      <p className="mt-0.5 text-xs opacity-80">Actor: {phase.actor}</p>
                      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                        {phase.steps.map((step) => (
                          <li key={step.order}>
                            <span className="font-medium text-slate-100">{step.action}</span>
                            {step.entity ? (
                              <span className="ml-1 font-mono text-xs text-cyan-200/80">({step.entity})</span>
                            ) : null}
                            {step.entities ? (
                              <span className="ml-1 font-mono text-xs text-cyan-200/80">
                                ({step.entities.join(', ')})
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-100">Roles del WMS (9 perfiles)</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Cadena de alta: configurador (TI) → administrador de cuenta → resto de usuarios de empresa y bodega.
                </p>
                <ul className="mt-4 space-y-2">
                  {WMS_ROLES.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-indigo-200">{r.nombre}</span>
                      <span className="ml-2 text-xs uppercase text-slate-500">({r.nivel})</span>
                      <p className="mt-0.5 text-xs text-slate-500">{r.descripcion}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-100">Normalización ({SCHEMA_META.normalization})</h3>
                <ul className="mt-4 space-y-3">
                  {NORMALIZATION_RULES.map((rule) => (
                    <li
                      key={rule.title}
                      className="rounded-xl border border-slate-700/55 bg-slate-900/40 p-4"
                    >
                      <p className="text-sm font-semibold text-violet-200">
                        {rule.nf} — {rule.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{rule.detail}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-100">Mapeo lógico → Supabase</h3>
                <div className="app-scroll-x mt-4 rounded-xl border border-slate-700/55">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/60 bg-slate-950/50 text-xs uppercase text-slate-500">
                        <th className="px-4 py-2">Capa lógica</th>
                        <th className="px-4 py-2">Implementación física</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SUPABASE_MAPPING.map((row) => (
                        <tr key={row.logical} className="border-b border-slate-800/40 last:border-0">
                          <td className="px-4 py-3 text-slate-200">{row.logical}</td>
                          <td className="px-4 py-3 font-mono text-xs text-emerald-200/85">{row.physical}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-100">Dominios del modelo</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SCHEMA_DOMAINS.map((d) => (
                    <div
                      key={d.id}
                      className={`rounded-xl border p-4 ${DOMAIN_ACCENT[d.id] ?? DOMAIN_ACCENT.system}`}
                    >
                      <p className="font-semibold">{d.label}</p>
                      <p className="mt-1 text-sm opacity-80">
                        {getEntitiesByDomain(d.id).length} entidad(es)
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-sm font-medium text-amber-200">Notas de diseño</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-400">
                  {SCHEMA_META.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </section>
            </div>
          ) : null}

          {tab === 'er' ? <DatabaseErDiagramPanel /> : null}

          {tab === 'class' ? (
            <div className="space-y-6">
              <MermaidDiagram
                chart={ONBOARDING_CLASS_DIAGRAM}
                title="Onboarding — TI crea plataforma, admin arma catálogo y equipo"
              />
              <MermaidDiagram
                chart={CLASS_DIAGRAM}
                title="Diagrama de clases — núcleo operativo (inventario y órdenes)"
              />
              <p className="text-sm text-slate-400">
                Las clases embebidas en <code className="text-cyan-200/90">EstadoBodega</code> (Slot, Caja,
                OrdenTrabajo) se materializan hoy en warehouse_state (jsonb) por rendimiento; el modelo lógico
                las trata como tablas hijas para mantener 3NF.
              </p>
            </div>
          ) : null}

          {tab === 'tables' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar tabla, campo o esquema…"
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200"
                >
                  <option value="all">Todos los dominios</option>
                  {SCHEMA_DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-slate-500">
                {filteredEntities.length} de {ENTITIES.length} entidades
              </p>

              <ul className="space-y-4" role="list">
                {filteredEntities.map((entity, i) => (
                  <li key={entity.id}>
                    <EntityCard entity={entity} defaultOpen={i === 0 && !query && domainFilter === 'all'} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

