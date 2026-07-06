const UNSAFE_COLOR_RE = /\b(?:oklab|oklch|lab|lch|color-mix)\(/i

const SKIP_INLINE_PROPS = new Set([
  'transition',
  'transition-property',
  'transition-duration',
  'transition-timing-function',
  'transition-delay',
  'animation',
  'animation-name',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
  'animation-iteration-count',
  'animation-direction',
  'animation-fill-mode',
  'animation-play-state',
  'caret-color',
  'pointer-events',
  'cursor',
  'touch-action',
  'user-select',
  '-webkit-user-select',
  'will-change',
  'content',
])

const COLOR_LIKE_PROPS = new Set([
  'color',
  'background',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'column-rule-color',
  'fill',
  'stroke',
  '-webkit-text-fill-color',
  '-webkit-text-stroke-color',
])

/** Ancho A4 a 96 dpi — el PDF usará el ancho completo sin márgenes blancos. */
const PDF_PAGE_WIDTH_PX = 794
const PDF_BG = { r: 15, g: 23, b: 42 }
const SLICE_HEIGHT_PX = 2800
const CAPTURE_SCALE = 1.35
const JPEG_QUALITY = 0.92
const EXPORT_TIMEOUT_MS = 180_000

function toCanvasSafeColor(value) {
  if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') return value
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return value
  try {
    ctx.fillStyle = value
    return ctx.fillStyle
  } catch {
    return value
  }
}

function isUnsafeCssValue(value) {
  return typeof value === 'string' && UNSAFE_COLOR_RE.test(value)
}

function safeCSSValue(prop, value) {
  if (!value) return value

  if (prop === 'box-shadow' || prop === 'text-shadow' || prop === 'filter' || prop === 'backdrop-filter') {
    return 'none'
  }

  if (isUnsafeCssValue(value)) {
    if (COLOR_LIKE_PROPS.has(prop) || prop.includes('color')) {
      return toCanvasSafeColor(value) || 'transparent'
    }
    if (prop === 'background-image' && value.includes('gradient')) return 'none'
    if (prop === 'background' && value.includes('gradient')) return 'none'
    return ''
  }

  if (COLOR_LIKE_PROPS.has(prop)) {
    return toCanvasSafeColor(value) || value
  }

  return value
}

function slugify(title) {
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

function inlineComputedStyles(sourceRoot, cloneRoot) {
  const sourceNodes = [sourceRoot, ...sourceRoot.querySelectorAll('*')]
  const cloneNodes = [cloneRoot, ...cloneRoot.querySelectorAll('*')]

  const len = Math.min(sourceNodes.length, cloneNodes.length)
  for (let i = 0; i < len; i++) {
    const sourceEl = sourceNodes[i]
    const cloneEl = cloneNodes[i]
    if (!(sourceEl instanceof Element) || !(cloneEl instanceof Element)) continue

    const computed = getComputedStyle(sourceEl)
    const parts = []

    for (let j = 0; j < computed.length; j++) {
      const prop = computed[j]
      if (SKIP_INLINE_PROPS.has(prop)) continue

      let value = computed.getPropertyValue(prop)
      value = safeCSSValue(prop, value)
      if (!value) continue
      parts.push(`${prop}:${value}`)
    }

    cloneEl.setAttribute('style', parts.join(';'))
    cloneEl.removeAttribute('class')
  }
}

function stripStylesheetsInClone(clonedDoc, clonedRoot) {
  clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => node.remove())

  const nodes = [clonedRoot, ...clonedRoot.querySelectorAll('*')]
  for (const el of nodes) {
    if (!(el instanceof clonedDoc.defaultView.Element)) continue
    el.removeAttribute('class')

    if (el instanceof clonedDoc.defaultView.SVGElement) {
      const cs = clonedDoc.defaultView.getComputedStyle(el)
      el.setAttribute('fill', toCanvasSafeColor(cs.fill) || 'currentColor')
      el.setAttribute('stroke', toCanvasSafeColor(cs.stroke) || 'none')
    }
  }
}

function prepareCloneForCapture(root) {
  root.style.setProperty('background', '#0f172a', 'important')
  root.style.setProperty('color', '#e2e8f0', 'important')
  root.style.setProperty('overflow', 'visible', 'important')
  root.style.setProperty('border', 'none', 'important')
  root.style.setProperty('border-radius', '0', 'important')
  root.style.setProperty('width', `${PDF_PAGE_WIDTH_PX}px`, 'important')
  root.style.setProperty('max-width', `${PDF_PAGE_WIDTH_PX}px`, 'important')
  root.style.setProperty('box-shadow', 'none', 'important')

  root.querySelectorAll('[class*="blur"]').forEach((node) => node.remove())

  root.querySelectorAll('.doc-content').forEach((el) => {
    el.style.setProperty('padding-bottom', '48px', 'important')
  })

  // Títulos con bg-clip-text / text-transparent no se ven en canvas — forzar color sólido
  root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    el.style.setProperty('color', '#f8fafc', 'important')
    el.style.setProperty('-webkit-text-fill-color', '#f8fafc', 'important')
    el.style.setProperty('background', 'none', 'important')
    el.style.setProperty('-webkit-background-clip', 'border-box', 'important')
    el.style.setProperty('background-clip', 'border-box', 'important')
    el.style.setProperty('opacity', '1', 'important')
    el.style.setProperty('visibility', 'visible', 'important')
  })
}

