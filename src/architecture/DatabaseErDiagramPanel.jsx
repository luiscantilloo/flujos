import { useCallback, useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { HiOutlineShare } from 'react-icons/hi2'
import {
  buildErDiagramMermaid,
  buildErRelationships,
  ER_VIEWS,
  ER_DIAGRAM_DEFAULT_VIEW,
} from '../data/buildErDiagram.js'
import { ENTITIES, SCHEMA_META } from '../data/bodegaDatabaseSchema.js'
import { MermaidDiagram } from '../database/components/MermaidDiagram.jsx'

function CopyButton({ text, label = 'Copiar diagrama' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-slate-600/50 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-emerald-400/40 hover:text-emerald-200"
    >
      {copied ? 'Copiado' : label}
    </button>
  )
}

/** @typedef {'minimal'|'standard'|'full'} DetailLevel */
/** @typedef {'TB'|'LR'} LayoutDirection */

export function DatabaseErDiagramPanel() {
  const [viewId, setViewId] = useState(ER_DIAGRAM_DEFAULT_VIEW)
  const [query, setQuery] = useState('')
  /** @type {[DetailLevel, Function]} */
  const [detailLevel, setDetailLevel] = useState('standard')
  /** @type {[LayoutDirection, Function]} */
  const [direction, setDirection] = useState('TB')
  const [highlightTable, setHighlightTable] = useState('')

  const chart = useMemo(
    () => buildErDiagramMermaid({ viewId, detailLevel, direction }),
    [viewId, detailLevel, direction],
  )

  const relationships = useMemo(() => buildErRelationships(viewId), [viewId])

  const filteredRelations = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = !q
      ? relationships
      : relationships.filter(
          (r) =>
            r.from.includes(q) ||
            r.to.includes(q) ||
            r.field.toLowerCase().includes(q) ||
            r.legacy?.toLowerCase().includes(q) ||
            r.label?.toLowerCase().includes(q),
        )
    if (highlightTable.trim()) {
      const h = highlightTable.trim().toLowerCase()
      return list.filter((r) => r.from.toLowerCase().includes(h) || r.to.toLowerCase().includes(h))
    }
    return list
  }, [relationships, query, highlightTable])

  const tableCount = useMemo(() => {
    if (viewId === 'all') return ENTITIES.length
    return new Set(filteredRelations.flatMap((r) => [r.from, r.to])).size
  }, [viewId, filteredRelations])

  const exportFileName = useMemo(() => {
    const slug = `er-${viewId}-${detailLevel}-${direction}`.replace(/[^a-z0-9-]/gi, '-')
    return `diagrama-${slug}`
  }, [viewId, detailLevel, direction])

  const activeView = ER_VIEWS.find((v) => v.id === viewId)

  const entityTables = useMemo(
    () => [...new Set(relationships.flatMap((r) => [r.from, r.to]))].sort(),
    [relationships],
  )

  const renderFullscreenSidebar = useCallback(
    () => (
      <div className="flex flex-col gap-4 p-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Vista del modelo</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {ER_VIEWS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setViewId(opt.id)}
                className={[
                  'rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors',
                  viewId === opt.id
                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-slate-600/50 text-slate-500 hover:text-slate-300',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Resaltar tabla</p>
          <select
            value={highlightTable}
            onChange={(e) => setHighlightTable(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-700/60 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-200 focus:border-emerald-500/40 focus:outline-none"
          >
            <option value="">— Todas —</option>
            {entityTables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Relaciones</p>
          <div className="relative mt-1.5">
            <FiSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tabla o campo…"
              className="w-full rounded-lg border border-slate-700/60 bg-slate-950/80 py-1.5 pl-8 pr-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none"
            />
          </div>
          <ul className="mt-2 max-h-[40vh] space-y-1 overflow-y-auto">
            {filteredRelations.length === 0 ? (
              <li className="text-xs text-slate-500">Sin relaciones</li>
            ) : (
              filteredRelations.map((rel) => (
                <li
                  key={rel.id}
                  className="rounded-lg border border-slate-700/50 bg-slate-950/60 px-2 py-1.5"
                >
                  <p className="font-mono text-[10px] text-slate-200">
                    <span className="text-emerald-300/90">{rel.from}</span>
                    <span className="mx-1 text-slate-600">→</span>
                    <span className="text-violet-300/90">{rel.to}</span>
                  </p>
                  {rel.label ? <p className="mt-0.5 text-[10px] text-slate-500">{rel.label}</p> : null}
                </li>
              ))
            )}
          </ul>
          <p className="mt-2 text-[10px] text-slate-600">
            {tableCount} tablas · {filteredRelations.length} relaciones
          </p>
        </div>
      </div>
    ),
    [viewId, query, highlightTable, filteredRelations, tableCount, entityTables],
  )

  return (
    <div className="flex min-h-[32rem] flex-col rounded-2xl border border-slate-700/55 bg-slate-900/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/50 px-4 py-3">
        <HiOutlineShare className="h-5 w-5 shrink-0 text-emerald-400/80" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-100">Diagrama entidad-relación</p>
          <p className="text-xs text-slate-500">
            {ENTITIES.length} entidades · {SCHEMA_META.version} · pantalla completa con estudio ER
          </p>
        </div>
        <CopyButton text={chart} />
      </div>

      <div className="border-b border-slate-700/50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {ER_VIEWS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setViewId(opt.id)}
                className={[
                  'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                  viewId === opt.id
                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-slate-600/50 text-slate-500 hover:text-slate-300',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <select
            value={detailLevel}
            onChange={(e) => setDetailLevel(/** @type {DetailLevel} */ (e.target.value))}
            className="rounded-full border border-slate-600/50 bg-slate-950/60 px-2.5 py-0.5 text-[11px] text-slate-300 focus:border-emerald-500/40 focus:outline-none"
            title="Detalle de campos en el diagrama"
          >
            <option value="minimal">Solo PK/FK</option>
            <option value="standard">Estándar</option>
            <option value="full">Completo</option>
          </select>
          <div className="flex rounded-full border border-slate-600/50 bg-slate-950/60 p-0.5">
            <button
              type="button"
              title="Vertical"
              onClick={() => setDirection('TB')}
              className={[
                'rounded-full px-2 py-0.5 text-[10px] font-medium',
                direction === 'TB' ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-500',
              ].join(' ')}
            >
              TB
            </button>
            <button
              type="button"
              title="Horizontal"
              onClick={() => setDirection('LR')}
              className={[
                'rounded-full px-2 py-0.5 text-[10px] font-medium',
                direction === 'LR' ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-500',
              ].join(' ')}
            >
              LR
            </button>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          Usa Pantalla completa (botón verde) para zoom, panel lateral,
          cambiar vista, orientación y exportar sin salir del lienzo.
        </p>
      </div>

      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 xl:grid-cols-[1fr_minmax(14rem,18rem)]">
        <div className="min-h-[28rem] min-w-0 overflow-hidden border-b border-slate-700/50 p-4 xl:min-h-[32rem] xl:border-b-0 xl:border-r">
          <MermaidDiagram
            chart={chart}
            zoomable
            exportable
            enhancedFullscreen
            exportFileName={exportFileName}
            className="w-full"
            title={activeView?.label ?? 'Modelo ER'}
            fullscreenTitle={`ER · ${activeView?.label ?? 'Modelo'}`}
            fullscreenDirection={direction}
            onFullscreenDirectionChange={setDirection}
            fullscreenDetailLevel={detailLevel}
            onFullscreenDetailLevelChange={setDetailLevel}
            renderFullscreenSidebar={renderFullscreenSidebar}
          />
        </div>

        <div className="flex min-h-[14rem] flex-col overflow-hidden sm:min-h-[18rem] xl:min-h-0 xl:flex-1">
          <div className="border-b border-slate-700/50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Relaciones</p>
            <div className="relative mt-2">
              <FiSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tabla o campo…"
                className="w-full rounded-lg border border-slate-700/60 bg-slate-950/60 py-1.5 pl-8 pr-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none"
              />
            </div>
          </div>
          <ul className="app-scroll-panel flex-1 p-2" role="list">
            {filteredRelations.length === 0 ? (
              <li className="px-2 py-4 text-center text-xs text-slate-500">Sin relaciones en esta capa</li>
            ) : (
              filteredRelations.map((rel) => (
                <li
                  key={rel.id}
                  className="mb-1.5 rounded-lg border border-slate-700/50 bg-slate-950/50 px-2.5 py-2"
                >
                  <p className="font-mono text-[11px] leading-snug text-slate-200">
                    <span className="text-emerald-300/90">{rel.from}</span>
                    <span className="mx-1 text-slate-600">→</span>
                    <span className="text-violet-300/90">{rel.to}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-cyan-200/80">{rel.field}</p>
                  {rel.v20Field || rel.legacy ? (
                    <p className="mt-0.5 font-mono text-[10px] text-amber-200/70">
                      V2.0: {[rel.v20Field, rel.legacy].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  {rel.label ? <p className="mt-0.5 text-[10px] text-slate-500">{rel.label}</p> : null}
                </li>
              ))
            )}
          </ul>
          <p className="border-t border-slate-700/50 px-3 py-2 text-[10px] text-slate-600">
            ~{tableCount} tablas en vista · {filteredRelations.length} relaciones
          </p>
        </div>
      </div>
    </div>
  )
}
