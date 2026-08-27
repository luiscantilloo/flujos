import { useMemo, useState } from 'react'
import { HiArrowLeft, HiOutlineClipboardDocumentCheck } from 'react-icons/hi2'
import { DocDownloadMenu } from '../docs/components/DocDownloadMenu.jsx'
import { parseMarkdownTableFromText } from '../docs/utils/extractMarkdownSection.js'
import { formatPolariaChecklistMarkdown } from '../data/polariaChecklistDoc.js'

function StatusBadge({ status }) {
  const normalized = status.toLowerCase()
  const isComplete = normalized.includes('completo')
  const isPartial = normalized.includes('parcial')
  const isPending = normalized.includes('pendiente')

  return (
    <span
      className={[
        'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        isComplete
          ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
          : isPartial
            ? 'border-sky-400/30 bg-sky-500/15 text-sky-200'
            : isPending
              ? 'border-amber-400/30 bg-amber-500/15 text-amber-200'
              : 'border-slate-600/40 bg-slate-800/60 text-slate-300',
      ].join(' ')}
    >
      {status}
    </span>
  )
}

function PriorityDot({ priority }) {
  const p = priority.toLowerCase()
  const color =
    p === 'alta' ? 'bg-rose-400' : p === 'media' ? 'bg-amber-400' : p === 'baja' ? 'bg-sky-400' : 'bg-slate-500'
  return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${color}`} title={priority} />
}

function parseChecklistItems(markdown) {
  const { headers, rows } = parseMarkdownTableFromText(markdown)
  const numIdx = headers.findIndex((h) => /^#$/.test(h) || h === '#')
  const nameIdx = headers.findIndex((h) => /elemento/i.test(h))
  const prioIdx = headers.findIndex((h) => /prioridad/i.test(h))
  const statIdx = headers.findIndex((h) => /estado/i.test(h))

  return rows.map((row, i) => ({
    num: row[numIdx >= 0 ? numIdx : 0] || String(i + 1),
    name: row[nameIdx >= 0 ? nameIdx : 1] ?? '',
    priority: row[prioIdx >= 0 ? prioIdx : 2] ?? '',
    status: row[statIdx >= 0 ? statIdx : 3] ?? '',
  }))
}

export function ChecklistPortal({ project, onBackToMain, onBackToProjects }) {
  const [filter, setFilter] = useState('all')
  const handleBack = onBackToProjects ?? onBackToMain

  const sectionMarkdown = useMemo(() => formatPolariaChecklistMarkdown(), [])
  const items = useMemo(() => parseChecklistItems(sectionMarkdown), [sectionMarkdown])

  const stats = useMemo(() => {
    const complete = items.filter((i) => /completo/i.test(i.status)).length
    const partial = items.filter((i) => /parcial/i.test(i.status)).length
    const pending = items.filter((i) => /pendiente/i.test(i.status)).length
    return { complete, partial, pending, total: items.length }
  }, [items])

  const filtered = useMemo(() => {
    if (filter === 'complete') return items.filter((i) => /completo/i.test(i.status))
    if (filter === 'partial') return items.filter((i) => /parcial/i.test(i.status))
    if (filter === 'pending') return items.filter((i) => /pendiente/i.test(i.status))
    return items
  }, [items, filter])

  const progress = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_-10%,rgba(139,92,246,0.14),transparent),radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(52,211,153,0.08),transparent)]" />

      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            {onBackToProjects ? 'Cambiar proyecto' : 'Menú principal'}
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                {project?.name ? `${project.name} · Referencia` : 'Herramientas'}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Checklist del proyecto</h2>
              <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
                Estado vivo ago 2026: docs, Swagger, emp_*, Mateo, migraciones 001–066 y huecos reales
                (Prisma de precio, Playwright del producto, Fridem).
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
              <DocDownloadMenu
                title={`${project?.name ?? 'Polaria WMS'} — Checklist`}
                markdown={sectionMarkdown}
                sourcePath={null}
              />
              <div className="flex items-center gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/50 px-5 py-4">
                <div className="relative h-16 w-16">
                  <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-slate-800" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      className="stroke-emerald-400 transition-all duration-700"
                      strokeWidth="3"
                      strokeDasharray={`${progress} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-200">
                    {progress}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{stats.complete} completos</p>
                  <p className="text-xs text-sky-300">{stats.partial} parciales</p>
                  <p className="text-xs text-amber-300">{stats.pending} pendientes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { id: 'all', label: `Todos (${stats.total})` },
              { id: 'complete', label: `Completos (${stats.complete})` },
              { id: 'partial', label: `Parciales (${stats.partial})` },
              { id: 'pending', label: `Pendientes (${stats.pending})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={[
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === tab.id
                    ? 'bg-violet-500/20 text-violet-100 ring-1 ring-violet-400/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ul className="mt-8 space-y-2" role="list">
            {filtered.map((item) => (
              <li
                key={item.num}
                className="portal-card-hover flex items-center gap-4 rounded-xl border border-slate-700/55 bg-slate-900/40 px-4 py-3.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-xs font-bold text-slate-400">
                  {item.num}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-100">{item.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <PriorityDot priority={item.priority} />
                    <span className="text-xs text-slate-500">{item.priority}</span>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>

          <p className="mt-10 flex items-center gap-2 text-xs text-slate-500">
            <HiOutlineClipboardDocumentCheck className="h-4 w-4" aria-hidden />
            Fuente: polariaChecklistDoc.js — Polaria WMS ago 2026 (no el Word v1.0).
          </p>
        </div>
      </div>
    </div>
  )
}
