import { FormulariosPortal } from '../docs/FormulariosPortal.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { paths } from '../router/paths.js'

export default function FormulariosPage() {
  const { sectionId, formId } = useParams()
  const navigate = useNavigate()

  return (
    <FormulariosPortal
      key={`${sectionId ?? 'index'}-${formId ?? ''}`}
      sectionId={sectionId ?? null}
      formId={formId ?? null}
      onNavigate={(nextSection, nextForm) => {
        if (!nextSection) navigate(paths.formularios)
        else if (!nextForm) navigate(paths.formulariosEsquema)
        else navigate(paths.formularioSchema(nextForm))
      }}
    />
  )
}
