import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  HiMagnifyingGlassMinus,
  HiMagnifyingGlassPlus,
  HiOutlineArrowDownTray,
  HiOutlineArrowsPointingOut,
} from 'react-icons/hi2'
import mermaid from 'mermaid'
import { ErDiagramFullscreen } from '../../architecture/ErDiagramFullscreen.jsx'
import { exportPngHd, exportSvgFile } from './exportDiagramImage.js'
import { prepareSvgForZoom, useDiagramViewport, useDiagramViewportKeyboard } from './useDiagramViewport.js'

let mermaidReady = false

function ensureMermaid() {
  if (mermaidReady) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    er: { useMaxWidth: false, diagramPadding: 40, layoutDirection: 'TB' },
    class: { useMaxWidth: true },
  })
  mermaidReady = true
}

function ZoomToolbar({
  scale,
  onZoomIn,
  onZoomOut,
  onFit,
  onFullscreen,
  isFullscreen,
  exportable,
  onExportPng,
  onExportSvg,
  exporting,
}) {
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
        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-medium text-emerald-200 hover:border-emerald-400/50 hover:bg-emerald-500/20"
      >
        <HiOutlineArrowsPointingOut className="h-3.5 w-3.5" aria-hidden />
        {isFullscreen ? 'Salir' : 'Pantalla completa'}
      </button>
      {exportable ? (
        <div className="flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-800/80 p-0.5">
          <button
            type="button"
            onClick={onExportPng}
            disabled={exporting}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-emerald-200 disabled:cursor-wait disabled:opacity-60"
            title="PNG en alta resolución (3×)"
          >
            <HiOutlineArrowDownTray className="h-3.5 w-3.5" aria-hidden />
            {exporting ? 'Exportando…' : 'PNG HD'}
          </button>
          <button
            type="button"
            onClick={onExportSvg}
            disabled={exporting}
            className="rounded-md px-2 py-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200 disabled:cursor-wait disabled:opacity-60"
            title="SVG vectorial sin pérdida"
          >
            SVG
          </button>
        </div>
      ) : null}
    </div>
  )
}

function DiagramCanvas({
  viewportRef,
  containerRef,
  viewport,
  ready,
  loading,
  error,
  zoomable,
  className = '',
  showGrid = false,
}) {
  const { scale, pan, isDragging, handleWheel, onPointerDown, onPointerMove, onPointerUp, fitToView } =
    viewport

  return (
    <div
      ref={viewportRef}
      className={[
        'relative min-h-0 min-w-0 overflow-hidden',
        zoomable ? 'h-full w-full touch-none select-none' : 'app-scroll-x rounded-xl border border-slate-700/60 bg-slate-950/60 p-4',
        isDragging ? 'cursor-grabbing' : zoomable ? 'cursor-grab' : '',
        showGrid ? 'er-diagram-grid-bg' : zoomable ? 'bg-slate-950/80' : '',
        className,
      ].join(' ')}
      onWheel={zoomable ? handleWheel : undefined}
      onPointerDown={zoomable ? onPointerDown : undefined}
      onPointerMove={zoomable ? onPointerMove : undefined}
      onPointerUp={zoomable ? onPointerUp : undefined}
      onPointerLeave={zoomable ? onPointerUp : undefined}
      onDoubleClick={zoomable ? fitToView : undefined}
    >
      {loading && !error ? (
        <p className="absolute inset-0 z-10 flex items-center justify-center text-xs text-slate-500">
          Generando diagrama…
        </p>
      ) : null}
      {zoomable ? (
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
      ) : (
        <div ref={containerRef} className="mermaid-wrap [&_svg]:mx-auto [&_svg]:max-w-full" />
      )}
    </div>
  )
}

