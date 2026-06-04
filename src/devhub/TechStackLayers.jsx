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

/** Stack del producto WMS (frio-frontend / frio-backend). El Dev Hub (flujo) usa Vite + React. */
export const TECH_STACK_LAYERS = [
  {
    id: 'frontend',
    label: 'Frontend',
    repo: 'frio-frontend/',
    items: [
      {
        name: 'Next.js',
        version: '16',
        role: 'App Router, layouts, rutas por rol',
        icon: TbBrandNextjs,
        color: 'text-slate-100',
      },
      {
        name: 'React',
        version: '19',
        role: 'UI, estado del cliente, formularios',
        icon: TbBrandReact,
        color: 'text-sky-300',
      },
      {
        name: 'TypeScript',
        version: '5+',
        role: 'Tipado en componentes y servicios',
        icon: SiTypescript,
        color: 'text-blue-400',
      },
      {
        name: 'Tailwind CSS',
        version: '4',
        role: 'Estilos utility-first y tokens',
        icon: TbBrandTailwind,
        color: 'text-cyan-300',
      },
      {
        name: 'Supabase JS',
        version: '2',
        role: 'Cliente browser: Auth, lectura y Realtime (RLS por tenant)',
        icon: SiSupabase,
        color: 'text-emerald-400',
      },
      {
        name: 'Route Handlers',
        version: '16',
        role: 'app/api/: pedido proveedor (n8n), evidencia (Cloudinary)',
        icon: TbBrandNextjs,
        color: 'text-slate-100',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    repo: 'frio-backend/',
    items: [
      {
        name: 'NestJS',
        version: '10+',
        role: 'API REST: ingreso, inventario, ventas, procesamiento, configuración',
        icon: SiNestjs,
        color: 'text-rose-400',
      },
      {
        name: 'TypeScript',
        version: '5+',
        role: 'DTOs, pipes, guards, interceptors (Strip) y servicios',
        icon: SiTypescript,
        color: 'text-blue-400',
      },
      {
        name: 'Supabase Admin SDK',
        version: '2',
        role: 'Escrituras server-side, saveWarehouseState, locking',
        icon: SiSupabase,
        color: 'text-emerald-400',
      },
      {
        name: 'Class-Validator · Zod',
        version: '—',
        role: 'Validación de token, tenant, rol y payloads',
        icon: SiZod,
        color: 'text-amber-300',
      },
      {
        name: 'Swagger',
        version: 'OpenAPI',
        role: 'Contrato y prueba de endpoints (/ingreso, /procesar)',
        icon: SiSwagger,
        color: 'text-green-400',
      },
      {
        name: 'Axios',
        version: 'HttpModule',
        role: 'Webhooks n8n: pedidos y alertas',
        icon: SiAxios,
        color: 'text-violet-300',
      },
    ],
  },
  {
    id: 'database',
    label: 'Base de datos',
    repo: 'supabase · PostgreSQL',
    items: [
      {
        name: 'Supabase',
        version: '2',
        role: 'Plataforma BaaS (proyecto principal)',
        icon: SiSupabase,
        color: 'text-emerald-400',
      },
      {
        name: 'PostgreSQL',
        version: '15+',
        role: 'Tablas 3NF; RLS por codigo_cuenta (tenant); empresa → cuenta',
        icon: SiPostgresql,
        color: 'text-sky-300',
      },
      {
        name: 'Supabase Auth',
        version: '—',
        role: 'JWT, sesiones, roles operativos',
        icon: SiSupabase,
        color: 'text-emerald-300',
      },
      {
        name: 'Realtime + Storage',
        version: '—',
        role: 'warehouse_state en vivo, evidencias opcionales',
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
