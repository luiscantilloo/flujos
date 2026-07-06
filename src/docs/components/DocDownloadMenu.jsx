import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { HiArrowDownTray, HiChevronDown } from 'react-icons/hi2'
import { DOC_DOWNLOAD_FORMATS, runDocDownload } from '../utils/docDownload.js'

export function DocDownloadMenu({
  title,
  markdown,
  sourcePath,
  contentRef,
  disabled = false,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const rootRef = useRef(null)
  const menuId = useId()

  const canDownload = Boolean(markdown?.trim()) && !disabled

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const onPick = useCallback(
    async (formatId) => {
      if (!canDownload || busy) return
      setBusy(true)
      setOpen(false)
      setError(null)
      try {
        const contentElement = contentRef?.current ?? null
        await runDocDownload(formatId, { title, markdown, sourcePath, contentElement })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudo generar el archivo.'
        setError(message)
      } finally {
        setBusy(false)
      }
    },
    [busy, canDownload, contentRef, markdown, sourcePath, title],
  )

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={!canDownload || busy}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-2.5 text-sm font-medium text-slate-200 shadow-sm transition-colors hover:border-violet-500/40 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <HiArrowDownTray className="h-4 w-4" aria-hidden />
        {busy ? 'Generando…' : 'Descargar'}
        <HiChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Formatos de descarga"
          className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,17rem)] overflow-hidden rounded-xl border border-slate-700/90 bg-slate-950 shadow-2xl ring-1 ring-white/5"
        >
          <p className="border-b border-slate-800/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Elegir formato
          </p>
          <ul className="py-1">
            {DOC_DOWNLOAD_FORMATS.map((fmt) => (
              <li key={fmt.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => onPick(fmt.id)}
                  className={[
                    'flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-slate-900/90',
                    fmt.primary ? 'bg-violet-950/25' : '',
                  ].join(' ')}
                >
                  <span className={['text-sm font-medium', fmt.primary ? 'text-violet-100' : 'text-slate-100'].join(' ')}>
                    {fmt.label}
                    <span className="ml-1.5 font-mono text-[11px] font-normal text-violet-300/90">{fmt.extension}</span>
                    {fmt.primary ? (
                      <span className="ml-2 rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-200">
                        recomendado
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[11px] leading-snug text-slate-500">{fmt.hint}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="absolute right-0 top-full z-40 mt-2 max-w-xs rounded-lg border border-red-500/35 bg-red-950/90 px-3 py-2 text-xs text-red-200 shadow-lg">
          {error}
        </p>
      ) : null}
    </div>
  )
}
