import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { HiArrowLeft, HiOutlineBookOpen } from 'react-icons/hi2'
import { DocDownloadMenu } from '../docs/components/DocDownloadMenu.jsx'
import { parseMarkdownTableFromText } from '../docs/utils/extractMarkdownSection.js'
import { formatPolariaGlossaryMarkdown } from '../data/polariaGlossaryDoc.js'

function GlossaryTermCard({ term, definition, system }) {
  return (
    <article className="portal-card-hover group rounded-2xl border border-slate-700/60 bg-slate-900/45 p-5 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-500/10 text-sm font-bold text-amber-200">
          {term.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-slate-50">{term}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{definition}</p>
          {system ? (
            <p className="mt-3 rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-2 font-mono text-xs leading-relaxed text-emerald-200/90">
              {system}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function GlossaryPortal({ project, onBackToMain, onBackToProjects }) {
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('')
  const handleBack = onBackToProjects ?? onBackToMain

  const sectionMarkdown = useMemo(() => formatPolariaGlossaryMarkdown(), [])
  const terms = useMemo(() => {
    const { headers, rows } = parseMarkdownTableFromText(sectionMarkdown)
    const termIdx = headers.findIndex((h) => /término/i.test(h))
    const defIdx = headers.findIndex((h) => /definición/i.test(h))
    const sysIdx = headers.findIndex((h) => /sistema|representación/i.test(h))
    return rows.map((row) => ({
      term: row[termIdx] ?? row[0] ?? '',
      definition: row[defIdx] ?? row[1] ?? '',
      system: row[sysIdx] ?? row[2] ?? '',
    }))
  }, [sectionMarkdown])

  const letters = useMemo(() => {
    const set = new Set(terms.map((t) => t.term.charAt(0).toUpperCase()).filter(Boolean))
    return [...set].sort()
  }, [terms])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return terms.filter((t) => {
      const matchLetter = !letter || t.term.charAt(0).toUpperCase() === letter
      const matchQuery =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.system.toLowerCase().includes(q)
      return matchLetter && matchQuery
    })
  }, [terms, query, letter])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_20%_-10%,rgba(251,191,36,0.12),transparent),radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(167,139,250,0.1),transparent)]" />

      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90">
                {project?.name ? `${project.name} · Referencia` : 'Referencia'}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Glosario de dominio</h2>
              <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
                Puente entre negocio y código. Busca por término, definición o representación en el sistema.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
                <DocDownloadMenu
                  title={`${project?.name ?? 'Polaria WMS'} — Glosario`}
                  markdown={sectionMarkdown}
                  sourcePath={null}
                />
                <div className="flex gap-3">
                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-amber-200">{terms.length}</p>
                    <p className="text-xs text-slate-500">términos</p>
                  </div>
                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-violet-200">{filtered.length}</p>
                    <p className="text-xs text-slate-500">visibles</p>
                  </div>
                </div>
              </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar término, definición o ruta en código…"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-shadow focus:border-amber-400/40 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            {letters.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setLetter('')}
                  className={[
                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                    !letter
                      ? 'bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200',
                  ].join(' ')}
                >
                  Todos
                </button>
                {letters.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLetter(letter === l ? '' : l)}
                    className={[
                      'h-8 w-8 rounded-lg text-xs font-semibold transition-colors',
                      letter === l
                        ? 'bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200',
                    ].join(' ')}
                  >
                    {l}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-500">No hay términos que coincidan con tu búsqueda.</p>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {filtered.map((item) => (
                <GlossaryTermCard key={item.term} {...item} />
              ))}
            </div>
          )}

          <p className="mt-10 flex items-center gap-2 text-xs text-slate-500">
            <HiOutlineBookOpen className="h-4 w-4" aria-hidden />
            Fuente: polariaGlossaryDoc.js — Polaria WMS ago 2026 (Supabase + Nest).
          </p>
        </div>
      </div>
    </div>
  )
}
