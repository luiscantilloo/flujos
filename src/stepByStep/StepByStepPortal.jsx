import { Link } from 'react-router-dom'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import { getHubProject, getEnabledHubProjects } from '../data/hubProjects.js'
import { BODEGA_STEP_COUNT } from '../data/bodegaStepByStepData.js'
import { ACCENT_STYLES } from '../home/portalAccents.js'
import { FrostJourney } from './FrostJourney.jsx'

function StepByStepProjectPicker({ onSelectProject, onBack }) {
  const projects = getEnabledHubProjects().filter((p) => p.id === 'bodega-frio')

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-auto bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(34,211,238,0.18),transparent)]" />
      <div className="frost-snow pointer-events-none absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
        <Link
          to={paths.home}
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
        >
          <HiArrowLeft className="h-4 w-4" aria-hidden />
          Menú principal
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">Destacados</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50">Paso a paso</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          Recorrido interactivo con temática de hielo: cada parada es una nube o cristal que puedes tocar, decidir
          ramas S/N y practicar el flujo real del WMS — desde el configurador hasta el cierre con evidencias.
        </p>

        <ul className="mt-10 flex flex-col gap-4" role="list">
          {projects.map((project, index) => {
            const accent = ACCENT_STYLES[project.accent] ?? ACCENT_STYLES.sky
            return (
              <li key={project.id}>
                <Link
                  to={paths.stepByStep(project.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`portal-fade-in portal-card-hover group relative block w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/45 p-5 text-left shadow-lg ${accent.border}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-80 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-200">
                          {BODEGA_STEP_COUNT} pasos interactivos
                        </span>
                        {(project.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-slate-950/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-50">{project.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{project.summary}</p>
                      <p className="mt-3 text-xs text-cyan-300/80">Teclado: ← → · Espacio para avanzar</p>
                    </div>
                    <HiArrowRight
                      className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-300"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function StepByStepPortal({ projectId, onSelectProject, onBackToMain }) {
  const project = projectId ? getHubProject(projectId) : null

  if (!project) {
    return <StepByStepProjectPicker onSelectProject={onSelectProject} onBack={onBackToMain} />
  }

  if (project.id !== 'bodega-frio') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center">
        <p className="text-sm text-slate-400">El paso a paso interactivo aún no está disponible para este proyecto.</p>
        <button type="button" onClick={() => onSelectProject(null)} className="text-sm text-sky-400 hover:text-sky-300">
          ← Elegir otro proyecto
        </button>
      </div>
    )
  }

  return (
    <FrostJourney projectName={project.name} onBackToProjects={() => onSelectProject(null)} />
  )
}
