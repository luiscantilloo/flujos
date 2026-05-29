import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ProjectReferencePortal } from '../project/ProjectReferencePortal.jsx'
import { paths } from '../router/paths.js'
import { isValidHubProject, isValidReferenceTopic } from '../router/routeMeta.js'

export default function ReferencePage() {
  const { topicId, projectId } = useParams()
  const navigate = useNavigate()

  if (!topicId || !isValidReferenceTopic(topicId)) {
    return <Navigate to={paths.home} replace />
  }

  if (projectId && !isValidHubProject(projectId)) {
    return <Navigate to={paths.reference(topicId)} replace />
  }

  return (
    <ProjectReferencePortal
      topicId={topicId}
      projectId={projectId ?? null}
      onSelectProject={(id) => {
        if (!id) navigate(paths.reference(topicId))
        else navigate(paths.reference(topicId, id))
      }}
      onBackToMain={() => navigate(paths.home)}
    />
  )
}
