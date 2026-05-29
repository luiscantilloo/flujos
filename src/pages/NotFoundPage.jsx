import { Link } from 'react-router-dom'
import { paths } from '../router/paths.js'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center">
      <p className="text-6xl font-bold text-slate-700">404</p>
      <p className="text-lg text-slate-300">Ruta no encontrada</p>
      <p className="max-w-sm text-sm text-slate-500">
        La URL no corresponde a ninguna sección del Dev Hub.
      </p>
      <Link
        to={paths.home}
        className="rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-5 py-2.5 text-sm font-medium text-cyan-100 hover:bg-cyan-900/50"
      >
        Volver al menú principal
      </Link>
    </div>
  )
}
