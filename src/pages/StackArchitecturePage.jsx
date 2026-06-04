import { Navigate, useSearchParams } from 'react-router-dom'
import { StackArchitecturePortal } from '../architecture/StackArchitecturePortal.jsx'
import { paths } from '../router/paths.js'

export default function StackArchitecturePage() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')

  if (tab === 'frontend' || tab === 'backend') {
    const next = new URLSearchParams()
    next.set('tab', tab)
    return <Navigate to={`${paths.projectStructure}?${next}`} replace />
  }

  return <StackArchitecturePortal />
}
