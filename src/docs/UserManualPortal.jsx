import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { HiArrowRight, HiOutlineUserGroup } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import { DocMarkdownView } from '../docs/DocMarkdownView.jsx'
import { DocDownloadMenu } from '../docs/components/DocDownloadMenu.jsx'
import {
  USER_MANUAL_CATEGORIES,
  getUserManualItemById,
  userManualItems,
} from '../data/userManualRegistry.js'

function ManualCard({ item, onOpen }) {
  const category = USER_MANUAL_CATEGORIES.find((c) => c.id === item.category)
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="group relative w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/45 p-4 text-left transition-all hover:border-amber-400/30 hover:bg-slate-900/60"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300/80">
              {category?.label ?? item.category}
            </span>
            <h3 className="mt-1 text-base font-semibold text-slate-50">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.summary}</p>
          </div>
          <HiArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-500 group-hover:text-amber-300" aria-hidden />
        </div>
      </button>
    </li>
  )
}

function ManualReader({ item, onBack }) {
  const [markdown, setMarkdown] = useState('')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(item.filePath)
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar (${res.status})`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) {
          setMarkdown(text)
          setStatus('idle')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error')
          setStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [item.filePath])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="app-scroll-page min-h-0 flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            ← Índice manual de usuario
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90">Manual de usuario</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-50">{item.title}</h2>
          <p className="mt-2 text-sm text-slate-400">{item.summary}</p>

          <div className="mt-4">
            <DocDownloadMenu
              title={`Manual — ${item.title}`}
              markdown={markdown}
              sourcePath={item.filePath}
              contentRef={contentRef}
              disabled={status !== 'idle'}
            />
          </div>

          {status === 'loading' ? (
            <div className="mt-8 h-48 animate-pulse rounded-2xl bg-slate-800/50" />
          ) : null}
          {status === 'error' ? (
            <p className="mt-8 text-sm text-red-300">{error}</p>
          ) : null}
          {status === 'idle' ? (
            <div
              ref={contentRef}
              className="mt-8 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/35 p-4 sm:p-8"
            >
              <DocMarkdownView markdown={markdown} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function UserManualPortal({ manualId = null, onNavigateManual }) {
  const [query, setQuery] = useState('')
  const active = manualId ? getUserManualItemById(manualId) : null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return userManualItems
    return userManualItems.filter((item) => {
      const haystack = [item.title, item.summary, ...(item.keywords ?? [])].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  if (active) {
    return (
      <ManualReader
        key={active.id}
        item={active}
        onBack={() => onNavigateManual?.(null)}
      />
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,rgba(251,191,36,0.12),transparent)]" />
      <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
        <Link
          to={paths.home}
          className="mb-8 inline-block text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          ← Menú principal
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
            <HiOutlineUserGroup className="h-6 w-6 text-amber-200" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90">Mateo Support</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-50 sm:text-4xl">Manual de usuario</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Guías por rol, procesos de negocio y respuestas frecuentes para soporte. Organizado en{' '}
              <code className="rounded bg-slate-800 px-1 text-xs text-amber-200">public/docs/manual-usuario/</code>.
            </p>
          </div>
        </div>

        <label className="relative mt-8 block">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar rol, proceso, SOL, recepción, Mateo…"
            className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/55 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-500/20"
          />
        </label>

        <div className="mt-10 space-y-10">
          {USER_MANUAL_CATEGORIES.map((cat) => {
            const items = filtered.filter((i) => i.category === cat.id)
            if (items.length === 0) return null
            return (
              <section key={cat.id}>
                <h3 className="text-sm font-semibold text-slate-200">{cat.label}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{cat.description}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2" role="list">
                  {items.map((item) => (
                    <ManualCard key={item.id} item={item} onOpen={(id) => onNavigateManual?.(id)} />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-sm text-slate-500">Sin resultados para «{query}».</p>
        ) : null}
      </div>
    </div>
  )
}
