/** Zona de juego con borde que pulsa hasta que el usuario interactúa */
export function InteractiveStage({ engaged, children, onStageClick }) {
  return (
    <div
      role="presentation"
      onClick={onStageClick}
      className={[
        'relative mt-6 overflow-hidden rounded-3xl border-2 p-1 transition-all duration-500',
        engaged
          ? 'border-cyan-400/50 bg-gradient-to-b from-cyan-950/40 to-slate-950/60 shadow-[0_0_40px_rgba(34,211,238,0.15)]'
          : 'frost-stage-pulse border-cyan-500/30 bg-slate-900/40',
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      {!engaged ? (
        <p className="pointer-events-none absolute right-3 top-2 z-10 animate-pulse text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">
          ↓ Juega aquí
        </p>
      ) : null}
      <div className="relative rounded-[1.35rem] bg-slate-950/50 px-4 py-5 sm:px-6">{children}</div>
    </div>
  )
}
