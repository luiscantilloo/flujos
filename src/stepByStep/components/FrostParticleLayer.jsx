import { FrostIcon } from '../frostIcons.jsx'

export function FrostParticleLayer({ particles }) {
  if (!particles?.length) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {particles.map((p) =>
        p.iconKey ? (
          <span
            key={p.id}
            className="frost-particle-icon absolute flex text-cyan-300"
            style={{
              left: p.x,
              top: p.y,
              '--px': `${p.vx}px`,
              '--py': `${p.vy}px`,
            }}
          >
            <FrostIcon name={p.iconKey} className="h-4 w-4 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
          </span>
        ) : (
          <span
            key={p.id}
            className="frost-particle-dot absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              '--px': `${p.vx}px`,
              '--py': `${p.vy}px`,
              boxShadow: `0 0 12px ${p.color}`,
            }}
          />
        ),
      )}
    </div>
  )
}