export function MermaidDiagram({
  chart,
  title,
  className = '',
  zoomable = false,
  exportable = false,
  exportFileName = 'diagrama',
  enhancedFullscreen = false,
  fullscreenTitle,
  renderFullscreenSidebar,
  fullscreenDirection,
  onFullscreenDirectionChange,
  fullscreenDetailLevel,
  onFullscreenDetailLevelChange,
  onCopySource,
}) {
  const containerRef = useRef(null)
  const viewportRef = useRef(null)
  const renderSeqRef = useRef(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [copied, setCopied] = useState(false)
  const reactId = useId().replace(/:/g, '')
  const diagramId = `mmd-${reactId}`

  const getSvg = useCallback(() => containerRef.current?.querySelector('svg') ?? null, [])

  const viewport = useDiagramViewport({
    viewportRef,
    getSvg,
    enabled: zoomable,
  })

  useDiagramViewportKeyboard(viewport, {
    active: isFullscreen && enhancedFullscreen,
    onExit: () => setIsFullscreen(false),
  })

  useEffect(() => {
    if (isFullscreen && enhancedFullscreen) {
      setSidebarOpen(true)
      requestAnimationFrame(() => viewport.scheduleFitToView())
    }
  }, [isFullscreen, enhancedFullscreen, chart, viewport.scheduleFitToView])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !chart?.trim()) return

    let cancelled = false
    setError(null)
    setLoading(true)
    setReady(false)

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
          viewport.scheduleFitToView()
        }
        setReady(true)
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
  }, [chart, diagramId, zoomable, viewport.scheduleFitToView, isFullscreen])

  useEffect(() => {
    if (!zoomable || !isFullscreen || enhancedFullscreen) return
    viewport.scheduleFitToView()
  }, [isFullscreen, zoomable, enhancedFullscreen, viewport.scheduleFitToView])

  const getExportSvg = () => {
    const svg = getSvg()
    if (!svg || !ready) return null
    return svg
  }

  const handleExportPng = async () => {
    const svg = getExportSvg()
    if (!svg) return
    setExportError(null)
    setExporting(true)
    try {
      await exportPngHd(svg, exportFileName)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Error al exportar PNG')
    } finally {
      setExporting(false)
    }
  }

  const handleExportSvg = () => {
    const svg = getExportSvg()
    if (!svg) return
    setExportError(null)
    try {
      exportSvgFile(svg, exportFileName)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Error al exportar SVG')
    }
  }

  const handleCopySource = async () => {
    if (onCopySource) {
      onCopySource()
      return
    }
    if (!chart) return
    try {
      await navigator.clipboard.writeText(chart)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const openFullscreen = () => {
    if (enhancedFullscreen) {
      setIsFullscreen(true)
      return
    }
    setIsFullscreen((v) => !v)
  }

  const inlineViewportClass = zoomable ? 'h-[min(55vh,28rem)] rounded-xl border border-slate-700/60' : ''

  const canvas = (
    <DiagramCanvas
      viewportRef={viewportRef}
      containerRef={containerRef}
      viewport={viewport}
      ready={ready}
      loading={loading}
      error={error}
      zoomable={zoomable}
      showGrid={false}
    />
  )

  return (
    <figure className={`min-w-0 max-w-full ${className}`}>
      {title && !isFullscreen ? (
        <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>
      ) : null}

      {zoomable ? (
        <div className="min-w-0 max-w-full space-y-2">
          {!isFullscreen || !enhancedFullscreen ? (
            <>
              <ZoomToolbar
                scale={viewport.scale}
                onZoomIn={viewport.zoomIn}
                onZoomOut={viewport.zoomOut}
                onFit={viewport.fitToView}
                onFullscreen={openFullscreen}
                isFullscreen={isFullscreen && !enhancedFullscreen}
                exportable={exportable && !enhancedFullscreen}
                onExportPng={handleExportPng}
                onExportSvg={handleExportSvg}
                exporting={exporting}
              />
              <p className="text-[11px] text-slate-500">
                Rueda: zoom al cursor · arrastra · doble clic ajustar
                {enhancedFullscreen ? ' · pantalla completa = estudio ER con panel y atajos' : ''}
                {exportable && !enhancedFullscreen ? ' · PNG HD 3×' : ''}
              </p>
            </>
          ) : null}

          {!enhancedFullscreen && isFullscreen ? (
            <button
              type="button"
              aria-label="Cerrar pantalla completa"
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsFullscreen(false)}
            />
          ) : null}

          {!enhancedFullscreen ? (
            <div className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
              <DiagramCanvas
                viewportRef={viewportRef}
                containerRef={containerRef}
                viewport={viewport}
                ready={ready}
                loading={loading}
                error={error}
                zoomable={zoomable}
                className={isFullscreen ? 'h-[calc(100vh-2rem)] rounded-xl border border-slate-600/50' : inlineViewportClass}
              />
            </div>
          ) : !isFullscreen ? (
            <div className={inlineViewportClass}>{canvas}</div>
          ) : null}
        </div>
      ) : (
        <DiagramCanvas
          viewportRef={viewportRef}
          containerRef={containerRef}
          viewport={viewport}
          ready={ready}
          loading={loading}
          error={error}
          zoomable={false}
        />
      )}

      {enhancedFullscreen ? (
        <ErDiagramFullscreen
          open={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          title={fullscreenTitle ?? title ?? 'Diagrama ER'}
          sidebar={renderFullscreenSidebar?.({ close: () => setIsFullscreen(false) })}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          scale={viewport.scale}
          onZoomIn={viewport.zoomIn}
          onZoomOut={viewport.zoomOut}
          onFit={viewport.fitToView}
          onZoom100={viewport.zoomTo100}
          onReset={viewport.resetView}
          exportable={exportable}
          exporting={exporting}
          onExportPng={handleExportPng}
          onExportSvg={handleExportSvg}
          onCopySource={chart ? handleCopySource : undefined}
          copied={copied}
          direction={fullscreenDirection}
          onDirectionChange={onFullscreenDirectionChange}
          detailLevel={fullscreenDetailLevel}
          onDetailLevelChange={onFullscreenDetailLevelChange}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid((v) => !v)}
        >
          <DiagramCanvas
            viewportRef={viewportRef}
            containerRef={containerRef}
            viewport={viewport}
            ready={ready}
            loading={loading}
            error={error}
            zoomable={zoomable}
            showGrid={showGrid}
            className="h-full w-full"
          />
        </ErDiagramFullscreen>
      ) : null}

      {error ? <p className="mt-2 text-xs text-amber-300/90">{error}</p> : null}
      {exportError ? <p className="mt-2 text-xs text-amber-300/90">{exportError}</p> : null}
    </figure>
  )
}
