import { Suspense } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { getBackNavigation, getRouteMeta } from '../router/routeMeta.js'
import { PortalFallback } from './PortalFallback.jsx'

export function AppLayout() {
  const { pathname } = useLocation()
  const params = useParams()
  const isReference = pathname.startsWith('/referencia/')
  const isStepByStep = pathname.startsWith('/paso-a-paso/')
  const routeParams = {
    flowAppId: params.flowAppId,
    docId: params.docId,
    topicId: params.topicId,
    projectId: isReference ? params.projectId : undefined,
    stepProjectId: isStepByStep ? params.projectId : undefined,
  }
  const meta = getRouteMeta(pathname, routeParams)
  const back = getBackNavigation(pathname, routeParams)

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="shrink-0 border-b border-slate-800/80 bg-slate-900/60 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">{meta.title}</h1>
            <p className="mt-0.5 text-sm text-slate-400">{meta.subtitle}</p>
          </div>
          {back.show ? (
            <Link
              to={back.to}
              className="shrink-0 rounded-lg border border-slate-600/80 bg-slate-800/80 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-violet-500/35 hover:bg-slate-800"
            >
              {back.label}
            </Link>
          ) : null}
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <Suspense fallback={<PortalFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
