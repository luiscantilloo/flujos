import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ManualUsuarioPortal } from '../manual/ManualUsuarioPortal.jsx'
import { paths } from '../router/paths.js'
import { isValidManualEntry } from '../data/userManuals.js'

export default function ManualUsuarioPage() {
  const { entryId } = useParams()
  const navigate = useNavigate()

  if (entryId && !isValidManualEntry(entryId)) {
    return <Navigate to={paths.manual()} replace />
  }

  return (
    <ManualUsuarioPortal
      entryId={entryId ?? null}
      onSelectEntry={(id) => navigate(paths.manual(id))}
      onBackToIndex={() => navigate(paths.manual())}
      onBackToMain={() => navigate(paths.home)}
    />
  )
}
