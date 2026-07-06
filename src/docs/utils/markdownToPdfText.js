/** Líneas tipadas para render PDF (jsPDF). */
export function markdownToPdfLines(markdown) {
  const lines = []
  for (const raw of markdown.split('\n')) {
    const line = raw.trimEnd()
    if (!line) {
      lines.push({ type: 'gap' })
      continue
    }

    if (/^#{1,4}\s/.test(line)) {
      const level = line.match(/^(#+)/)[1].length
      lines.push({ type: 'heading', level, text: line.replace(/^#+\s+/, '').replace(/\*\*/g, '') })
      continue
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      if (/^[\s|:\-]+$/.test(line.replace(/\|/g, ''))) continue
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim().replace(/\*\*/g, ''))
      lines.push({ type: 'table-row', text: cells.join('  ·  ') })
      continue
    }

    if (/^[-*]\s/.test(line)) {
      lines.push({
        type: 'bullet',
        text: line
          .replace(/^[-*]\s+/, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/`([^`]+)`/g, '$1'),
      })
      continue
    }

    lines.push({
      type: 'paragraph',
      text: line
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^>\s?/, ''),
    })
  }
  return lines
}
