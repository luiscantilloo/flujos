/** Convierte markdown a texto plano legible (exportación .txt). */
export function markdownToPlainText(markdown) {
  if (!markdown) return ''

  let text = markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^\|(.+)\|$/gm, (_, row) =>
      row
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)
        .join('\t'),
    )
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, (m) => m)
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```\w*\n?/g, '').replace(/```/g, ''))
    .replace(/\n{3,}/g, '\n\n')

  return text.trim()
}
