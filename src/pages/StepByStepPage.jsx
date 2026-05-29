import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { StepByStepPortal } from '../stepByStep/StepByStepPortal.jsx'
import { paths } from '../router/paths.js'
import { isValidHubProject } from '../router/routeMeta.js'

export default function StepByStepPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  if (projectId && !isValidHubProject(projectId)) {
    return <Navigate to={paths.stepByStep()} replace />
  }

  return (
    <StepByStepPortal
      projectId={projectId ?? null}
      onSelectProject={(id) => {
        if (!id) navigate(paths.stepByStep())
        else navigate(paths.stepByStep(id))
      }}
      onBackToMain={() => navigate(paths.home)}
    />
  )
}
