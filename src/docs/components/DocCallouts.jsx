import { HiOutlineInformationCircle, HiOutlineLightBulb } from 'react-icons/hi2'
import { FiPaperclip } from 'react-icons/fi'

export function ReferenceFileCard({ children }) {
  return (
    <aside
      className="group relative mb-8 overflow-hidden rounded-2xl border border-sky-500/35 bg-gradient-to-br from-sky-950/50 via-slate-900/40 to-slate-950/60 p-0 shadow-lg shadow-sky-950/20 ring-1 ring-sky-400/15"
      role="note"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-400 to-cyan-500" />
      <div className="flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-200">
          <FiPaperclip className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-300/90">Referencia</p>
          <div className="mt-1.5 text-[15px] leading-relaxed text-slate-100/95 [&_strong]:font-semibold [&_strong]:text-white">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}

export function NotaCallout({ children }) {
  return (
    <aside
      className="relative mb-8 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/35 via-slate-900/35 to-slate-950/50 p-0 shadow-lg ring-1 ring-violet-400/10"
      role="status"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-400 to-fuchsia-500" />
      <div className="flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-500/10 text-violet-100">
          <HiOutlineLightBulb className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-200/90">Nota</p>
          <div className="mt-1.5 text-[15px] leading-relaxed text-slate-200/95 [&_strong]:text-white">{children}</div>
        </div>
      </div>
    </aside>
  )
}

export function GenericInsightCard({ children }) {
  return (
    <aside className="relative mb-8 rounded-2xl border border-slate-600/50 bg-slate-900/50 px-5 py-4 shadow-inner sm:px-6 sm:py-5">
      <div className="flex gap-3">
        <HiOutlineInformationCircle className="mt-0.5 h-6 w-6 shrink-0 text-slate-400" aria-hidden />
        <div className="min-w-0 text-[15px] leading-relaxed text-slate-200/95">{children}</div>
      </div>
    </aside>
  )
}
