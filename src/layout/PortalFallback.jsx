export function PortalFallback({ label = 'contenido' }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-950 px-4 text-sm text-slate-400">
      Cargando {label}…
    </div>
  )
}
