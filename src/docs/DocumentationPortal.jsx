import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { paths } from '../router/paths.js'
import { HiArrowRight, HiOutlineArchiveBox, HiOutlineBookOpen } from 'react-icons/hi2'
import { FiSearch } from 'react-icons/fi'
import { DocMarkdownView } from './DocMarkdownView.jsx'
import { DocDownloadMenu } from './components/DocDownloadMenu.jsx'
import { documentationItems, getDocumentationItemById } from './docRegistry.js'
import { bodegaPlainToMarkdown } from './utils/bodegaPlainToMarkdown.js'
import { filterMarkdownByQuery } from './utils/filterMarkdownByQuery.js'

function useScrollProgress(scrollRef, setProgress) {
  const ticking = useRef(false)
  return useCallback(() => {
    const el = scrollRef.current
    if (!el || ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      ticking.current = false
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0)
    })
  }, [scrollRef, setProgress])
}

function TocPanel({ toc, activeId, onPick, onClose }) {
  return (
    <nav className="space-y-1" aria-label="Tabla de contenidos">
      {toc.length === 0 ? (
        <p className="text-xs text-slate-500">Generando índice…</p>
      ) : (
        toc.map((item) => {
          const active = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPick(item.id)
                onClose?.()
              }}
              className={[
                'w-full rounded-lg px-2 py-1.5 text-left text-xs transition-colors',
                item.level === 3 ? 'pl-4 text-slate-400' : 'text-slate-200',
                active
                  ? 'bg-violet-600/25 text-violet-100 ring-1 ring-violet-400/35'
                  : 'hover:bg-slate-800/80 hover:text-slate-50',
              ].join(' ')}
            >
              {item.label}
            </button>
          )
        })
      )}
    </nav>
  )
}

