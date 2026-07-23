import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiOutlineCommandLine, HiOutlineDocumentDuplicate } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import { POLARIA_WMS } from '../data/polariaWmsMeta.js'
import { TechStackLayers } from './TechStackLayers.jsx'

const SCRIPTS = [
  { cmd: 'npm run dev', desc: 'Dev Hub local (Vite, puerto 5173)' },
  { cmd: 'npm run build', desc: 'Build producción Dev Hub' },
  { cmd: 'npm run docs:all', desc: 'Regenera MD Bodega v1.0 y V2.0 desde .txt' },
  { cmd: 'npm run docs:sync-schema', desc: 'Sincroniza entidades Prisma → Dev Hub' },
  { cmd: 'npm run lint', desc: 'ESLint en todo el proyecto flujos' },
]

const PRODUCT_REPOS = [
  {
    name: POLARIA_WMS.repos.web.name,
    url: POLARIA_WMS.repos.web.url,
    dev: 'npm run dev → http://localhost:3001',
    role: POLARIA_WMS.repos.web.role,
  },
  {
    name: POLARIA_WMS.repos.api.name,
    url: POLARIA_WMS.repos.api.url,
    dev: 'npm run start:dev → http://localhost:3000',
    role: POLARIA_WMS.repos.api.role,
  },
  {
    name: POLARIA_WMS.repos.db.name,
    url: POLARIA_WMS.repos.db.url,
    dev: 'supabase db push / scripts SQL',
    role: POLARIA_WMS.repos.db.role,
  },
  {
    name: POLARIA_WMS.repos.widget.name,
    url: POLARIA_WMS.repos.widget.url,
    dev: 'npm run dev → http://localhost:5173 · build:lib → mateo-widget.js',
    role: POLARIA_WMS.repos.widget.role,
  },
]

const INSTALL_STEPS = [
  'Clonar polaria-wms-api, polaria-wms-web, polaria-wms-db y Widget-react',
  'Configurar Supabase (migraciones 001–052 desde polaria-wms-db)',
  'API: copiar .env con DATABASE_URL, SUPABASE_*, MATEO_*',
  'Web: .env con NEXT_PUBLIC_API_URL y NEXT_PUBLIC_SUPABASE_*',
  'Widget: VITE_N8N_WEBHOOK_URL y Cloudinary para imágenes',
  'Dev Hub (este repo): npm install && npm run dev → http://localhost:5173',
]

const QUICK_LINKS = [
  { label: 'Manual de usuario', to: paths.userManual },
  { label: 'API y endpoints', to: paths.reference('api', 'bodega-frio') },
  { label: 'Testing', to: paths.reference('testing', 'bodega-frio') },
  { label: 'Documentación V2.0', to: paths.doc('bodega-frio-documentacion-v20') },
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-lg border border-slate-600/50 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-sky-400/40 hover:text-sky-200"
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

export function DevResourcesPortal({ onBackToMain, onOpenDocSection }) {
  void onBackToMain
  void onOpenDocSection

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,rgba(56,189,248,0.14),transparent),radial-gradient(ellipse_50%_40%_at_100%_80%,rgba(139,92,246,0.1),transparent)]" />

      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          <Link
            to={paths.home}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            Menú principal
          </Link>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/90">Herramientas</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Stack y scripts</h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
              Ecosistema <strong className="font-medium text-slate-300">Polaria WMS</strong> (4 repos producto + este Dev
              Hub). Estado sincronizado Jul 2026.
            </p>
          </div>

          <section className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Repositorios producto</h3>
            <ul className="mt-4 space-y-3" role="list">
              {PRODUCT_REPOS.map((repo) => (
                <li
                  key={repo.name}
                  className="rounded-xl border border-slate-700/55 bg-slate-900/40 px-4 py-3"
                >
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-sky-300 hover:text-sky-200"
                  >
                    {repo.name}
                  </a>
                  <p className="mt-1 text-xs text-slate-400">{repo.role}</p>
                  <p className="mt-1 font-mono text-[11px] text-emerald-200/90">{repo.dev}</p>
                </li>
              ))}
            </ul>
          </section>

          <TechStackLayers />

          <section className="mt-10">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              <HiOutlineCommandLine className="h-4 w-4" aria-hidden />
              Comandos npm (Dev Hub — repo flujos)
            </h3>
            <ul className="mt-4 space-y-2" role="list">
              {SCRIPTS.map((s) => (
                <li
                  key={s.cmd}
                  className="flex flex-col gap-2 rounded-xl border border-slate-700/55 bg-slate-900/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <code className="font-mono text-sm text-emerald-200/95">{s.cmd}</code>
                    <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
                  </div>
                  <CopyButton text={s.cmd} />
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Instalación ecosistema</h3>
              <ol className="mt-4 space-y-2" role="list">
                {INSTALL_STEPS.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 rounded-xl border border-slate-700/55 bg-slate-900/40 px-4 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-xs font-bold text-sky-200">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                <HiOutlineDocumentDuplicate className="h-4 w-4" aria-hidden />
                Enlaces rápidos
              </h3>
              <ul className="mt-4 space-y-2" role="list">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="portal-card-hover block w-full rounded-xl border border-slate-700/55 bg-slate-900/40 px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:text-sky-200"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
