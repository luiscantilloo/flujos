import { useCallback, useState } from 'react'

let particleId = 0

/**
 * Partículas efímeras en pantalla (clic, aciertos, arrastre).
 * `iconKey`: clave de {@link FROST_ICONS} para partículas con icono.
 */
export function useFrostParticles() {
  const [particles, setParticles] = useState([])

  const burst = useCallback((x, y, options = {}) => {
    const {
      count = 14,
      colors = ['#67e8f9', '#a5f3fc', '#e0f2fe', '#c4b5fd', '#6ee7b7'],
      spread = 90,
      iconKey,
    } = options

    const batch = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8
      const velocity = 40 + Math.random() * spread
      return {
        id: ++particleId,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        iconKey: iconKey && Math.random() > 0.45 ? iconKey : null,
        life: 1,
      }
    })

    setParticles((prev) => [...prev, ...batch].slice(-120))

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !batch.some((b) => b.id === p.id)))
    }, 900)
  }, [])

  const burstFromElement = useCallback(
    (el, options) => {
      if (!el?.getBoundingClientRect) return
      const rect = el.getBoundingClientRect()
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, options)
    },
    [burst],
  )

  return { particles, burst, burstFromElement }
}
