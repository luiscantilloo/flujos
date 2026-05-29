import { FrostIcon } from '../frostIcons.jsx'

const MOODS = {
  idle: { icon: 'mascotWave', msg: '¡Tócame o interactúa abajo!', anim: 'frost-mascot-bounce' },
  happy: { icon: 'mascot', msg: '¡Bien! Siguiente cristal →', anim: 'frost-mascot-jump' },
  think: { icon: 'think', msg: 'Prueba otra opción…', anim: 'frost-mascot-wiggle' },
  cold: { icon: 'snowflake', msg: '¡Brrr! Temperatura crítica', anim: 'frost-mascot-shake' },
  hot: { icon: 'hot', msg: '¡Calor! Necesitas override', anim: 'frost-mascot-shake' },
  celebrate: { icon: 'celebrate', msg: '¡Flujo dominado!', anim: 'frost-mascot-jump' },
  locked: { icon: 'lock', msg: 'Ese slot está reservado', anim: 'frost-mascot-wiggle' },
}

export function FrostMascot({ mood = 'idle', energy = 0, onPoke }) {
  const m = MOODS[mood] ?? MOODS.idle

  return (
    <button
      type="button"
      onClick={onPoke}
      className="group relative flex items-center gap-3 rounded-2xl border border-cyan-500/25 bg-cyan-950/40 px-3 py-2 text-left transition-all hover:border-cyan-400/50 hover:bg-cyan-900/40 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]"
      title="Toca a Frosti"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 ${m.anim}`}
      >
        <FrostIcon name={m.icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/80">Frosti</p>
        <p className="text-xs text-cyan-100/90 transition-all group-hover:text-cyan-50">{m.msg}</p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${energy}%` }}
          />
        </div>
      </div>
      <span className="text-[10px] tabular-nums text-slate-500">{Math.round(energy)}%</span>
    </button>
  )
}
