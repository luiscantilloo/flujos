import { Link } from 'react-router-dom'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import { getEnabledHubProjects } from '../data/hubProjects.js'
import { ACCENT_STYLES } from '../home/portalAccents.js'

export function ProjectPicker({ topic, onSelectProject, onBack }) {
  const projects = getEnabledHubProjects()

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-auto bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_30%_-10%,rgba(139,92,246,0.14),transparent)]" />

      <div className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
        <Link
          to={paths.home}
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
        >
          <HiArrowLeft className="h-4 w-4" aria-hidden />
          Menú principal
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">{topic.title}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50">Elige el proyecto</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">{topic.subtitle}</p>
        <p className="mt-2 text-xs text-slate-500">
          La referencia se carga por proyecto. Por ahora solo está disponible Bodega de frío; al registrar más
          proyectos aparecerán aquí.
        </p>

        <ul className="mt-10 flex flex-col gap-4" role="list">
          {projects.map((project, index) => {
            const accent = ACCENT_STYLES[project.accent] ?? ACCENT_STYLES.sky
            return (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`portal-fade-in portal-card-hover group relative w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/45 p-5 text-left shadow-lg ${accent.border}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-80 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
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
                    </div>
                    <HiArrowRight
                      className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-300"
                      aria-hidden
                    />
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
