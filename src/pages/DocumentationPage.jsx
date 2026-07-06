import { DocumentationPortal } from '../docs/DocumentationPortal.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from '../router/paths.js'

export default function DocumentationPage() {
  const { docId, headingId } = useParams()
  const navigate = useNavigate()

  return (
    <DocumentationPortal
      key={`${docId ?? 'index'}-${headingId ?? ''}`}
      docId={docId ?? null}
      headingId={headingId ?? null}
      onNavigateDoc={(id, heading) => {
        if (!id) navigate(paths.docs)
        else navigate(paths.doc(id, heading ?? undefined))
      }}
    />
  )
}
