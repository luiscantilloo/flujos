import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  HiMagnifyingGlassMinus,
  HiMagnifyingGlassPlus,
  HiOutlineArrowsPointingOut,
} from 'react-icons/hi2'
import mermaid from 'mermaid'

let mermaidReady = false

function ensureMermaid() {
  if (mermaidReady) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    er: { useMaxWidth: false, diagramPadding: 24 },
    class: { useMaxWidth: true },
  })
  mermaidReady = true
}

const MIN_SCALE = 0.05
const MAX_SCALE = 4
const ZOOM_STEP = 0.15

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function getSvgDimensions(svg) {
  const vb = svg.viewBox?.baseVal
  if (vb && vb.width > 0 && vb.height > 0) {
    return { width: vb.width, height: vb.height }
  }

  const attrW = Number.parseFloat(svg.getAttribute('width') ?? '')
  const attrH = Number.parseFloat(svg.getAttribute('height') ?? '')
  if (attrW > 0 && attrH > 0) {
    return { width: attrW, height: attrH }
  }

  const rect = svg.getBoundingClientRect()
  return { width: rect.width, height: rect.height }
}

function prepareSvgForZoom(svg) {
  const { width, height } = getSvgDimensions(svg)
  if (width > 0 && height > 0) {
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
  }
  svg.style.maxWidth = 'none'
  svg.style.display = 'block'
  svg.style.pointerEvents = 'none'
}

function ZoomToolbar({ scale, onZoomIn, onZoomOut, onFit, onFullscreen, isFullscreen }) {
  const pct = Math.round(scale * 100)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-800/80 p-0.5">
        <button
          type="button"
          onClick={onZoomOut}
          className="rounded-md p-1.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          aria-label="Alejar"
        >
          <HiMagnifyingGlassMinus className="h-4 w-4" />
        </button>
        <span className="min-w-[3rem] px-1 text-center font-mono text-xs text-slate-400">{pct}%</span>
        <button
          type="button"
          onClick={onZoomIn}
          className="rounded-md p-1.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          aria-label="Acercar"
        >
          <HiMagnifyingGlassPlus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={onFit}
        className="rounded-lg border border-slate-600/50 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:border-emerald-400/40 hover:text-emerald-200"
      >
        Ajustar
      </button>
      <button
        type="button"
        onClick={onFullscreen}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:border-emerald-400/40 hover:text-emerald-200"
      >
        <HiOutlineArrowsPointingOut className="h-3.5 w-3.5" aria-hidden />
        {isFullscreen ? 'Salir' : 'Pantalla completa'}
      </button>
    </div>
  )
}

export function MermaidDiagram({ chart, title, className = '', zoomable = false }) {
  const containerRef = useRef(null)
  const viewportRef = useRef(null)
  const renderSeqRef = useRef(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ active: false, startX: 0, startY: 0, panX: 0, panY: 0 })
  const reactId = useId().replace(/:/g, '')
  const diagramId = `mmd-${reactId}`

  const fitToView = useCallback(() => {
    const viewport = viewportRef.current
    const svg = containerRef.current?.querySelector('svg')
    if (!viewport || !svg) return false

    const vp = viewport.getBoundingClientRect()
    if (vp.width < 8 || vp.height < 8) return false

    const { width: sw, height: sh } = getSvgDimensions(svg)
    if (!sw || !sh) return false

    const padding = 24
    const fitScale = Math.min((vp.width - padding) / sw, (vp.height - padding) / sh)
    const nextScale = clamp(fitScale, MIN_SCALE, MAX_SCALE)
    setScale(nextScale)
    setPan({
      x: (vp.width - sw * nextScale) / 2,
      y: (vp.height - sh * nextScale) / 2,
    })
    setReady(true)
    return true
  }, [])

  const scheduleFitToView = useCallback(() => {
    requestAnimationFrame(() => {
      if (fitToView()) return
      requestAnimationFrame(() => fitToView())
    })
  }, [fitToView])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !chart?.trim()) return

    let cancelled = false
    setError(null)
    setLoading(true)
    setReady(false)
    if (zoomable) {
      setScale(1)
      setPan({ x: 0, y: 0 })
    }

    const renderId = `${diagramId}-${++renderSeqRef.current}`

    ;(async () => {
      try {
        ensureMermaid()
        const { svg } = await mermaid.render(renderId, chart.trim())
        if (cancelled) return

        el.innerHTML = svg
        const svgEl = el.querySelector('svg')
        if (svgEl && zoomable) {
          prepareSvgForZoom(svgEl)
          scheduleFitToView()
        } else {
          setReady(true)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudo renderizar el diagrama')
          el.innerHTML = ''
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [chart, diagramId, zoomable, scheduleFitToView])

  useEffect(() => {
    if (!zoomable || !isFullscreen) return
    scheduleFitToView()
  }, [isFullscreen, zoomable, scheduleFitToView])

  const zoomIn = () => setScale((s) => clamp(s + ZOOM_STEP, MIN_SCALE, MAX_SCALE))
  const zoomOut = () => setScale((s) => clamp(s - ZOOM_STEP, MIN_SCALE, MAX_SCALE))

  const handleWheel = (e) => {
    if (!zoomable) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setScale((s) => clamp(s + delta, MIN_SCALE, MAX_SCALE))
  }

  const onPointerDown = (e) => {
    if (!zoomable || e.button !== 0) return
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    }
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return
    setPan({
      x: dragRef.current.panX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.panY + (e.clientY - dragRef.current.startY),
    })
  }

  const onPointerUp = (e) => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setIsDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const viewportClass = [
    'relative w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/60',
    zoomable ? 'touch-none select-none' : 'overflow-x-auto p-4',
    isDragging ? 'cursor-grabbing' : zoomable ? 'cursor-grab' : '',
    isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : zoomable ? 'h-[min(55vh,28rem)]' : '',
  ].join(' ')

  return (
    <figure className={`min-w-0 max-w-full ${className}`}>
      {title ? (
        <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>
      ) : null}

      {zoomable ? (
        <div className="min-w-0 max-w-full space-y-2">
          <ZoomToolbar
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFit={fitToView}
            onFullscreen={() => setIsFullscreen((v) => !v)}
            isFullscreen={isFullscreen}
          />
          <p className="text-[11px] text-slate-500">
            Rueda del ratón para zoom · arrastra para mover · doble clic para ajustar
          </p>
          {isFullscreen ? (
            <button
              type="button"
              aria-label="Cerrar pantalla completa"
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsFullscreen(false)}
            />
          ) : null}
          <div
            ref={viewportRef}
            className={viewportClass}
            onWheel={handleWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onDoubleClick={fitToView}
          >
            {loading && !error ? (
              <p className="absolute inset-0 z-10 flex items-center justify-center text-xs text-slate-500">
                Generando diagrama…
              </p>
            ) : null}
            <div
              className="absolute left-0 top-0 will-change-transform"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                opacity: ready ? 1 : 0,
              }}
            >
              <div ref={containerRef} className="inline-block [&_svg]:block" />
            </div>
          </div>
        </div>
      ) : (
        <div className={viewportClass}>
          {loading && !error ? (
            <p className="py-8 text-center text-xs text-slate-500">Generando diagrama…</p>
          ) : null}
          <div ref={containerRef} className="mermaid-wrap [&_svg]:mx-auto [&_svg]:max-w-full" />
        </div>
      )}

      {error ? <p className="mt-2 text-xs text-amber-300/90">{error}</p> : null}
    </figure>
  )
}
