import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { HiOutlineShare } from 'react-icons/hi2'
import {
  buildErDiagramMermaid,
  buildErRelationships,
  ER_DOMAIN_OPTIONS,
  ER_DIAGRAM_FULL,
} from '../data/buildErDiagram.js'
import { ENTITIES } from '../data/bodegaDatabaseSchema.js'
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

export function DatabaseErDiagramPanel() {
  const [domainFilter, setDomainFilter] = useState('all')
  const [query, setQuery] = useState('')

  const chart = useMemo(() => {
    if (domainFilter === 'all') return ER_DIAGRAM_FULL
    return buildErDiagramMermaid({ domainId: domainFilter, includeAttributes: true })
  }, [domainFilter])

  const relationships = useMemo(
    () => buildErRelationships(domainFilter === 'all' ? null : domainFilter),
    [domainFilter],
  )

  const filteredRelations = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return relationships
    return relationships.filter(
      (r) =>
        r.from.includes(q) ||
        r.to.includes(q) ||
        r.field.toLowerCase().includes(q) ||
        r.label?.toLowerCase().includes(q),
    )
  }, [relationships, query])

  const tableCount = domainFilter === 'all' ? ENTITIES.length : new Set(filteredRelations.flatMap((r) => [r.from, r.to])).size

  const exportFileName = useMemo(() => {
    const slug =
      domainFilter === 'all'
        ? 'er-completo'
        : `er-${domainFilter}`.replace(/[^a-z0-9-]/gi, '-')
    return `diagrama-${slug}`
  }, [domainFilter])

  return (
    <div className="flex min-h-[32rem] flex-col rounded-2xl border border-slate-700/55 bg-slate-900/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/50 px-4 py-3">
        <HiOutlineShare className="h-5 w-5 shrink-0 text-emerald-400/80" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-100">Diagrama entidad-relación</p>
          <p className="text-xs text-slate-500">
            {ENTITIES.length} tablas · {relationships.length} relaciones FK
            {domainFilter !== 'all' ? ` · filtro activo` : ''}
          </p>
        </div>
        <CopyButton text={chart} />
      </div>

      <div className="border-b border-slate-700/50 px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {ER_DOMAIN_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDomainFilter(opt.id)}
              className={[
                'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                domainFilter === opt.id
                  ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                  : 'border-slate-600/50 text-slate-500 hover:text-slate-300',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Las flechas van de la tabla padre (PK) a la hija (FK): los datos «salen» del maestro y «llegan» al detalle.
        </p>
      </div>

      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 xl:grid-cols-[1fr_minmax(14rem,18rem)]">
        <div className="min-h-[20rem] min-w-0 overflow-hidden border-b border-slate-700/50 p-4 xl:border-b-0 xl:border-r">
          <MermaidDiagram
            chart={chart}
            zoomable
            exportable
            exportFileName={exportFileName}
            className="w-full"
            title={domainFilter === 'all' ? 'Modelo completo (todas las tablas)' : `Dominio: ${ER_DOMAIN_OPTIONS.find((o) => o.id === domainFilter)?.label}`}
          />
        </div>

        <div className="flex max-h-96 flex-col overflow-hidden xl:max-h-none">
          <div className="border-b border-slate-700/50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Uniones FK</p>
            <div className="relative mt-2">
              <FiSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar relaciones…"
                className="w-full rounded-lg border border-slate-700/60 bg-slate-950/60 py-1.5 pl-8 pr-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-auto p-2" role="list">
            {filteredRelations.length === 0 ? (
              <li className="px-2 py-4 text-center text-xs text-slate-500">Sin relaciones</li>
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
                  {rel.label ? <p className="mt-0.5 text-[10px] text-slate-500">{rel.label}</p> : null}
                </li>
              ))
            )}
          </ul>
          <p className="border-t border-slate-700/50 px-3 py-2 text-[10px] text-slate-600">
            ~{tableCount} tablas en vista
          </p>
        </div>
      </div>
    </div>
  )
}
