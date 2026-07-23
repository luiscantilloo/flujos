import { useState } from 'react'
import {
  HiOutlineCircleStack,
  HiOutlineComputerDesktop,
  HiOutlineServerStack,
} from 'react-icons/hi2'
import { TbBrandNextjs, TbBrandReact, TbBrandTailwind } from 'react-icons/tb'
import { SiAxios, SiNestjs, SiPostgresql, SiSupabase, SiSwagger, SiTypescript, SiZod } from 'react-icons/si'

const LAYER_STYLE = {
  frontend: {
    icon: HiOutlineComputerDesktop,
    headerBg: 'border-sky-500/30 bg-sky-500/10',
    headerText: 'text-sky-200',
    border: 'border-sky-500/25',
    glow: 'from-sky-500/12',
  },
  backend: {
    icon: HiOutlineServerStack,
    headerBg: 'border-violet-500/30 bg-violet-500/10',
    headerText: 'text-violet-200',
    border: 'border-violet-500/25',
    glow: 'from-violet-500/12',
  },
  database: {
    icon: HiOutlineCircleStack,
    headerBg: 'border-emerald-500/30 bg-emerald-500/10',
    headerText: 'text-emerald-200',
    border: 'border-emerald-500/25',
    glow: 'from-emerald-500/12',
  },
}

import { POLARIA_WMS } from '../data/polariaWmsMeta.js'

/** Stack Polaria WMS (polaria-wms-web / polaria-wms-api). Dev Hub (flujo) usa Vite + React. */
export const TECH_STACK_LAYERS = [
  {
    id: 'frontend',
    label: 'Frontend',
    repo: `${POLARIA_WMS.repos.web.name}/`,
    items: [
      {
        name: 'Next.js',
        version: '16.2.x',
        role: 'App Router, shell dashboard, rutas por rol',
        icon: TbBrandNextjs,
        color: 'text-slate-100',
      },
      {
        name: 'React',
        version: '19',
        role: 'UI, módulos por dominio (purchases, configurator…)',
        icon: TbBrandReact,
        color: 'text-sky-300',
      },
      {
        name: 'TypeScript',
        version: '5',
        role: 'Tipado en componentes y servicios API',
        icon: SiTypescript,
        color: 'text-blue-400',
      },
      {
        name: 'Tailwind CSS',
        version: '4',
        role: 'Estilos utility-first',
        icon: TbBrandTailwind,
        color: 'text-cyan-300',
      },
      {
        name: 'Supabase JS',
        version: '2',
        role: '✅ Lecturas + Realtime (RLS); escrituras sensibles vía API',
        icon: SiSupabase,
        color: 'text-emerald-400',
      },
      {
        name: 'NEXT_PUBLIC_API_BASE_URL',
        version: '—',
        role: 'Cliente HTTP hacia polaria-wms-api',
        icon: TbBrandNextjs,
        color: 'text-slate-100',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    repo: `${POLARIA_WMS.repos.api.name}/`,
    items: [
      {
        name: 'NestJS',
        version: '11',
        role: '✅ auth, configuracion, purchases, integration; 🟡 inventory, sales…',
        icon: SiNestjs,
        color: 'text-rose-400',
      },
      {
        name: 'Prisma',
        version: '7',
        role: '40 modelos, DATABASE_URL + adapter-pg, bypass RLS en escrituras',
        icon: SiPostgresql,
        color: 'text-sky-300',
      },
      {
        name: 'Guards tenant',
        version: '—',
        role: 'JwtAuth, Tenant, Roles, SensitiveWrite (inventario/operaciones)',
        icon: SiZod,
        color: 'text-amber-300',
      },
      {
        name: 'Swagger',
        version: 'OpenAPI',
        role: 'GET /api/docs — contrato API',
        icon: SiSwagger,
        color: 'text-green-400',
      },
      {
        name: 'Mateo SSO',
        version: '—',
        role: '✅ mateo-handoff / mateo-exchange + widget-token',
        icon: SiAxios,
        color: 'text-violet-300',
      },
    ],
  },
  {
    id: 'database',
    label: 'Base de datos',
    repo: `${POLARIA_WMS.repos.db.name}/ · PostgreSQL`,
    items: [
      {
        name: 'Supabase',
        version: '2',
        role: 'Plataforma BaaS (Auth + Postgres + Realtime)',
        icon: SiSupabase,
        color: 'text-emerald-400',
      },
      {
        name: 'PostgreSQL',
        version: '15+',
        role: '40 tablas Prisma; RLS híbrido (lectura web / escritura API)',
        icon: SiPostgresql,
        color: 'text-sky-300',
      },
      {
        name: 'Migraciones',
        version: '001–052',
        role: 'RLS, compras, inventario, procesamiento, widget Mateo',
        icon: SiSupabase,
        color: 'text-emerald-300',
      },
      {
        name: 'Integraciones',
        version: '—',
        role: 'Mateo ✅ · n8n ✅ · Cloudinary ✅ · Fridem 🔵',
        icon: SiSupabase,
        color: 'text-teal-300',
      },
    ],
  },
]

function layerCopyText(layer) {
  const lines = [`${layer.label} (${layer.repo})`]
  for (const item of layer.items) {
    lines.push(`- ${item.name} v${item.version}: ${item.role}`)
  }
  return lines.join('\n')
}

function CopyButton({ text, label = 'Copiar capa' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-slate-600/50 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-sky-400/40 hover:text-sky-200"
    >
      {copied ? 'Copiado' : label}
    </button>
  )
}

export function TechStackLayers() {
  const fullCopy = TECH_STACK_LAYERS.map((l) => layerCopyText(l)).join('\n\n')

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Stack tecnológico</h3>
          <p className="mt-1 text-xs text-slate-500">
            Producto WMS · alineado con doc V2.0 §3 y flujo lectura/escritura §4
          </p>
        </div>
        <CopyButton text={fullCopy} label="Copiar stack completo" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {TECH_STACK_LAYERS.map((layer) => {
          const style = LAYER_STYLE[layer.id]
          const HeaderIcon = style.icon

          return (
            <article
              key={layer.id}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-slate-900/40 ${style.border}`}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.glow} to-transparent`} />

              <header
                className={`relative flex items-center gap-2 border-b border-slate-700/50 px-4 py-3 ${style.headerBg}`}
              >
                <HeaderIcon className={`h-5 w-5 shrink-0 ${style.headerText}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${style.headerText}`}>{layer.label}</p>
                  <p className="font-mono text-[10px] text-slate-500">{layer.repo}</p>
                </div>
                <CopyButton text={layerCopyText(layer)} />
              </header>

              <ul className="relative flex flex-col gap-2 p-3" role="list">
                {layer.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li
                      key={`${layer.id}-${item.name}`}
                      className="portal-card-hover flex items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-950/50 p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-600/40 bg-slate-900/80">
                        <Icon className={`h-4 w-4 ${item.color}`} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-100">
                          {item.name}
                          {item.version !== '—' ? (
                            <span className="font-normal text-slate-500"> v{item.version}</span>
                          ) : null}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{item.role}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
