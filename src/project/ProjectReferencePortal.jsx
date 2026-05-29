import { lazy, Suspense } from 'react'
import { getHubProject } from '../data/hubProjects.js'
import { getReferenceTopic } from '../data/referenceTopics.js'
import { ProjectPicker } from './ProjectPicker.jsx'
import { ReferenceMarkdownView } from './views/ReferenceMarkdownView.jsx'

const GlossaryPortal = lazy(() =>
  import('../glossary/GlossaryPortal.jsx').then((m) => ({ default: m.GlossaryPortal })),
)
const ChecklistPortal = lazy(() =>
  import('../devhub/ChecklistPortal.jsx').then((m) => ({ default: m.ChecklistPortal })),
)
const DatabasePortal = lazy(() =>
  import('../database/DatabasePortal.jsx').then((m) => ({ default: m.DatabasePortal })),
)

function ViewFallback({ label }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-950 text-sm text-slate-400">
      Cargando {label}…
    </div>
  )
}

export function ProjectReferencePortal({ topicId, projectId, onSelectProject, onBackToMain }) {
  const topic = getReferenceTopic(topicId)
  const project = projectId ? getHubProject(projectId) : null

  if (!topic) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-950 px-4 text-sm text-red-300">
        Tema de referencia no encontrado.
      </div>
    )
  }

  if (!project) {
    return (
      <ProjectPicker
        topic={topic}
        onSelectProject={onSelectProject}
        onBack={onBackToMain}
      />
    )
  }

  const backToProjects = () => onSelectProject(null)

  if (topic.view === 'glossary') {
    return (
      <Suspense fallback={<ViewFallback label="glosario" />}>
        <GlossaryPortal project={project} onBackToProjects={backToProjects} />
      </Suspense>
    )
  }

  if (topic.view === 'checklist') {
    return (
      <Suspense fallback={<ViewFallback label="checklist" />}>
        <ChecklistPortal project={project} onBackToProjects={backToProjects} />
      </Suspense>
    )
  }

  if (topic.view === 'database') {
    if (project.id !== 'bodega-frio') {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center">
          <p className="text-sm text-slate-400">
            El modelo de datos aún no está disponible para este proyecto.
          </p>
          <button
            type="button"
            onClick={backToProjects}
            className="text-sm text-sky-400 hover:text-sky-300"
          >
            ← Elegir otro proyecto
          </button>
        </div>
      )
    }
    return (
      <Suspense fallback={<ViewFallback label="modelo de datos" />}>
        <DatabasePortal onBackToMain={backToProjects} />
      </Suspense>
    )
  }

  return <ReferenceMarkdownView project={project} topic={topic} onBackToProjects={backToProjects} />
}
