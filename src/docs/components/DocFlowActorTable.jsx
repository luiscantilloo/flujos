import { HiMiniArrowRight } from 'react-icons/hi2'

/** Pasos de un flujo E2E (# → Actor → Acción). */
export function DocFlowActorTable({ rows }) {
  if (!rows?.length) return null

  return (
    <div className="mb-8 space-y-3">
      {rows.map(([num, actor, accion], idx) => (
        <div key={`${num}-${idx}`}>
          <div className="grid gap-2 rounded-xl border border-slate-700/65 bg-slate-900/35 p-3.5 shadow-sm ring-1 ring-white/[0.03] sm:grid-cols-[2.5rem_8rem_1fr] sm:gap-4 sm:p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/25">
              {num}
            </span>
            <span className="text-sm font-semibold text-sky-200/95">{actor}</span>
            <p className="text-[14px] leading-relaxed text-slate-300/95 sm:col-span-1">{accion}</p>
          </div>
          {idx < rows.length - 1 ? (
            <div className="flex justify-center py-1 text-slate-600">
              <HiMiniArrowRight className="h-4 w-4 rotate-90" aria-hidden />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
