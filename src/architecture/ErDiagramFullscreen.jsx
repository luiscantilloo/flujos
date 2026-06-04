import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  HiMagnifyingGlassMinus,
  HiMagnifyingGlassPlus,
  HiOutlineArrowDownTray,
  HiOutlineArrowsPointingIn,
  HiOutlineArrowsRightLeft,
  HiOutlineArrowsUpDown,
  HiXMark,
} from 'react-icons/hi2'
import { FiSidebar } from 'react-icons/fi'

function ToolBtn({ children, onClick, active, title, disabled, className = '' }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        'rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-100'
          : 'border-slate-600/60 bg-slate-800/90 text-slate-300 hover:border-emerald-400/40 hover:text-emerald-100',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} [props.title]
 * @param {React.ReactNode} props.children — viewport del diagrama
 * @param {React.ReactNode} [props.sidebar]
 * @param {boolean} props.sidebarOpen
 * @param {() => void} props.onToggleSidebar
 * @param {number} props.scale
 * @param {() => void} props.onZoomIn
 * @param {() => void} props.onZoomOut
 * @param {() => void} props.onFit
 * @param {() => void} props.onZoom100
 * @param {() => void} props.onReset
 * @param {boolean} [props.exportable]
 * @param {boolean} [props.exporting]
 * @param {() => void} [props.onExportPng]
 * @param {() => void} [props.onExportSvg]
 * @param {() => void} [props.onCopySource]
 * @param {boolean} [props.copied]
 * @param {'TB'|'LR'} [props.direction]
 * @param {(d: 'TB'|'LR') => void} [props.onDirectionChange]
 * @param {'minimal'|'summary'|'standard'|'full'} [props.detailLevel]
 * @param {(l: 'minimal'|'summary'|'standard'|'full') => void} [props.onDetailLevelChange]
 * @param {boolean} [props.showGrid]
 * @param {() => void} [props.onToggleGrid]
 */
