import { useState } from 'react'
import { HiArrowLeft, HiOutlineCommandLine, HiOutlineDocumentDuplicate } from 'react-icons/hi2'
import { TechStackLayers } from './TechStackLayers.jsx'

const SCRIPTS = [
  { cmd: 'npm run dev', desc: 'Dev Hub (este repo): servidor local Vite' },
  { cmd: 'npm run build', desc: 'Dev Hub: build de producción' },
  { cmd: 'npm run lint', desc: 'Dev Hub: validación estática' },
  { cmd: 'cd ../polaria-wms-web && npm test', desc: 'Frontend WMS: suite Vitest principal' },
  { cmd: 'cd ../polaria-wms-api && npm run test:e2e', desc: 'Backend WMS: e2e NestJS' },
  { cmd: 'cd ../polaria-wms-db && psql -f scripts/validate-mapa-pol141.sql', desc: 'DB: validación mapa/slots/stock' },
  { cmd: 'cd ../Widget-react && npm run build:lib', desc: 'Widget Mateo: generar script embebible' },
]

const INSTALL_STEPS = [
  'Clonar y mantener sincronizados los 5 repos del ecosistema (flujos + web + api + db + widget).',
  'Instalar dependencias por repo (`npm install`) y verificar Node 18+.',
  'Configurar variables de entorno de `polaria-wms-web`, `polaria-wms-api` y `Widget-react` (Supabase, Mateo, Cloudinary, n8n).',
  'Validar BD con scripts de `polaria-wms-db` y luego levantar apps locales.',
  'Levantar Dev Hub (`npm run dev`) para revisar documentación y flujos actualizados.',
]

const QUICK_LINKS = [
  { label: 'Arquitectura técnica actualizada', docId: 'bodega-frio-documentacion-v20', headingId: '3-arquitectura-actual-del-ecosistema-polaria' },
  { label: 'Variables de entorno (todos los repos)', docId: 'bodega-frio-v2', headingId: '4-variables-de-entorno-y-configuración' },
  { label: 'Referencia de testing consolidada', docId: 'bodega-frio-v2', headingId: '10-documentación-de-testing' },
  { label: 'Runbooks y operación', docId: 'bodega-frio-v2', headingId: '11-runbooks-de-operación-y-deployment' },
  { label: 'Manual de usuario por roles', docId: 'manual-usuario-polaria-wms', headingId: '2-mapa-de-roles-y-responsabilidades' },
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
          <button
            type="button"
            onClick={() => onBackToMain?.()}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            Menú principal
          </button>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/90">Herramientas</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Stack y scripts</h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
              Stack del <strong className="font-medium text-slate-300">producto WMS</strong> (Next + Nest +
              Supabase). Este repositorio <strong className="font-medium text-slate-300">flujos</strong> centraliza
              la documentación viva de los repos web, api, db y widget.
            </p>
          </div>

          <p className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            Esta sección mezcla comandos de <strong>Dev Hub</strong> y del ecosistema Polaria. Verifica siempre el
            repo objetivo antes de ejecutar cada script (web/api/db/widget).
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
                  <li key={link.headingId}>
                    <button
                      type="button"
                      onClick={() => onOpenDocSection?.(link.docId ?? 'bodega-frio-v2', link.headingId)}
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
