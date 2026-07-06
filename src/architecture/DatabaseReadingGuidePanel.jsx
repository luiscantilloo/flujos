import { useMemo } from 'react'
import { HiOutlineBookOpen } from 'react-icons/hi2'
import { DocDownloadMenu } from '../docs/components/DocDownloadMenu.jsx'
import {
  ONBOARDING_FLOW_ASCII,
  SCHEMA_READING_PHASES,
  TABLE_READING_SEQUENCE,
  formatReadingGuideMarkdown,
} from '../data/bodegaDatabaseSchema.js'

function CopyButton({ text, label }) {
  const copy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-slate-600/50 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-emerald-400/40 hover:text-emerald-200"
    >
      {label}
    </button>
  )
}

export function DatabaseReadingGuidePanel({ onSelectTable }) {
  const markdown = useMemo(() => formatReadingGuideMarkdown(), [])

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20">
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-500/20 px-4 py-3">
        <HiOutlineBookOpen className="h-5 w-5 text-emerald-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-emerald-100">Guía de lectura — tablas 0 a 31</p>
          <p className="text-xs text-emerald-200/60">
            Empieza en paso 0. Guía en lenguaje fácil (como para explicárselo a un niño de 10 años).
          </p>
        </div>
        <CopyButton text={markdown} label="Copiar guía" />
        <DocDownloadMenu
          title="Guía de lectura — tablas ER"
          markdown={markdown}
          sourcePath="/docs/guia_explicacion_tablas_er.md"
        />
        <a
          href="/docs/guia_explicacion_tablas_er.md"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-sky-500/35 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-200 hover:bg-sky-500/20"
        >
          Guía para explicar (fácil)
        </a>
      </div>

      <div className="app-scroll-panel max-h-[22rem] space-y-4 p-4">
        <pre className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-950/70 p-3 font-mono text-[11px] leading-relaxed text-slate-300">
          {ONBOARDING_FLOW_ASCII}
        </pre>

        {SCHEMA_READING_PHASES.map((phase) => {
          const steps = TABLE_READING_SEQUENCE.filter((s) => s.phaseId === phase.id)
          return (
            <section key={phase.id}>
              <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-300/90">{phase.label}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{phase.summary}</p>
              <ol className="mt-2 space-y-1.5">
                {steps.map((s) => (
                  <li key={`${s.order}-${s.entityId}`} className="flex flex-wrap items-baseline gap-2 text-xs">
                    <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono font-bold text-emerald-200">
                      {s.order}
                    </span>
                    {s.entityId.startsWith('_') ? (
                      <span className="text-slate-400">{s.title}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectTable?.(s.entityId)}
                        className="font-mono text-emerald-200/90 underline-offset-2 hover:text-emerald-100 hover:underline"
                      >
                        {s.table}
                      </button>
                    )}
                    <span className="text-slate-500">— {s.readFirst}</span>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </div>
    </div>
  )
}
