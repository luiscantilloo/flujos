import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiOutlineCommandLine, HiOutlineDocumentDuplicate } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import { TechStackLayers } from './TechStackLayers.jsx'

const SCRIPTS = [
  { repo: 'flujo', cmd: 'npm run dev', desc: 'Dev Hub local (Vite, documentación y diagramas)' },
  { repo: 'flujo', cmd: 'npm run build', desc: 'Sincroniza schema, genera ER, compila Vite y HTML legible' },
  { repo: 'polaria-wms-web', cmd: 'npm run dev', desc: 'Next.js WMS en puerto 3001' },
  { repo: 'polaria-wms-web', cmd: 'npm test', desc: 'Vitest UI, guards, servicios y route handlers' },
  { repo: 'polaria-wms-api', cmd: 'npm run start:dev', desc: 'NestJS API con Swagger en /api/docs' },
  { repo: 'polaria-wms-api', cmd: 'npm test && npm run test:e2e', desc: 'Unitarios + e2e API' },
  { repo: 'polaria-wms-db', cmd: 'psql -f scripts/validate-rls-multitenant.sql', desc: 'Validación RLS multi-tenant' },
  { repo: 'Widget-react', cmd: 'npm run build:lib', desc: 'Genera dist/assets/mateo-widget.js embebible' },
]

const INSTALL_STEPS = [
  'Clonar los repos: flujo, polaria-wms-web, polaria-wms-api, polaria-wms-db y Widget-react',
  'Instalar dependencias en cada app Node con npm install',
  'Configurar env: NEXT_PUBLIC_* en web, SUPABASE_*/DATABASE_URL/MATEO_* en api, VITE_* en widget',
  'Levantar API Nest, luego web Next; usar flujo como Dev Hub/documentación',
]

const QUICK_LINKS = [
  { label: 'Documentación V2.0 actualizada', docId: 'bodega-frio-documentacion-v20' },
  { label: 'Manual de usuario por rol', docId: 'manual-usuario-polaria-wms' },
  { label: 'Referencia API viva', reference: 'api' },
  { label: 'Testing por repo', reference: 'testing' },
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
              Stack del <strong className="font-medium text-slate-300">producto WMS</strong> (Next + Nest +
              Supabase). Este repositorio <strong className="font-medium text-slate-300">flujo</strong> es el Dev
              Hub (Vite + React) para documentación y diagramas.
            </p>
          </div>

          <p className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            Comandos npm de abajo aplican al <strong>Dev Hub</strong> (<code className="font-mono text-amber-200">npm run dev</code>{' '}
            → Vite, puerto por defecto 5173). La app operativa vive en los repos frio.
          </p>

          <TechStackLayers />

          <section className="mt-10">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              <HiOutlineCommandLine className="h-4 w-4" aria-hidden />
              Comandos npm
            </h3>
            <ul className="mt-4 space-y-2" role="list">
              {SCRIPTS.map((s) => (
                <li
                  key={s.cmd}
                  className="flex flex-col gap-2 rounded-xl border border-slate-700/55 bg-slate-900/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.repo}</p>
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
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Instalación rápida</h3>
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
                    <button
                      type="button"
                      onClick={() => {
                        if (link.docId) onOpenDocSection?.(link.docId)
                        if (link.reference) window.location.href = paths.reference(link.reference, 'bodega-frio')
                      }}
                      className="portal-card-hover w-full rounded-xl border border-slate-700/55 bg-slate-900/40 px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:text-sky-200"
                    >
                      {link.label} →
                    </button>
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