function DocReaderExperience({ doc, onBackToIndex, initialHeadingId, onInitialHeadingConsumed }) {
  const [rawBody, setRawBody] = useState('')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [tocOpen, setTocOpen] = useState(false)
  const [activeHeadingId, setActiveHeadingId] = useState('')
  const [progress, setProgress] = useState(0)
  const [toc, setToc] = useState([])

  const scrollRef = useRef(null)
  const docViewRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetch(doc.filePath)
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar (${res.status})`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) {
          setRawBody(text)
          setStatus('idle')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido')
          setStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [doc.filePath])

  const markdown = useMemo(() => {
    if (!rawBody) return ''
    if (doc.format === 'plain') return bodegaPlainToMarkdown(rawBody)
    return rawBody
  }, [rawBody, doc.format])

  const visibleMarkdown = useMemo(() => filterMarkdownByQuery(markdown, search), [markdown, search])

  useLayoutEffect(() => {
    if (status !== 'idle') return
    requestAnimationFrame(() => {
      const root = docViewRef.current
      if (!root) return
      const hs = [...root.querySelectorAll('.doc-content h2, .doc-content h3')]
      setToc(
        hs.map((h) => ({
          id: h.id,
          label: (h.textContent ?? '').trim(),
          level: h.tagName === 'H2' ? 2 : 3,
        })),
      )
    })
  }, [visibleMarkdown, status])

  useEffect(() => {
    const root = scrollRef.current
    if (!root || toc.length === 0) return

    const elements = toc
      .map((t) => (t.id ? document.getElementById(t.id) : null))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.target.id)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const first = visible[0]?.target
        if (first?.id) setActiveHeadingId(first.id)
      },
      { root, rootMargin: '-45% 0px -40% 0px', threshold: [0, 0.02, 0.12, 0.25, 0.5, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])

  const updateProgress = useScrollProgress(scrollRef, setProgress)

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id)
    const sc = scrollRef.current
    if (!el || !sc) return
    const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 16
    sc.scrollTo({ top, behavior: 'smooth' })
    setActiveHeadingId(id)
  }, [])

  useEffect(() => {
    if (!initialHeadingId || status !== 'idle' || toc.length === 0) return
    const timer = setTimeout(() => {
      scrollToId(initialHeadingId)
      onInitialHeadingConsumed?.()
    }, 150)
    return () => clearTimeout(timer)
  }, [initialHeadingId, status, toc, scrollToId, onInitialHeadingConsumed])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-0.5 bg-slate-900/40">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="relative z-30 shrink-0 border-b border-slate-800/90 bg-slate-950/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.14),_transparent_55%)]" />
        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <button
              type="button"
              onClick={onBackToIndex}
              className="text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
            >
              ← Índice de documentación
            </button>
            <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              {doc.title}
            </h2>
            {doc.sourceNote ? <p className="mt-1 max-w-3xl text-xs text-slate-500">{doc.sourceNote}</p> : null}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:max-w-[36rem]">
            <label className="relative min-w-0 flex-1 sm:min-w-[14rem]">
              <span className="sr-only">Buscar en el documento</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar en secciones…"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/70 py-2.5 pl-10 pr-3 text-sm text-slate-100 shadow-inner outline-none ring-violet-500/30 placeholder:text-slate-500 focus:border-violet-500/50 focus:ring-2"
                type="search"
                autoComplete="off"
              />
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            </label>
            <DocDownloadMenu
              title={doc.title}
              markdown={markdown}
              sourcePath={doc.filePath}
              contentRef={docViewRef}
              disabled={status !== 'idle'}
            />
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-2.5 text-sm font-medium text-slate-200 shadow-sm transition-colors hover:border-violet-500/40 hover:bg-slate-900 lg:hidden"
              onClick={() => setTocOpen(true)}
            >
              Índice
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        <aside className="app-scroll-panel hidden w-[min(100%,17.5rem)] shrink-0 border-r border-slate-800/80 bg-slate-950/40 px-3 py-6 lg:block">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">En esta página</p>
          <TocPanel toc={toc} activeId={activeHeadingId} onPick={scrollToId} />
        </aside>

        {tocOpen ? (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              aria-label="Cerrar índice"
              onClick={() => setTocOpen(false)}
            />
            <div className="relative ml-auto flex h-full w-[min(100%,20rem)] flex-col border-l border-slate-800/90 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
                <span className="text-sm font-semibold text-slate-100">Índice</span>
                <button
                  type="button"
                  onClick={() => setTocOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                >
                  Cerrar
                </button>
              </div>
              <div className="app-scroll-panel min-h-0 flex-1 px-3 py-4">
                <TocPanel toc={toc} activeId={activeHeadingId} onPick={scrollToId} onClose={() => setTocOpen(false)} />
              </div>
            </div>
          </div>
        ) : null}

        <div
          ref={scrollRef}
          onScroll={updateProgress}
          className="app-scroll-page min-h-0 flex-1 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.06),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(167,139,250,0.07),_transparent_55%)]"
        >
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
            {status === 'loading' ? (
              <div className="flex flex-col gap-3">
                <div className="h-10 w-2/3 animate-pulse rounded-lg bg-slate-800/80" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-800/60" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800/50" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-800/40" />
              </div>
            ) : null}
            {status === 'error' ? <p className="text-sm text-red-300">{error}</p> : null}
            {status === 'idle' ? (
              <div
                ref={docViewRef}
                className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/35 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ring-1 ring-white/5 backdrop-blur-sm sm:p-8"
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative">
                  <DocMarkdownView markdown={visibleMarkdown} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

const BODEGA_DOC_IDS = new Set(['bodega-frio-v2', 'bodega-frio-documentacion-v20'])

function DocIndexCard({ doc, onOpen }) {
  const isBodega = BODEGA_DOC_IDS.has(doc.id)
  const accent = isBodega
    ? doc.id === 'bodega-frio-documentacion-v20'
      ? 'from-cyan-500/25 via-sky-500/10 to-violet-500/20'
      : 'from-sky-500/25 via-violet-500/10 to-fuchsia-500/20'
    : 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20'

  const Icon = isBodega ? HiOutlineArchiveBox : HiOutlineBookOpen

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(doc.id)}
        className="group relative w-full overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/45 p-5 text-left shadow-lg shadow-slate-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/35 hover:shadow-violet-950/25"
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
        />
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
        <div className="relative flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/50 text-slate-100 shadow-inner ring-1 ring-white/5">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-300">
                {doc.format === 'plain' ? 'Doc importado' : 'Guía Markdown'}
              </span>
              <HiArrowRight
                className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-violet-300"
                aria-hidden
              />
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-50">{doc.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{doc.summary}</p>
            <p className="mt-4 text-xs font-medium text-violet-300/90">Abrir lector interactivo</p>
          </div>
        </div>
      </button>
    </li>
  )
}

export function DocumentationPortal({
  docId = null,
  headingId = null,
  onNavigateDoc,
}) {
  const activeDoc = docId ? getDocumentationItemById(docId) : null

  const onBackToIndex = useCallback(() => {
    onNavigateDoc?.(null)
  }, [onNavigateDoc])

  const openDoc = useCallback(
    (id) => {
      onNavigateDoc?.(id)
    },
    [onNavigateDoc],
  )

  if (activeDoc) {
    return (
      <DocReaderExperience
        key={`${activeDoc.id}-${headingId ?? ''}`}
        doc={activeDoc}
        onBackToIndex={onBackToIndex}
        initialHeadingId={headingId}
        onInitialHeadingConsumed={() => {}}
      />
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.18),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(34,211,238,0.08),transparent)]" />
      <div className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <Link
          to={paths.home}
          className="mb-8 inline-block rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
        >
          ← Menú principal
        </Link>

        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">Centro de documentación</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            Explora, busca y navega con estilo
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-slate-400">
            Lector con tabla de contenidos, barra de progreso de lectura, filtro por texto y tablas resaltadas. Los
            archivos viven en{' '}
            <code className="rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[13px] text-emerald-200/90">public/docs/</code>{' '}
            y el índice en{' '}
            <code className="rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[13px] text-emerald-200/90">
              src/docs/docRegistry.js
            </code>
            .
          </p>
        </div>

        <ul className="mt-12 flex flex-col gap-5" role="list">
          {documentationItems.map((doc) => (
            <DocIndexCard key={doc.id} doc={doc} onOpen={openDoc} />
          ))}
        </ul>
      </div>
    </div>
  )
}
