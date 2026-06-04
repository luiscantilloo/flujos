import { useEffect, useRef } from 'react'
import { BODEGA_STEP_CHAPTERS } from '../../data/bodegaStepByStepData.js'
import { FrostIcon } from '../frostIcons.jsx'

const VISUAL_ICON = {
  ice: 'ice',
  snow: 'snow',
  cloud: 'cloud',
  crystal: 'crystal',
  aurora: 'aurora',
}

export function IceStepTrail({ steps, currentIndex, onJump }) {
  const currentRef = useRef(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [currentIndex])

  return (
    <div className="app-scroll-x shrink-0 border-b border-cyan-900/40 bg-slate-950/80 px-2 py-3 backdrop-blur-sm">
      <div className="flex min-w-max items-center gap-1 px-2">
        {steps.map((step, i) => {
          const done = i < currentIndex
          const current = i === currentIndex
          const chapter = BODEGA_STEP_CHAPTERS.find((c) => c.id === step.chapter)
          const iconKey = VISUAL_ICON[step.visual] ?? 'ice'

          return (
            <div key={step.id} className="flex items-center">
              <button
                ref={current ? currentRef : null}
                type="button"
                onClick={() => onJump(i)}
                title={step.title}
                className={[
                  'group relative flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 transition-all duration-300',
                  current ? 'z-10 scale-125' : 'opacity-70 hover:scale-105 hover:opacity-100',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300',
                    current
                      ? 'frost-ice-glow border-cyan-300/70 bg-cyan-500/25 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.45)]'
                      : done
                        ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-400 group-hover:border-emerald-400/60'
                        : 'border-slate-600/50 bg-slate-900/80 text-slate-400 group-hover:border-cyan-500/40 group-hover:text-cyan-300/80',
                  ].join(' ')}
                >
                  {done ? <FrostIcon name="check" className="h-4 w-4" /> : <FrostIcon name={iconKey} className="h-4 w-4" />}
                </span>
                <span
                  className={[
                    'max-w-[52px] truncate text-[9px] font-medium',
                    current ? 'text-cyan-200' : 'text-slate-500',
                  ].join(' ')}
                >
                  {i + 1}
                </span>
                {current && chapter ? (
                  <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cyan-400/80" />
                ) : null}
              </button>
              {i < steps.length - 1 ? (
                <span
                  className={[
                    'mx-0.5 h-0.5 w-3 shrink-0 rounded-full transition-colors sm:w-5',
                    i < currentIndex ? 'bg-cyan-500/50' : 'bg-slate-700',
                  ].join(' ')}
                  aria-hidden
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
