export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Conversión ligera MD → HTML para lectores sin JS (no sustituye react-markdown). */
export function markdownToHtml(markdown) {
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
      tableRows[i].forEach((cell) => out.push(`<td>${inlineFormat(cell)}</td>`))
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

function inlineFormat(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