function mountStagingClone(source) {
  const staging = document.createElement('div')
  staging.setAttribute('data-pdf-staging', 'true')
  staging.setAttribute(
    'style',
    [
      'position:fixed',
      'left:-14000px',
      'top:0',
      `width:${PDF_PAGE_WIDTH_PX}px`,
      'z-index:1',
      'overflow:visible',
      'background:#0f172a',
    ].join(';'),
  )

  const clone = source.cloneNode(true)
  staging.appendChild(clone)
  document.body.appendChild(staging)

  inlineComputedStyles(source, clone)
  prepareCloneForCapture(clone)

  return { staging, clone }
}

function fillPageBackground(pdf, pageWidth, pageHeight) {
  pdf.setFillColor(PDF_BG.r, PDF_BG.g, PDF_BG.b)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
}

function cropCanvas(source, sx, sy, sw, sh) {
  const out = document.createElement('canvas')
  out.width = Math.max(1, Math.ceil(sw))
  out.height = Math.max(1, Math.ceil(sh))
  const ctx = out.getContext('2d')
  if (!ctx) throw new Error('No se pudo preparar la página del PDF.')
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, out.width, out.height)
  return out
}

const MIN_SLICE_PX = 12

/**
 * Bloques que no deben cortarse entre páginas (coordenadas en px del canvas).
 */