export function ErDiagramFullscreen({
  open,
  onClose,
  title = 'Diagrama ER',
  children,
  sidebar,
  sidebarOpen,
  onToggleSidebar,
  scale,
  onZoomIn,
  onZoomOut,
  onFit,
  onZoom100,
  onReset,
  exportable,
  exporting,
  onExportPng,
  onExportSvg,
  onCopySource,
  copied,
  direction,
  onDirectionChange,
  detailLevel,
  onDetailLevelChange,
  showGrid,
  onToggleGrid,
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const pct = Math.round(scale * 100)

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-slate-950"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-700/60 bg-slate-900/95 px-3 py-2 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-100">{title}</p>
          <p className="hidden text-[10px] text-slate-500 sm:block">
            Rueda: zoom al cursor · Arrastrar: mover · Doble clic: ajustar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-0.5 rounded-lg border border-slate-600/60 bg-slate-800/90 p-0.5">
            <button
              type="button"
              onClick={onZoomOut}
              className="rounded-md p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
              aria-label="Alejar"
            >
              <HiMagnifyingGlassMinus className="h-4 w-4" />
            </button>
            <span className="min-w-[3.25rem] px-1 text-center font-mono text-xs text-emerald-200/90">{pct}%</span>
            <button
              type="button"
              onClick={onZoomIn}
              className="rounded-md p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
              aria-label="Acercar"
            >
              <HiMagnifyingGlassPlus className="h-4 w-4" />
            </button>
          </div>

          <ToolBtn onClick={onFit} title="Ajustar al lienzo (0)">
            Ajustar
          </ToolBtn>
          <ToolBtn onClick={onZoom100} title="Zoom 100% centrado (1)">
            100%
          </ToolBtn>
          <ToolBtn onClick={onReset} title="Reiniciar vista (R)">
            Reiniciar
          </ToolBtn>

          {onDirectionChange ? (
            <div className="flex rounded-lg border border-slate-600/60 bg-slate-800/90 p-0.5">
              <button
                type="button"
                title="Vertical (arriba → abajo)"
                onClick={() => onDirectionChange('TB')}
                className={[
                  'rounded-md p-2 transition-colors',
                  direction === 'TB' ? 'bg-emerald-500/25 text-emerald-100' : 'text-slate-400 hover:text-slate-200',
                ].join(' ')}
              >
                <HiOutlineArrowsUpDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Horizontal (izquierda → derecha)"
                onClick={() => onDirectionChange('LR')}
                className={[
                  'rounded-md p-2 transition-colors',
                  direction === 'LR' ? 'bg-emerald-500/25 text-emerald-100' : 'text-slate-400 hover:text-slate-200',
                ].join(' ')}
              >
                <HiOutlineArrowsRightLeft className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {onDetailLevelChange ? (
            <select
              value={detailLevel}
              onChange={(e) =>
                onDetailLevelChange(/** @type {'minimal'|'summary'|'standard'|'full'} */ (e.target.value))
              }
              className="rounded-lg border border-slate-600/60 bg-slate-800/90 px-2 py-1.5 text-[11px] text-slate-200 focus:border-emerald-500/40 focus:outline-none"
              title="Campos visibles en cada entidad"
            >
              <option value="minimal">Solo PK/FK</option>
              <option value="standard">Campos estándar</option>
              <option value="full">Todos los campos</option>
            </select>
          ) : null}

          {onToggleGrid ? (
            <ToolBtn onClick={onToggleGrid} active={showGrid} title="Cuadrícula de fondo">
              Cuadrícula
            </ToolBtn>
          ) : null}

          {exportable ? (
            <>
              <ToolBtn onClick={onExportPng} disabled={exporting} title="PNG alta resolución">
                <span className="inline-flex items-center gap-1">
                  <HiOutlineArrowDownTray className="h-3.5 w-3.5" />
                  {exporting ? '…' : 'PNG'}
                </span>
              </ToolBtn>
              <ToolBtn onClick={onExportSvg} disabled={exporting} title="SVG vectorial">
                SVG
              </ToolBtn>
            </>
          ) : null}

          {onCopySource ? (
            <ToolBtn onClick={onCopySource} title="Copiar código Mermaid">
              {copied ? 'Copiado' : 'Mermaid'}
            </ToolBtn>
          ) : null}

          <ToolBtn onClick={onToggleSidebar} active={sidebarOpen} title="Panel lateral">
            <span className="inline-flex items-center gap-1">
              <FiSidebar className="h-3.5 w-3.5" />
              Panel
            </span>
          </ToolBtn>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/35 bg-rose-950/50 px-3 py-1.5 text-[11px] font-semibold text-rose-100 hover:bg-rose-900/60"
            title="Salir (Escape)"
          >
            <HiXMark className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div
          className={[
            'relative min-h-0 min-w-0 flex-1',
            showGrid ? 'er-diagram-grid-bg' : 'bg-slate-950',
          ].join(' ')}
        >
          {children}
        </div>

        {sidebarOpen && sidebar ? (
          <aside className="flex w-full max-w-sm shrink-0 flex-col border-l border-slate-700/60 bg-slate-900/95 sm:max-w-md">
            <div className="flex items-center justify-between border-b border-slate-700/50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Explorar</p>
              <button
                type="button"
                onClick={onToggleSidebar}
                className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                aria-label="Ocultar panel"
              >
                <HiOutlineArrowsPointingIn className="h-4 w-4" />
              </button>
            </div>
            <div className="app-scroll-panel min-h-0 flex-1">{sidebar}</div>
          </aside>
        ) : null}
      </div>

      <footer className="shrink-0 border-t border-slate-800/80 bg-slate-900/80 px-3 py-1.5 text-center text-[10px] text-slate-500">
        <span className="hidden sm:inline">
          <kbd className="rounded border border-slate-600/50 px-1">+</kbd>/<kbd className="rounded border border-slate-600/50 px-1">−</kbd> zoom ·{' '}
          <kbd className="rounded border border-slate-600/50 px-1">0</kbd> ajustar ·{' '}
          <kbd className="rounded border border-slate-600/50 px-1">1</kbd> 100% ·{' '}
          <kbd className="rounded border border-slate-600/50 px-1">R</kbd> reiniciar ·{' '}
          <kbd className="rounded border border-slate-600/50 px-1">←↑→↓</kbd> mover ·{' '}
          <kbd className="rounded border border-slate-600/50 px-1">Esc</kbd> salir
        </span>
        <span className="sm:hidden">Pellizca o usa la barra superior</span>
      </footer>
    </div>,
    document.body,
  )
}
