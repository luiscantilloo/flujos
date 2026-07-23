import { useMemo, useRef } from 'react'
import { HiArrowLeft, HiArrowRight, HiOutlineSparkles } from 'react-icons/hi2'
import { DocMarkdownView } from '../docs/DocMarkdownView.jsx'
import { DocDownloadMenu } from '../docs/components/DocDownloadMenu.jsx'
import { PortalIcon } from '../home/portalIcons.jsx'
import { ACCENT_STYLES } from '../home/portalAccents.js'
import {
  MANUAL_ENTRIES,
  MANUAL_INDEX_GROUPS,
  getManualEntry,
  getManualMarkdown,
} from '../data/userManuals.js'

function ManualCard({ entry, onSelect }) {
  const accent = ACCENT_STYLES[entry.accent] ?? ACCENT_STYLES.slate
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      className={`portal-card-hover group relative w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 text-left shadow-lg ${accent.border}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accent.iconBg}`}>
            <PortalIcon name={entry.icon} className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <HiArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-violet-300" aria-hidden />
        </div>
        <div className="mt-4 min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-slate-50">{entry.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{entry.summary}</p>
        </div>
      </div>
    </button>
  )
}

function ManualIndex({ onSelect, onBackToMain }) {
  const grouped = useMemo(
    () =>
      MANUAL_INDEX_GROUPS.map((g) => ({
        ...g,
        entries: MANUAL_ENTRIES.filter((e) => e.category === g.id),
      })).filter((g) => g.entries.length > 0),
    [],
  )

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_-15%,rgba(139,92,246,0.12),transparent)]" />
      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={onBackToMain}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            Menú principal
          </button>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">Manual de usuario</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Manuales por rol, proceso y función</h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
              Guía en lenguaje claro de cómo funciona cada rol del WMS: qué ve, qué puede hacer y el paso a paso.
              Pensado como base de conocimiento para <strong className="font-medium text-slate-300">Mateo Support</strong> y
              para el onboarding del equipo.
            </p>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-2.5 text-sm text-violet-100/90">
            <HiOutlineSparkles className="h-4 w-4 shrink-0" aria-hidden />
            Cada manual se puede descargar (Markdown/PDF) para entregarlo al soporte.
          </p>

          <div className="mt-10 space-y-10">
            {grouped.map((group) => (
              <section key={group.id}>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-200">{group.label}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{group.description}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.entries.map((entry) => (
                    <ManualCard key={entry.id} entry={entry} onSelect={onSelect} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ManualEntryView({ entry, onBackToIndex }) {
  const contentRef = useRef(null)
  const markdown = useMemo(() => getManualMarkdown(entry.id), [entry.id])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-15%,rgba(16,185,129,0.1),transparent)]" />
      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={onBackToIndex}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            Todos los manuales
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">Manual de usuario</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50">{entry.title}</h2>
          <p className="mt-2 text-sm text-slate-400">{entry.summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <DocDownloadMenu
              title={`Manual — ${entry.title}`}
              markdown={markdown}
              sourcePath={null}
              contentRef={contentRef}
            />
          </div>

          <div
            ref={contentRef}
            className="mt-8 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/35 p-4 sm:p-8"
          >
            <DocMarkdownView markdown={markdown} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ManualUsuarioPortal({ entryId, onSelectEntry, onBackToIndex, onBackToMain }) {
  const entry = entryId ? getManualEntry(entryId) : null

  if (!entry) {
    return <ManualIndex onSelect={onSelectEntry} onBackToMain={onBackToMain} />
  }

  return <ManualEntryView entry={entry} onBackToIndex={onBackToIndex} />
}
