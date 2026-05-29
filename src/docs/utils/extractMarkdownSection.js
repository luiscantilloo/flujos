/**
 * Extrae el cuerpo de una sección MD hasta el siguiente encabezado del mismo nivel o superior.
 */
export function extractSectionByTitle(markdown, titlePattern) {
  const lines = markdown.split('\n')
  let start = -1
  let level = 0

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{2,4})\s+(.+)/)
    if (!match) continue
    if (titlePattern.test(match[2])) {
      start = i + 1
      level = match[1].length
      break
    }
  }

  if (start === -1) return ''

  const out = []
  for (let i = start; i < lines.length; i++) {
    const match = lines[i].match(/^(#{2,4})\s+/)
    if (match && match[1].length <= level) break
    out.push(lines[i])
  }

  return out.join('\n').trim()
}

export function parseMarkdownTableFromText(sectionText) {
  const lines = sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'))

  if (lines.length < 2) return { headers: [], rows: [] }

  const parseRow = (line) =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim().replace(/\*\*/g, ''))

  const headers = parseRow(lines[0])
  const rows = lines
    .slice(2)
    .map(parseRow)
    .filter((row) => row.length === headers.length)

  return { headers, rows }
}
