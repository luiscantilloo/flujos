import { useMemo } from 'react'
import { FrostIcon } from '../frostIcons.jsx'

const AMBIENCE_ICONS = ['snowflake', 'sparkles', 'cloud', 'sparklesTb']

/** Copos flotantes clicables en el fondo del escenario */
export function FrostAmbience({ onPop }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        top: `${(i * 23 + 11) % 85}%`,
        delay: `${(i % 5) * 0.7}s`,
        icon: AMBIENCE_ICONS[i % AMBIENCE_ICONS.length],
        size: 14 + (i % 4) * 4,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {flakes.map((f) => (
        <button
          key={f.id}
          type="button"
          style={{
            left: f.left,
            top: f.top,
            animationDelay: f.delay,
          }}
          onClick={(e) => {
            e.stopPropagation()
            onPop?.(e.clientX, e.clientY)
          }}
          className="frost-ambience-flake pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent text-cyan-400/40 transition-all hover:scale-125 hover:text-cyan-300/90"
        >
          <FrostIcon name={f.icon} style={{ width: f.size, height: f.size }} />
        </button>
      ))}
    </div>
  )
}
