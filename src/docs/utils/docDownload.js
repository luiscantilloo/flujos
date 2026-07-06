import { markdownToPlainText } from './markdownToPlainText.js'
import { markdownToExportHtml, wrapExportHtmlDocument } from './markdownToExportHtml.js'
import { markdownToPdfLines } from './markdownToPdfText.js'

export function slugifyDocFilename(title) {
  return (
    String(title)
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 72) || 'documento'
  )
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadMarkdownFile({ title, markdown }) {
  const base = slugifyDocFilename(title)
  downloadBlob(markdown, `${base}.md`, 'text/markdown;charset=utf-8')
}

export function downloadTextFile({ title, text }) {
  const base = slugifyDocFilename(title)
  downloadBlob(text, `${base}.txt`, 'text/plain;charset=utf-8')
}

export function downloadHtmlFile({ title, markdown }) {
  const base = slugifyDocFilename(title)
  const bodyHtml = markdownToExportHtml(markdown)
  const html = wrapExportHtmlDocument({ title, bodyHtml })
  downloadBlob(html, `${base}.html`, 'text/html;charset=utf-8')
}

const PDF_LAYOUT = {
  marginX: 15,
  marginY: 18,
  lineHeight: 5.2,
  titleSize: 16,
  h2Size: 13,
  h3Size: 11.5,
  h4Size: 10.5,
  bodySize: 10,
  tableSize: 9,
}

function headingStyle(level) {
  if (level <= 1) return { size: PDF_LAYOUT.titleSize, style: 'bold', gapBefore: 4 }
  if (level === 2) return { size: PDF_LAYOUT.h2Size, style: 'bold', gapBefore: 6 }
  if (level === 3) return { size: PDF_LAYOUT.h3Size, style: 'bold', gapBefore: 4 }
  return { size: PDF_LAYOUT.h4Size, style: 'bold', gapBefore: 3 }
}

/** Descarga .pdf directamente (sin ventanas emergentes ni diálogo de impresión). */
export async function downloadPdfFile({ title, markdown }) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = pageWidth - PDF_LAYOUT.marginX * 2
  let y = PDF_LAYOUT.marginY

  const ensureSpace = (height) => {
    if (y + height > pageHeight - PDF_LAYOUT.marginY) {
      doc.addPage()
      y = PDF_LAYOUT.marginY
    }
  }

  const writeBlock = (text, { size, style = 'normal', gapBefore = 0 }) => {
    if (!text?.trim()) return
    y += gapBefore
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    const wrapped = doc.splitTextToSize(text, maxWidth)
    const blockHeight = wrapped.length * PDF_LAYOUT.lineHeight
    ensureSpace(blockHeight)
    doc.text(wrapped, PDF_LAYOUT.marginX, y)
    y += blockHeight + PDF_LAYOUT.lineHeight * 0.25
  }

  writeBlock(title, { size: PDF_LAYOUT.titleSize, style: 'bold', gapBefore: 0 })
  y += PDF_LAYOUT.lineHeight * 0.5

  for (const item of markdownToPdfLines(markdown)) {
    if (item.type === 'gap') {
      y += PDF_LAYOUT.lineHeight * 0.45
      continue
    }
    if (item.type === 'heading') {
      const h = headingStyle(item.level)
      writeBlock(item.text, h)
      continue
    }
    if (item.type === 'table-row') {
      writeBlock(item.text, { size: PDF_LAYOUT.tableSize, style: 'normal' })
      continue
    }
    if (item.type === 'bullet') {
      writeBlock(`• ${item.text}`, { size: PDF_LAYOUT.bodySize })
      continue
    }
    writeBlock(item.text, { size: PDF_LAYOUT.bodySize })
  }

  doc.save(`${slugifyDocFilename(title)}.pdf`)
}

/** Intenta descargar el .txt hermano en public/docs si existe. */
export async function fetchSiblingTxt(sourcePath) {
  if (!sourcePath?.endsWith('.md')) return null
  const txtPath = sourcePath.replace(/\.md$/, '.txt')
  try {
    const res = await fetch(txtPath, { method: 'HEAD' })
    if (!res.ok) return null
    const body = await fetch(txtPath).then((r) => (r.ok ? r.text() : null))
    return body
  } catch {
    return null
  }
}

export async function downloadTxtFromDoc({ title, markdown, sourcePath }) {
  const sibling = sourcePath ? await fetchSiblingTxt(sourcePath) : null
  downloadTextFile({ title, text: sibling ?? markdownToPlainText(markdown) })
}

export const DOC_DOWNLOAD_FORMATS = [
  {
    id: 'pdf',
    label: 'PDF',
    extension: '.pdf',
    hint: 'Misma apariencia que el lector (tema oscuro)',
    primary: true,
  },
  {
    id: 'md',
    label: 'Markdown',
    extension: '.md',
    hint: 'Texto con formato MD',
  },
  {
    id: 'txt',
    label: 'Texto plano',
    extension: '.txt',
    hint: 'Sin marcado, legible en cualquier editor',
  },
  {
    id: 'html',
    label: 'HTML',
    extension: '.html',
    hint: 'Página autocontenida para navegador',
  },
]

export async function runDocDownload(formatId, { title, markdown, sourcePath, contentElement }) {
  switch (formatId) {
    case 'md':
      downloadMarkdownFile({ title, markdown })
      break
    case 'txt':
      await downloadTxtFromDoc({ title, markdown, sourcePath })
      break
    case 'html':
      downloadHtmlFile({ title, markdown })
      break
    case 'pdf':
      if (contentElement) {
        const { downloadPdfFromElement } = await import('./downloadPdfFromElement.js')
        await downloadPdfFromElement({ title, element: contentElement })
      } else {
        await downloadPdfFile({ title, markdown })
      }
      break
    default:
      break
  }
}
