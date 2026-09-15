import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { HiArrowRight, HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import { DocMarkdownView } from '../docs/DocMarkdownView.jsx'
import { DocDownloadMenu } from '../docs/components/DocDownloadMenu.jsx'
import {
  FORMULARIO_ROLES,
  formularioItems,
  formularioSchemaPath,
  getFormularioItemById,
  getFormularioItemsByRole,
} from '../data/formularioRegistry.js'

function FormCard({ item, onOpen }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        className="group relative w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/45 p-4 text-left transition-all hover:border-teal-400/30 hover:bg-slate-900/60"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-teal-300/80">
              {item.modal ? 'Modal' : 'Pantalla'}
            </span>
            <h3 className="mt-1 text-base font-semibold text-slate-50">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.summary}</p>
          </div>
          <HiArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-500 group-hover:text-teal-300" aria-hidden />
        </div>
      </button>
    </li>
  )
}

function SchemaReader({ item, onBack }) {
  const [markdown, setMarkdown] = useState('')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const contentRef = useRef(null)
  const filePath = formularioSchemaPath(item)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(filePath)
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
  }, [filePath])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="app-scroll-page min-h-0 flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            ← Esquema por rol
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/90">Formularios · Esquema</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-50">{item.title}</h2>
          <p className="mt-2 text-sm text-slate-400">{item.summary}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">{item.schemaFile}</p>

          <div className="mt-4">
            <DocDownloadMenu
              title={`Schema — ${item.title}`}
              markdown={markdown}
              sourcePath={filePath}
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

export function FormulariosPortal({ sectionId = null, formId = null, onNavigate }) {
  const [query, setQuery] = useState('')
  const go = useCallback(
    (nextSection, nextForm) => {
      onNavigate?.(nextSection, nextForm)
    },
    [onNavigate],
  )

  const activeForm = formId && sectionId === 'esquema' ? getFormularioItemById(formId) : null

  const filteredByRole = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FORMULARIO_ROLES.map((role) => {
      let items = getFormularioItemsByRole(role.id)
      if (q) {
        items = items.filter((item) => {
          const haystack = [item.title, item.summary, item.schemaFile].join(' ').toLowerCase()
          return haystack.includes(q)
        })
      }
      return { role, items }
    }).filter((block) => {
      if (q) return block.items.length > 0
      return true
    })
  }, [query])

  if (formId && sectionId === 'esquema' && !activeForm) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page bg-slate-950">
        <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
          <button
            type="button"
            onClick={() => go('esquema', null)}
            className="mb-8 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            ← Esquema por rol
          </button>
          <h2 className="text-2xl font-bold text-slate-50">Schema no encontrado</h2>
          <p className="mt-2 text-sm text-slate-400">
            No hay un formulario con id {formId} en el índice.
          </p>
        </div>
      </div>
    )
  }

  if (activeForm) {
    return <SchemaReader item={activeForm} onBack={() => go('esquema', null)} />
  }

  if (sectionId === 'esquema') {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,rgba(45,212,191,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
          <button
            type="button"
            onClick={() => go(null, null)}
            className="mb-8 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            ← Formularios
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/90">Formularios</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-50 sm:text-4xl">Esquema</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Schema de campos por formulario (plantilla de validación v1.0). Agrupados por rol.
            Un mismo schema puede aparecer en más de un rol si lo comparten. El operario no tiene
            formulario de captura.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {formularioItems.length} schemas · `public/docs/formularios/schemas/`
          </p>

          <label className="relative mt-8 block">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: pedido, impresora, merma, login…"
              className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/55 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-500/20"
            />
          </label>

          <div className="mt-10 space-y-10">
            {filteredByRole.map(({ role, items }) => (
              <section key={role.id}>
                <h3 className="text-sm font-semibold text-slate-200">{role.label}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{role.description}</p>
                {items.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">Sin formularios de captura en este rol.</p>
                ) : (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2" role="list">
                    {items.map((item) => (
                      <FormCard key={item.id} item={item} onOpen={(id) => go('esquema', id)} />
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,rgba(45,212,191,0.12),transparent)]" />
      <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
        <Link to={paths.home} className="mb-8 inline-block text-sm font-medium text-sky-400 hover:text-sky-300">
          ← Menú principal
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/10">
            <HiOutlineClipboardDocumentList className="h-6 w-6 text-teal-200" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/90">Polaria WMS</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-50 sm:text-4xl">Formularios</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Inventario de formularios de negocio y su schema de campos (niveles 1–5 del protocolo
              de validación).
            </p>
          </div>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2" role="list">
          <li>
            <button
              type="button"
              onClick={() => go('esquema', null)}
              className="group relative w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/45 p-6 text-left transition-all hover:border-teal-400/30"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/15 to-transparent opacity-80" />
              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-300/80">Paso 1</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-50">Esquema</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Schemas por rol: campos, validación, tabulación y pre-llenado (IA / BD).
                </p>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
