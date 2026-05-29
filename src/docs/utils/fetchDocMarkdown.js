export async function fetchDocMarkdown(filePath) {
  const res = await fetch(filePath)
  if (!res.ok) throw new Error(`No se pudo cargar (${res.status})`)
  return res.text()
}