function buildKeepTogetherRanges(root, scale, pageHeightPt, pageWidthPt) {
  const pxPerPt = (PDF_PAGE_WIDTH_PX * scale) / pageWidthPt
  const pageHeightCanvasPx = pageHeightPt * pxPerPt
  const maxBlockPx = pageHeightCanvasPx * 0.9
  const rootRect = root.getBoundingClientRect()
  const ranges = []
  const seen = new WeakSet()

  const toRange = (el) => {
    const rect = el.getBoundingClientRect()
    return {
      top: (rect.top - rootRect.top) * scale,
      bottom: (rect.bottom - rootRect.top) * scale,
    }
  }

  const pushRange = (top, bottom) => {
    const height = bottom - top
    if (height < 6 || height > maxBlockPx) return
    ranges.push({ top, bottom })
  }

  const mark = (el, top, bottom) => {
    if (el) seen.add(el)
    pushRange(top, bottom)
  }

  // h3/h4 + tabla inmediata (ej. "Frontend" / "Backend")
  root.querySelectorAll('h3, h4').forEach((heading) => {
    let next = heading.nextElementSibling
    while (next && next.tagName === 'P' && !next.textContent.trim()) {
      next = next.nextElementSibling
    }
    const table = next?.querySelector?.('table')
    if (table) {
      let tableWrap = table.parentElement
      if (tableWrap?.parentElement?.contains(table)) {
        const outer = tableWrap.parentElement
        if (outer?.querySelector('table') === table) tableWrap = outer
      }
      const h = toRange(heading)
      const t = toRange(tableWrap)
      mark(heading, h.top, t.bottom)
      mark(tableWrap, h.top, t.bottom)
      return
    }
    if (!seen.has(heading)) {
      const r = toRange(heading)
      mark(heading, r.top, r.bottom)
    }
  })

  root.querySelectorAll('h2').forEach((h2) => {
    const wrap = h2.parentElement?.parentElement ?? h2.parentElement ?? h2
    if (seen.has(wrap)) return
    const r = toRange(wrap)
    mark(wrap, r.top, r.bottom)
  })

  root.querySelectorAll('h1').forEach((h1) => {
    const wrap = h1.parentElement ?? h1
    if (seen.has(wrap)) return
    const r = toRange(wrap)
    mark(wrap, r.top, r.bottom)
  })

  root.querySelectorAll('table').forEach((table) => {
    let wrap = table.parentElement?.parentElement ?? table.parentElement ?? table
    if (seen.has(wrap)) return
    const r = toRange(wrap)
    mark(wrap, r.top, r.bottom)
  })

  root.querySelectorAll('pre, aside').forEach((el) => {
    if (seen.has(el)) return
    const r = toRange(el)
    mark(el, r.top, r.bottom)
  })

  // Callouts (nota, referencia) — div con borde redondeado, sin tabla dentro
  root.querySelectorAll('div').forEach((div) => {
    if (seen.has(div) || div.querySelector('table')) return
    const style = div.getAttribute('style') ?? ''
    if (!style.includes('border-radius') || !style.includes('border')) return
    if (div.closest('table')) return
    const r = toRange(div)
    if (r.bottom - r.top < 48) return
    mark(div, r.top, r.bottom)
  })

  return ranges.sort((a, b) => a.top - b.top)
}

/**
 * Calcula cuánto contenido tomar sin cortar bloques protegidos.
 * Nunca salta a un bloque lejano (evita páginas casi vacías).
 */
function computeTakePx(currentY, roomPx, stripRemaining, pageHeightCanvasPx, keepRanges) {
  let takePx = Math.min(roomPx, stripRemaining)
  const breakY = currentY + takePx

  for (const block of keepRanges) {
    const cutsInterior = breakY > block.top + 2 && breakY < block.bottom - 2
    const startsHere = currentY >= block.top - 2 && currentY < block.bottom - 2
    const blockBeforeBreak = currentY < block.top - 2 && breakY > block.top + 2

    if (!cutsInterior && !startsHere && !blockBeforeBreak) continue

    const blockH = block.bottom - block.top

    if (currentY < block.top - 2) {
      const gap = block.top - currentY
      if (gap >= roomPx - 2) {
        // El bloque está en otra página — no acortar ni estirar este trozo
        continue
      }
      if (blockH <= roomPx - gap) {
        takePx = Math.min(gap + blockH, roomPx, stripRemaining)
      } else if (gap > MIN_SLICE_PX) {
        takePx = Math.min(gap, stripRemaining)
      } else {
        takePx = blockH > pageHeightCanvasPx * 0.88 ? Math.min(roomPx, stripRemaining) : 0
      }
      return takePx
    }

    // Dentro del bloque
    if (blockH > pageHeightCanvasPx * 0.88) {
      return Math.min(roomPx, stripRemaining)
    }
    return Math.min(block.bottom - currentY, roomPx, stripRemaining)
  }

  return takePx
}

function needsFreshPageForBlock(currentY, roomPx, keepRanges) {
  return keepRanges.find(
    (b) =>
      Math.abs(b.top - currentY) < 6 &&
      b.bottom - b.top > roomPx + 4 &&
      b.bottom - b.top < roomPx * 2.5,
  )
}

/**
 * Paginador continuo con saltos inteligentes (sin cortar títulos/tablas).
 */
