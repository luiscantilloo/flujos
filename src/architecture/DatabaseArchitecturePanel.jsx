import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { HiOutlineTableCells } from 'react-icons/hi2'
import {
  databaseSectionToText,
  databaseTableToText,
  getDatabaseTableById,
  getDatabaseTables,
} from '../data/projectArchitecture.js'
import { SCHEMA_DOMAINS } from '../data/bodegaDatabaseSchema.js'

const DOMAIN_ACCENT = {
  tenant: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
  catalog: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  purchase: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  sales: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  warehouse: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
  processing: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200',
  system: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
}

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

function CopyButton({ text, label, className = '' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (!text) return
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
      className={`rounded-lg border border-slate-600/50 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-sky-400/40 hover:text-sky-200 ${className}`}
    >
      {copied ? 'Copiado' : label}
    </button>
  )
}

export function DatabaseArchitecturePanel({ selectedTableId, onSelectTable, section }) {
  const [query, setQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')

  const tables = useMemo(() => getDatabaseTables(), [])

  const filteredTables = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tables.filter((t) => {
      if (domainFilter !== 'all' && t.domain !== domainFilter) return false
      if (!q) return true
      const hay = [t.table, t.name, t.schema, t.physical, t.desc, ...(t.fields?.map((f) => f.name) ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [tables, query, domainFilter])

  const activeTable = useMemo(
    () => getDatabaseTableById(selectedTableId) ?? filteredTables[0] ?? tables[0] ?? null,
    [selectedTableId, filteredTables, tables],
  )

  const copySectionText = databaseSectionToText()
  const copyTableText = activeTable ? databaseTableToText(activeTable) : ''

  return (
    <div className="flex min-h-[28rem] flex-col rounded-2xl border border-slate-700/55 bg-slate-900/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/50 px-4 py-3">
        <HiOutlineTableCells className="h-5 w-5 shrink-0 text-emerald-400/80" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-semibold text-slate-100">{section.rootLabel}</p>
          <p className="text-xs text-slate-500">{tables.length} tablas · vista relacional</p>
        </div>
        <CopyButton text={copySectionText} label="Copiar todas" />
      </div>

      <div className="border-b border-slate-700/50 px-4 py-3">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tabla o columna…"
            className="w-full rounded-xl border border-slate-700/60 bg-slate-950/60 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setDomainFilter('all')}
            className={[
              'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors',
              domainFilter === 'all'
                ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                : 'border-slate-600/50 text-slate-500 hover:text-slate-300',
            ].join(' ')}
          >
            Todas
          </button>
          {SCHEMA_DOMAINS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDomainFilter(d.id)}
              className={[
                'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                domainFilter === d.id
                  ? DOMAIN_ACCENT[d.id] ?? DOMAIN_ACCENT.system
                  : 'border-slate-600/50 text-slate-500 hover:text-slate-300',
              ].join(' ')}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(11rem,16rem)_1fr]">
        <div className="max-h-80 overflow-auto border-b border-slate-700/50 p-2 lg:max-h-none lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tablas</p>
          <ul className="space-y-0.5" role="listbox" aria-label="Lista de tablas">
            {filteredTables.length === 0 ? (
              <li className="px-2 py-4 text-center text-xs text-slate-500">Sin resultados</li>
            ) : (
              filteredTables.map((t) => {
                const active = activeTable?.id === t.id
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => onSelectTable(t.id)}
                      className={[
                        'w-full rounded-lg px-2.5 py-2 text-left transition-colors',
                        active ? 'bg-emerald-500/15 ring-1 ring-emerald-400/30' : 'hover:bg-slate-800/60',
                      ].join(' ')}
                    >
                      <span className="font-mono text-xs text-emerald-200/90">
                        {t.schema}.{t.table}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-slate-500">{t.name}</span>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>

        <div className="flex min-h-0 flex-col overflow-auto p-4">
          {activeTable ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${DOMAIN_ACCENT[activeTable.domain] ?? DOMAIN_ACCENT.system}`}
                  >
                    {activeTable.domainLabel}
                  </span>
                  <h3 className="mt-2 font-mono text-lg font-semibold text-slate-50">
                    {activeTable.schema}.{activeTable.table}
                  </h3>
                  <p className="text-sm text-slate-300">{activeTable.name}</p>
                  {activeTable.desc ? (
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{activeTable.desc}</p>
                  ) : null}
                  {activeTable.physical ? (
                    <p className="mt-1 font-mono text-[11px] text-cyan-200/75">{activeTable.physical}</p>
                  ) : null}
                </div>
                <CopyButton text={copyTableText} label="Copiar tabla" className="shrink-0" />
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700/55">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/60 bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2.5 font-medium">Campo</th>
                      <th className="px-3 py-2.5 font-medium">Tipo</th>
                      <th className="px-3 py-2.5 font-medium">Claves</th>
                      <th className="px-3 py-2.5 font-medium">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTable.fields.map((f) => (
                      <tr
                        key={f.name}
                        className="border-b border-slate-800/50 transition-colors last:border-0 hover:bg-slate-800/30"
                      >
                        <td className="px-3 py-2 font-mono text-xs text-violet-200">{f.name}</td>
                        <td className="px-3 py-2 text-slate-300">{f.type}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {f.pk ? <FieldBadge variant="pk">PK</FieldBadge> : null}
                            {f.fk ? <FieldBadge variant="fk">FK</FieldBadge> : null}
                            {f.unique ? <FieldBadge>UK</FieldBadge> : null}
                            {f.nullable ? <FieldBadge>NULL</FieldBadge> : null}
                            {!f.pk && !f.fk && !f.unique && !f.nullable ? (
                              <span className="text-slate-600">—</span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs text-slate-400">
                          {[f.fk, f.desc].filter(Boolean).join(' · ') || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeTable.indexes?.length > 0 ? (
                <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-950/40 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Índices</p>
                  <ul className="mt-2 space-y-1">
                    {activeTable.indexes.map((idx) => (
                      <li key={idx} className="font-mono text-xs text-cyan-200/90">
                        {idx}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-slate-500">Selecciona una tabla de la lista.</p>
          )}
        </div>
      </div>
    </div>
  )
}
