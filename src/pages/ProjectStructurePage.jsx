import { Navigate, useSearchParams } from 'react-router-dom'
import { ProjectStructurePortal } from '../architecture/ProjectStructurePortal.jsx'
import { paths } from '../router/paths.js'

export default function ProjectStructurePage() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')

  if (tab === 'database') {
    const dbView = searchParams.get('dbView')
    const target = dbView
      ? `${paths.stackArchitecture}?dbView=${encodeURIComponent(dbView)}`
      : paths.stackArchitecture
    return <Navigate to={target} replace />
  }

  const initialTab = tab === 'backend' ? 'backend' : 'frontend'
  return <ProjectStructurePortal initialTab={initialTab} />
}
