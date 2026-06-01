/** Oculta el HTML estático generado en build cuando la SPA ya montó (crawlers no ejecutan esto). */
export function removeStaticReadableFallback() {
  const el = document.getElementById('static-readable')
  if (!el) return
  el.classList.add('static-readable--hidden')
  window.setTimeout(() => el.remove(), 400)
}
