import { lazy, Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getFlowApplicationById } from '../data/portalConfig.js'
import { PortalFallback } from '../layout/PortalFallback.jsx'
import { paths } from '../router/paths.js'

const FlowComponent = lazy(() => import('../flow/FlowComponent.jsx'))

export default function FlowDiagramPage() {
  const { flowAppId } = useParams()
  const flowApplication = flowAppId ? getFlowApplicationById(flowAppId) : null

  if (!flowApplication) {
    return <Navigate to={paths.flows} replace />
  }

  return (
    <Suspense fallback={<PortalFallback label="diagrama" />}>
      <FlowComponent key={flowApplication.id} flowApplication={flowApplication} />
    </Suspense>
  )
}
