import { useCallback, useEffect, useRef, useState } from 'react'

export const MIN_SCALE = 0.05
export const MAX_SCALE = 6
export const ZOOM_STEP = 0.12

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function getSvgDimensions(svg) {
  const vb = svg.viewBox?.baseVal
  if (vb && vb.width > 0 && vb.height > 0) {
    return { width: vb.width, height: vb.height }
  }
  const attrW = Number.parseFloat(svg.getAttribute('width') ?? '')
  const attrH = Number.parseFloat(svg.getAttribute('height') ?? '')
  if (attrW > 0 && attrH > 0) return { width: attrW, height: attrH }
  const rect = svg.getBoundingClientRect()
  return { width: rect.width, height: rect.height }
}

export function prepareSvgForZoom(svg) {
  const { width, height } = getSvgDimensions(svg)
  if (width > 0 && height > 0) {
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
  }
  svg.style.maxWidth = 'none'
  svg.style.display = 'block'
  svg.style.pointerEvents = 'none'
}

/**
 * @param {Object} opts
 * @param {React.RefObject<HTMLElement|null>} opts.viewportRef
 * @param {() => SVGSVGElement|null|undefined} opts.getSvg
 * @param {boolean} [opts.enabled]
 */
export function useDiagramViewport({ viewportRef, getSvg, enabled = true }) {
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ active: false, startX: 0, startY: 0, panX: 0, panY: 0 })

  const fitToView = useCallback(() => {
    const viewport = viewportRef.current
    const svg = getSvg()
    if (!viewport || !svg) return false

    const vp = viewport.getBoundingClientRect()
    if (vp.width < 8 || vp.height < 8) return false

    const { width: sw, height: sh } = getSvgDimensions(svg)
    if (!sw || !sh) return false

    const padding = 32
    const fitScale = Math.min((vp.width - padding) / sw, (vp.height - padding) / sh)
    const nextScale = clamp(fitScale, MIN_SCALE, MAX_SCALE)
    setScale(nextScale)
    setPan({
      x: (vp.width - sw * nextScale) / 2,
      y: (vp.height - sh * nextScale) / 2,
    })
    return true
  }, [viewportRef, getSvg])

  const scheduleFitToView = useCallback(() => {
    requestAnimationFrame(() => {
      if (fitToView()) return
      requestAnimationFrame(() => fitToView())
    })
  }, [fitToView])

  const resetView = useCallback(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
    scheduleFitToView()
  }, [scheduleFitToView])

  const zoomTo100 = useCallback(() => {
    const viewport = viewportRef.current
    const svg = getSvg()
    if (!viewport || !svg) {
      setScale(1)
      return
    }
    const vp = viewport.getBoundingClientRect()
    const { width: sw, height: sh } = getSvgDimensions(svg)
    setScale(1)
    setPan({
      x: (vp.width - sw) / 2,
      y: (vp.height - sh) / 2,
    })
  }, [viewportRef, getSvg])

  const zoomIn = useCallback(() => {
    setScale((s) => clamp(s + ZOOM_STEP, MIN_SCALE, MAX_SCALE))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((s) => clamp(s - ZOOM_STEP, MIN_SCALE, MAX_SCALE))
  }, [])

  const zoomAtClientPoint = useCallback(
    (clientX, clientY, deltaScale) => {
      const viewport = viewportRef.current
      if (!viewport) return
      const rect = viewport.getBoundingClientRect()
      const mx = clientX - rect.left
      const my = clientY - rect.top

      setScale((prevScale) => {
        const nextScale = clamp(prevScale + deltaScale, MIN_SCALE, MAX_SCALE)
        const ratio = nextScale / prevScale
        setPan((prevPan) => ({
          x: mx - (mx - prevPan.x) * ratio,
          y: my - (my - prevPan.y) * ratio,
        }))
        return nextScale
      })
    },
    [viewportRef],
  )

  const panBy = useCallback((dx, dy) => {
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }))
  }, [])

  const handleWheel = useCallback(
    (e) => {
      if (!enabled) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      zoomAtClientPoint(e.clientX, e.clientY, delta)
    },
    [enabled, zoomAtClientPoint],
  )

  const onPointerDown = useCallback(
    (e) => {
      if (!enabled || e.button !== 0) return
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      }
      setIsDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [enabled, pan.x, pan.y],
  )

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.active) return
    setPan({
      x: dragRef.current.panX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.panY + (e.clientY - dragRef.current.startY),
    })
  }, [])

  const onPointerUp = useCallback((e) => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setIsDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])

  return {
    scale,
    pan,
    isDragging,
    fitToView,
    scheduleFitToView,
    resetView,
    zoomTo100,
    zoomIn,
    zoomOut,
    panBy,
    handleWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    setScale,
    setPan,
  }
}

/**
 * Atajos: Escape, +/-, 0 ajustar, 1 al 100%, flechas pan, R reiniciar.
 */
export function useDiagramViewportKeyboard(viewport, { active, onExit }) {
  useEffect(() => {
    if (!active) return

    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onExit?.()
        return
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        viewport.zoomIn()
        return
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        viewport.zoomOut()
        return
      }
      if (e.key === '0') {
        e.preventDefault()
        viewport.fitToView()
        return
      }
      if (e.key === '1') {
        e.preventDefault()
        viewport.zoomTo100()
        return
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        viewport.resetView()
        return
      }
      const step = e.shiftKey ? 80 : 40
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        viewport.panBy(step, 0)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        viewport.panBy(-step, 0)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        viewport.panBy(0, step)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        viewport.panBy(0, -step)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onExit, viewport])
}
