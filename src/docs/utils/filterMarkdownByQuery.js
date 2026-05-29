/**
 * Mantiene bloques separados por encabezados `##` que contienen la consulta.
 * Si la consulta es corta o vacía, devuelve el markdown completo.
 */
export function filterMarkdownByQuery(markdown, query) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return markdown

  const blocks = markdown.split(/\n(?=##\s)/)
  const kept = blocks.filter((block) => block.toLowerCase().includes(q))
  if (!kept.length) return `_Sin secciones que coincidan con “${query.trim()}”. Prueba otra palabra o borra el filtro._\n`
  return kept.join('\n')
}
