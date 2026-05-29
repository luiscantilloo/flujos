import { useNavigate } from 'react-router-dom'
import { DevResourcesPortal } from '../devhub/DevResourcesPortal.jsx'
import { paths } from '../router/paths.js'

export default function DevResourcesPage() {
  const navigate = useNavigate()

  return (
    <DevResourcesPortal
      onBackToMain={() => navigate(paths.home)}
      onOpenDocSection={(docId, headingId) => navigate(paths.doc(docId, headingId))}
    />
  )
}
