import { HiMiniArrowRight } from 'react-icons/hi2'

/** Timeline visual para tablas Paso → Etapa → detalle (hilo conductor). */
export function DocStepTimeline({ rows }) {
  if (!rows?.length) return null

  return (
    <div className="doc-step-timeline mb-10">
      {rows.map((row, idx) => {
        const [paso, etapa, detalle] = row
        const isLast = idx === rows.length - 1
        return (
          <div key={`${paso}-${idx}`} className="relative flex gap-4 pb-6">
            <div className="flex w-10 shrink-0 flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/40 bg-violet-500/15 text-sm font-bold text-violet-100 shadow-inner ring-1 ring-violet-300/20">
                {paso}
              </span>
              {!isLast ? (
                <span className="mt-2 flex flex-1 flex-col items-center gap-0.5 text-violet-400/50">
                  <HiMiniArrowRight className="h-4 w-4 rotate-90" aria-hidden />
                  <span className="min-h-[1.5rem] w-px flex-1 bg-gradient-to-b from-violet-500/40 to-transparent" />
                </span>
              ) : null}
            </div>
            <div className="min-w-0 flex-1 rounded-2xl border border-slate-700/70 bg-slate-900/45 px-4 py-3.5 shadow-md ring-1 ring-white/[0.04] sm:px-5 sm:py-4">
              <p className="text-base font-semibold text-slate-50">{etapa}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-300/95">{detalle}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