function createPdfPaginator(pdf, pageWidth, pageHeight, keepRanges) {
  let pageIndex = 0
  let usedPt = 0
  let pageStartGlobalY = 0
  let globalCanvasY = 0

  const newPage = () => {
    if (pageIndex > 0) pdf.addPage()
    fillPageBackground(pdf, pageWidth, pageHeight)
    usedPt = 0
    pageStartGlobalY = globalCanvasY
    pageIndex += 1
  }

  newPage()

  return {
    addStrip(stripCanvas, stripBaseGlobalY) {
      const pxPerPt = stripCanvas.width / pageWidth
      const pageHeightCanvasPx = pageHeight * pxPerPt
      let stripOffsetPx = 0

      while (stripOffsetPx < stripCanvas.height) {
        const roomPt = pageHeight - usedPt
        if (roomPt <= 0.5) {
          newPage()
          continue
        }

        const roomPx = roomPt * pxPerPt
        const currentGlobalY = stripBaseGlobalY + stripOffsetPx

        const freshPageBlock = needsFreshPageForBlock(currentGlobalY, roomPx, keepRanges)
        if (freshPageBlock && usedPt > 10) {
          newPage()
          continue
        }

        let takePx = computeTakePx(
          currentGlobalY,
          roomPx,
          stripCanvas.height - stripOffsetPx,
          pageHeightCanvasPx,
          keepRanges,
        )

        if (takePx < MIN_SLICE_PX) {
          if (usedPt > 10) {
            newPage()
            continue
          }
          takePx = Math.min(roomPx, stripCanvas.height - stripOffsetPx)
        }

        takePx = Math.min(takePx, roomPx, stripCanvas.height - stripOffsetPx)

        const takePt = takePx / pxPerPt
        const slice = cropCanvas(stripCanvas, 0, stripOffsetPx, stripCanvas.width, takePx)
        pdf.addImage(
          slice.toDataURL('image/jpeg', JPEG_QUALITY),
          'JPEG',
          0,
          usedPt,
          pageWidth,
          takePt,
        )

        usedPt += takePt
        stripOffsetPx += takePx
        globalCanvasY += takePx

        if (usedPt >= pageHeight - 0.25 && stripOffsetPx < stripCanvas.height) {
          newPage()
        }
      }
    },
  }
}

export async function downloadPdfFromElement({ title, element }) {
  if (!element) {
    throw new Error('No hay contenido renderizado para exportar.')
  }

  const exportTask = async () => {
    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ])

    const source = element
    const { staging, clone } = mountStagingClone(source)

    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const totalHeight = clone.scrollHeight

      if (totalHeight <= 0) {
        throw new Error('El documento no tiene contenido visible para exportar.')
      }

      const keepRanges = buildKeepTogetherRanges(clone, CAPTURE_SCALE, pageHeight, pageWidth)
      const paginator = createPdfPaginator(pdf, pageWidth, pageHeight, keepRanges)

      for (let sliceY = 0; sliceY < totalHeight; sliceY += SLICE_HEIGHT_PX) {
        const sliceH = Math.min(SLICE_HEIGHT_PX, totalHeight - sliceY)
        const stripBaseGlobalY = sliceY * CAPTURE_SCALE

        const canvas = await html2canvas(clone, {
          scale: CAPTURE_SCALE,
          backgroundColor: '#0f172a',
          useCORS: true,
          allowTaint: true,
          logging: false,
          foreignObjectRendering: false,
          y: sliceY,
          height: sliceH,
          width: clone.scrollWidth,
          windowWidth: clone.scrollWidth,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc, clonedEl) => {
            stripStylesheetsInClone(clonedDoc, clonedEl)
          },
        })

        if (!canvas.width || !canvas.height) {
          throw new Error('No se pudo rasterizar el diseño del documento.')
        }

        paginator.addStrip(canvas, stripBaseGlobalY)
      }

      pdf.save(`${slugify(title)}.pdf`)
    } finally {
      staging.remove()
    }
  }

  const timeout = new Promise((_, reject) => {
    window.setTimeout(
      () => reject(new Error('La exportación PDF tardó demasiado. Intenta de nuevo.')),
      EXPORT_TIMEOUT_MS,
    )
  })

  await Promise.race([exportTask(), timeout])
}
