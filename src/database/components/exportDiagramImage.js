/** Escala de rasterización para PNG (3× ≈ ~288 DPI en pantallas 96 DPI). */
export const HD_EXPORT_SCALE = 3

const EXPORT_BG = '#020617'

/**
 * @param {SVGSVGElement} svg
 * @returns {{ width: number, height: number }}
 */
export function getExportSvgSize(svg) {
  const vb = svg.viewBox?.baseVal
  if (vb && vb.width > 0 && vb.height > 0) {
    return { width: vb.width, height: vb.height }
  }
  const w = Number.parseFloat(svg.getAttribute('width') ?? '')
  const h = Number.parseFloat(svg.getAttribute('height') ?? '')
  if (w > 0 && h > 0) return { width: w, height: h }
  const rect = svg.getBoundingClientRect()
  return { width: rect.width, height: rect.height }
}

/**
 * Clona el SVG con dimensiones explícitas para exportación fiel.
 * @param {SVGSVGElement} source
 */
function cloneSvgForExport(source) {
  const clone = source.cloneNode(true)
  const { width, height } = getExportSvgSize(source)
  if (width > 0 && height > 0) {
    clone.setAttribute('width', String(width))
    clone.setAttribute('height', String(height))
    if (!clone.getAttribute('viewBox')) {
      clone.setAttribute('viewBox', `0 0 ${width} ${height}`)
    }
  }
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.style.maxWidth = 'none'
  return clone
}

function triggerDownload(blob, filename) {
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

/**
 * Exporta el diagrama como SVG vectorial (sin pérdida).
 * @param {SVGSVGElement} svg
 * @param {string} filename
 */
export function exportSvgFile(svg, filename) {
  const clone = cloneSvgForExport(svg)
  const xml = new XMLSerializer().serializeToString(clone)
  const blob = new Blob(
    [`<?xml version="1.0" encoding="UTF-8"?>\n`, xml],
    { type: 'image/svg+xml;charset=utf-8' },
  )
  triggerDownload(blob, filename.endsWith('.svg') ? filename : `${filename}.svg`)
}

/**
 * Rasteriza el SVG a PNG en alta resolución.
 * @param {SVGSVGElement} svg
 * @param {string} filename
 * @param {number} [scale]
 */
export async function exportPngHd(svg, filename, scale = HD_EXPORT_SCALE) {
  const clone = cloneSvgForExport(svg)
  const { width, height } = getExportSvgSize(clone)
  if (!width || !height) {
    throw new Error('No se pudieron obtener las dimensiones del diagrama')
  }

  const xml = new XMLSerializer().serializeToString(clone)
  const svgUrl = URL.createObjectURL(
    new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }),
  )

  try {
    const img = await loadImage(svgUrl)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas no disponible')

    ctx.fillStyle = EXPORT_BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('No se pudo generar la imagen'))),
        'image/png',
      )
    })

    const base = filename.replace(/\.(png|svg)$/i, '')
    triggerDownload(blob, `${base}.png`)
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo cargar el SVG para exportar'))
    img.src = src
  })
}
