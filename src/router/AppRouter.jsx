import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { FlowsIndexPage } from '../pages/FlowsIndexPage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'

const FlowDiagramPage = lazy(() => import('../pages/FlowDiagramPage.jsx'))
const DocumentationPage = lazy(() => import('../pages/DocumentationPage.jsx'))
const ReferencePage = lazy(() => import('../pages/ReferencePage.jsx'))
const DevResourcesPage = lazy(() => import('../pages/DevResourcesPage.jsx'))
const StepByStepPage = lazy(() => import('../pages/StepByStepPage.jsx'))
const StackArchitecturePage = lazy(() => import('../pages/StackArchitecturePage.jsx'))
const ProjectStructurePage = lazy(() => import('../pages/ProjectStructurePage.jsx'))
const UserManualPage = lazy(() => import('../pages/UserManualPage.jsx'))
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'flujos', element: <FlowsIndexPage /> },
      { path: 'flujos/:flowAppId', element: <FlowDiagramPage /> },
      { path: 'documentacion', element: <DocumentationPage /> },
      { path: 'documentacion/:docId', element: <DocumentationPage /> },
      { path: 'documentacion/:docId/:headingId', element: <DocumentationPage /> },
      { path: 'referencia/:topicId', element: <ReferencePage /> },
      { path: 'referencia/:topicId/:projectId', element: <ReferencePage /> },
      { path: 'recursos', element: <DevResourcesPage /> },
      { path: 'manual-usuario', element: <UserManualPage /> },
      { path: 'manual-usuario/:manualId', element: <UserManualPage /> },
      { path: 'estructura-proyecto', element: <ProjectStructurePage /> },
      { path: 'arquitectura', element: <StackArchitecturePage /> },
      { path: 'arquitectura-stack', element: <StackArchitecturePage /> },
      { path: 'paso-a-paso', element: <StepByStepPage /> },
      { path: 'paso-a-paso/:projectId', element: <StepByStepPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
