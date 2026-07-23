import { UserManualPortal } from '../docs/UserManualPortal.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from '../router/paths.js'

export default function UserManualPage() {
  const { manualId } = useParams()
  const navigate = useNavigate()

  return (
    <UserManualPortal
      key={manualId ?? 'index'}
      manualId={manualId ?? null}
      onNavigateManual={(id) => {
        if (!id) navigate(paths.userManual)
        else navigate(paths.userManualItem(id))
      }}
    />
  )
}
