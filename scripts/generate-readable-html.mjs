/**
 * Tras `vite build`, genera HTML por ruta con contenido legible para crawlers/IA.
 * Vercel sirve estos archivos antes del rewrite SPA; React hidrata y oculta el fallback.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { collectReadableRoutes } from './lib/readableContent.mjs'
import { markdownToHtml } from './lib/markdownToHtml.mjs'
import { documentationItems } from '../src/docs/docRegistry.js'
import { PORTAL_BRAND } from '../src/data/portalConfig.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE_URL = (process.env.SITE_URL || 'https://flujos-nine.vercel.app').replace(/\/$/, '')

function parseDistIndex() {
  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  const script = html.match(/<script type="module"[^>]+src="([^"]+)"/)?.[1]
  const styles = [...html.matchAll(/<link rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1])
  return { script, styles }
}

function buildPageHtml({ path, title, description, bodyHtml, assets, markdownSource }) {
  const canonical = path === '/' ? SITE_URL : `${SITE_URL}${path}`
  const styleTags = assets.styles.map((href) => `<link rel="stylesheet" crossorigin href="${href}">`).join('\n    ')
  const altMarkdown = markdownSource
    ? `\n    <link rel="alternate" type="text/markdown" href="${markdownSource}">`
    : ''

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeAttr(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />${altMarkdown}
    ${styleTags}
  </head>
  <body>
    <article id="static-readable" class="static-readable" aria-label="Contenido legible">
      <header class="static-readable__header">
        <p class="static-readable__brand">${escapeHtml(PORTAL_BRAND.title)}</p>
        <h1 class="static-readable__title">${escapeHtml(title)}</h1>
        <p class="static-readable__note">Versión en texto de esta página. La experiencia interactiva carga con JavaScript.</p>
      </header>
      <div class="static-readable__body readable-prose">
        ${bodyHtml}
      </div>
    </article>
    <div id="root"></div>
    <script type="module" crossorigin src="${assets.script}"></script>
  </body>
</html>
`
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function writeRouteHtml(routePath, html) {
  const targetDir = routePath === '/' ? dist : join(dist, routePath.replace(/^\//, ''))
  mkdirSync(targetDir, { recursive: true })
  writeFileSync(join(targetDir, 'index.html'), html, 'utf8')
}

function buildLlmsTxt(routes) {
  const lines = [
    `# ${PORTAL_BRAND.title}`,
    '',
    `> ${PORTAL_BRAND.tagline}`,
    '',
    'Este sitio es una SPA React; cada URL incluye HTML con el contenido en texto plano antes de hidratar.',
    'También puedes leer los Markdown fuente en `/docs/`.',
    '',
    '## Rutas principales',
    '',
  ]

  for (const route of routes) {
    const url = route.path === '/' ? SITE_URL : `${SITE_URL}${route.path}`
    lines.push(`- [${route.title}](${url}): ${route.description}`)
  }

  lines.push('', '## Markdown fuente (sin JavaScript)', '')
  for (const doc of documentationItems) {
    lines.push(`- [${doc.title}](${SITE_URL}${doc.filePath})`)
  }

  return lines.join('\n')
}

function buildSitemap(routes) {
  const urls = routes.map((r) => {
    const loc = r.path === '/' ? SITE_URL : `${SITE_URL}${r.path}`
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`
  })

  for (const doc of documentationItems) {
    urls.push(
      `  <url>\n    <loc>${SITE_URL}${doc.filePath}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
    )
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

const assets = parseDistIndex()
if (!assets.script) {
  console.error('generate-readable-html: no se encontró el bundle en dist/index.html. Ejecuta vite build primero.')
  process.exit(1)
}

const routes = collectReadableRoutes()

for (const route of routes) {
  const bodyHtml = markdownToHtml(route.markdown)
  const html = buildPageHtml({
    path: route.path,
    title: route.title,
    description: route.description,
    bodyHtml,
    assets,
    markdownSource: route.markdownSource,
  })
  writeRouteHtml(route.path, html)
}

writeFileSync(join(dist, 'llms.txt'), buildLlmsTxt(routes), 'utf8')
writeFileSync(join(dist, 'sitemap.xml'), buildSitemap(routes), 'utf8')

console.log(`generate-readable-html: ${routes.length} rutas con contenido legible + llms.txt + sitemap.xml`)
