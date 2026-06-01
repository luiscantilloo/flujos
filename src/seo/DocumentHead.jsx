import { Helmet } from 'react-helmet-async'
import { useLocation, useParams } from 'react-router-dom'
import { getRouteSeo } from './routeSeo.js'

const SITE_ORIGIN =
  typeof window !== 'undefined' ? window.location.origin : 'https://flujos-nine.vercel.app'

export function DocumentHead() {
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

  const seo = getRouteSeo(pathname, routeParams)
  const canonical = `${SITE_ORIGIN}${seo.canonicalPath ?? pathname}`

  return (
    <Helmet>
      <html lang="es" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.markdownSource ? (
        <link rel="alternate" type="text/markdown" href={seo.markdownSource} />
      ) : null}
    </Helmet>
  )
}
