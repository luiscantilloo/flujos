function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineFormat(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

/** MD → HTML para exportación (ligero, sin react-markdown). */
export function markdownToExportHtml(markdown) {
  const lines = markdown.split('\n')
  const out = []
  let inList = false
  let inTable = false
  let tableRows = []

  const flushTable = () => {
    if (!tableRows.length) return
    out.push('<table><thead><tr>')
    tableRows[0].forEach((cell) => out.push(`<th>${cell}</th>`))
    out.push('</tr></thead><tbody>')
    for (let i = 2; i < tableRows.length; i++) {
      out.push('<tr>')
      tableRows[i].forEach((cell) => out.push(`<td>${cell}</td>`))
      out.push('</tr>')
    }
    out.push('</tbody></table>')
    tableRows = []
    inTable = false
  }

  const closeList = () => {
    if (inList) {
      out.push('</ul>')
      inList = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.startsWith('|') && line.endsWith('|')) {
      closeList()
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => inlineFormat(c.trim()))
      if (/^[\s\-:|]+$/.test(line.replace(/\|/g, ''))) continue
      if (!inTable) inTable = true
      tableRows.push(cells)
      continue
    }

    if (inTable) flushTable()

    const h4 = line.match(/^#### (.+)/)
    const h3 = line.match(/^### (.+)/)
    const h2 = line.match(/^## (.+)/)
    const h1 = line.match(/^# (.+)/)
    const bullet = line.match(/^[-*] (.+)/)

    if (h1) {
      closeList()
      out.push(`<h1>${inlineFormat(h1[1])}</h1>`)
    } else if (h2) {
      closeList()
      out.push(`<h2>${inlineFormat(h2[1])}</h2>`)
    } else if (h3) {
      closeList()
      out.push(`<h3>${inlineFormat(h3[1])}</h3>`)
    } else if (h4) {
      closeList()
      out.push(`<h4>${inlineFormat(h4[1])}</h4>`)
    } else if (bullet) {
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push(`<li>${inlineFormat(bullet[1])}</li>`)
    } else if (line === '') {
      closeList()
    } else {
      closeList()
      out.push(`<p>${inlineFormat(line)}</p>`)
    }
  }

  closeList()
  if (inTable) flushTable()

  return out.join('\n')
}

const PRINT_STYLES = `
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; max-width: 48rem; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.65; color: #0f172a; }
  h1 { font-size: 1.75rem; margin: 0 0 1rem; }
  h2 { font-size: 1.35rem; margin: 1.75rem 0 0.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.35rem; }
  h3 { font-size: 1.1rem; margin: 1.25rem 0 0.5rem; }
  h4 { font-size: 1rem; margin: 1rem 0 0.35rem; }
  p, li { font-size: 0.95rem; }
  ul { padding-left: 1.25rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
  th, td { border: 1px solid #cbd5e1; padding: 0.4rem 0.55rem; text-align: left; vertical-align: top; }
  th { background: #f1f5f9; }
  code { font-family: ui-monospace, monospace; font-size: 0.85em; background: #f1f5f9; padding: 0.1em 0.35em; border-radius: 0.25rem; }
  @media print { body { margin: 0; max-width: none; } }
`

export function wrapExportHtmlDocument({ title, bodyHtml }) {
  const safeTitle = escapeHtml(title)
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>${PRINT_STYLES}</style>
</head>
<body>
  <article>
    <h1>${safeTitle}</h1>
    ${bodyHtml}
  </article>
</body>
</html>`
}
