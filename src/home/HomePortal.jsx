import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { HiArrowLeft, HiArrowRight, HiOutlineSparkles } from 'react-icons/hi2'
import {
  flowApplications,
  portalCategories,
  portalMainSections,
  portalStats,
  PORTAL_BRAND,
} from '../data/portalConfig.js'
import { paths } from '../router/paths.js'
import { getSectionPath } from '../router/resolveSectionPath.js'
import { ACCENT_STYLES } from './portalAccents.js'
import { PortalIcon } from './portalIcons.jsx'

function PortalStatPill({ label, value, accent = 'text-violet-200' }) {
  return (
    <div className="rounded-xl border border-slate-700/55 bg-slate-900/45 px-4 py-2.5 text-center backdrop-blur-sm">
      <p className={`text-xl font-bold tabular-nums ${accent}`}>{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  )
}

function PortalSectionCard({ section, index }) {
  const disabled = !section.enabled
  const accent = ACCENT_STYLES[section.accent] ?? ACCENT_STYLES.slate
  const featured = section.featured
  const to = disabled ? null : getSectionPath(section)

  const className = [
    'portal-fade-in group relative w-full overflow-hidden rounded-2xl border text-left shadow-lg transition-all duration-300',
    featured ? 'p-6 sm:col-span-1' : 'p-4',
    disabled
      ? 'cursor-not-allowed border-slate-800/70 bg-slate-900/30 opacity-60'
      : `portal-card-hover border-slate-700/60 bg-slate-900/45 ${accent.border}`,
  ].join(' ')

  const inner = (
    <>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5 blur-2xl transition-transform duration-500 group-enabled:group-hover:translate-x-1 group-enabled:group-hover:translate-y-1" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex shrink-0 items-center justify-center rounded-xl border ${accent.iconBg} ${featured ? 'h-12 w-12' : 'h-10 w-10'}`}
          >
            <PortalIcon name={section.icon} className={`${featured ? 'h-6 w-6' : 'h-5 w-5'} ${accent.icon}`} />
          </div>
          {!disabled ? (
            <HiArrowRight
              className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-violet-300"
              aria-hidden
            />
          ) : null}
        </div>

        <div className="mt-4 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold tracking-tight text-slate-50 ${featured ? 'text-lg' : 'text-base'}`}>
              {section.title}
            </h3>
            {section.badge ? (
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${accent.badge}`}>
                {section.badge}
              </span>
            ) : null}
            {section.disabledHint ? (
              <span className="rounded-full border border-slate-600/40 bg-slate-800/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {section.disabledHint}
              </span>
            ) : null}
          </div>
          <p className={`mt-2 leading-relaxed text-slate-400 ${featured ? 'text-sm' : 'text-xs'}`}>
            {section.description}
          </p>
        </div>
      </div>
    </>
  )

  if (disabled || !to) {
    return (
      <button
        type="button"
        disabled
        style={{ animationDelay: `${index * 45}ms` }}
        className={className}
        title={section.disabledHint ?? 'No disponible'}
      >
        {inner}
      </button>
    )
  }

  return (
    <Link to={to} style={{ animationDelay: `${index * 45}ms` }} className={className}>
      {inner}
    </Link>
  )
}

function FlowAppCard({ app, index }) {
  const accent = app.accent === 'sky' ? ACCENT_STYLES.sky : ACCENT_STYLES.violet

  return (
    <li>
      <Link
        to={paths.flow(app.id)}
        style={{ animationDelay: `${index * 60}ms` }}
        className={`portal-fade-in portal-card-hover group relative block w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/45 p-5 text-left shadow-lg ${accent.border}`}
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-80`} />
        <div className="relative">
          <div className="flex flex-wrap gap-2">
            {(app.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-slate-950/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-50">{app.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{app.summary}</p>
          <p className="mt-4 text-xs font-medium text-violet-300/90">Abrir diagrama →</p>
        </div>
      </Link>
    </li>
  )
}

export function MainHub() {
  const [query, setQuery] = useState('')

  const filteredByCategory = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (section) => {
      if (!q) return true
      const haystack = [section.title, section.description, ...(section.keywords ?? [])].join(' ').toLowerCase()
      return haystack.includes(q)
    }

    return portalCategories.map((cat) => ({
      ...cat,
      sections: portalMainSections.filter((s) => s.category === cat.id && matches(s)),
    })).filter((cat) => cat.sections.length > 0)
  }, [query])

  const featured = useMemo(
    () => portalMainSections.filter((s) => s.featured && s.enabled),
    [],
  )

  return (
    <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="portal-orb portal-orb-violet absolute -left-32 top-0 h-96 w-96 rounded-full blur-3xl" />
        <div className="portal-orb portal-orb-sky absolute -right-24 top-32 h-80 w-80 rounded-full blur-3xl" />
        <div className="portal-orb portal-orb-emerald absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <header className="portal-fade-in flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
              <HiOutlineSparkles className="h-3.5 w-3.5" aria-hidden />
              {PORTAL_BRAND.subtitle}
            </div>
            <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
              {PORTAL_BRAND.title}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">{PORTAL_BRAND.tagline}</p>
          </div>

          <div className="flex shrink-0 gap-3">
            <PortalStatPill label="Flujos" value={portalStats.flows} accent="text-violet-200" />
            <PortalStatPill label="Docs" value={portalStats.docs} accent="text-sky-200" />
            <PortalStatPill label="Glosario" value={`${portalStats.glossaryTerms}+`} accent="text-amber-200" />
            <PortalStatPill label="Entidades" value={portalStats.schemaEntities} accent="text-cyan-200" />
          </div>
        </header>

        <label className="portal-fade-in relative mt-10 block" style={{ animationDelay: '80ms' }}>
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar flujos, glosario, API, runbooks, onboarding…"
            className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/55 py-3.5 pl-11 pr-4 text-sm text-slate-100 shadow-inner backdrop-blur-sm placeholder:text-slate-500 outline-none transition-all focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
          />
        </label>

        {!query && featured.length > 0 ? (
          <section className="mt-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Destacados</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((section, i) => (
                <PortalSectionCard key={section.id} section={section} index={i} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12 space-y-10">
          {filteredByCategory.map((category) => (
            <section key={category.id}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-200">{category.label}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{category.description}</p>
              </div>
              <div
                className={[
                  'grid gap-3',
                  category.id === 'explore' && !query ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
                ].join(' ')}
              >
                {category.sections
                  .filter((s) => query || !s.featured)
                  .map((section, i) => (
                    <PortalSectionCard key={section.id} section={section} index={i} />
                  ))}
              </div>
            </section>
          ))}
        </div>

        {filteredByCategory.length === 0 ? (
          <p className="mt-16 text-center text-sm text-slate-500">No hay resultados para «{query}».</p>
        ) : null}

        <footer className="mt-16 border-t border-slate-800/60 pt-6 text-center text-xs text-slate-600">
          Herramienta interna de desarrollo · Flujos · Documentación · Referencias
        </footer>
      </div>
    </div>
  )
}

export function FlowsList() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.15),transparent)]" />
      <div className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
        <Link
          to={paths.home}
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
        >
          <HiArrowLeft className="h-4 w-4" aria-hidden />
          Menú principal
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">Explorar</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50">Flujos interactivos</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          Diagramas React Flow navegables. Los que registres en{' '}
          <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs text-emerald-200/90">portalConfig.js</code>{' '}
          aparecen aquí automáticamente.
        </p>

        <ul className="mt-10 flex flex-col gap-4" role="list">
          {flowApplications.map((app, i) => (
            <FlowAppCard key={app.id} app={app} index={i} />
          ))}
        </ul>
      </div>
    </div>
  )
}
