import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import {
  buildFullArchitectureText,
  buildSelectedNodeText,
  DATABASE_ARCHITECTURE_SECTION,
  databaseTableToText,
  getDatabaseTableById,
  getDatabaseTables,
  sectionToText,
} from '../data/projectArchitecture.js'
import { buildErDiagramMermaid } from '../data/buildErDiagram.js'
import { CopyButton } from './architectureTreeUi.jsx'
import { DatabaseSection } from './DatabaseSection.jsx'

const VALID_DB_VIEWS = new Set(['tables', 'er'])
const section = DATABASE_ARCHITECTURE_SECTION

export function StackArchitecturePortal() {
  const [searchParams] = useSearchParams()
  const dbViewFromUrl = searchParams.get('dbView')
  const initialDbView = VALID_DB_VIEWS.has(dbViewFromUrl) ? dbViewFromUrl : 'tables'

  const [dbView, setDbView] = useState(initialDbView)
  const [selectedTableId, setSelectedTableId] = useState(() => getDatabaseTables().find((t) => t.id === 'rol')?.id ?? getDatabaseTables()[0]?.id ?? null)

  const selectedCopyText = useMemo(() => {
    if (!selectedTableId) return sectionToText(section)
    return buildSelectedNodeText(section, selectedTableId)
  }, [selectedTableId])

  const previewText = useMemo(() => {
    if (dbView === 'er') {
      return buildErDiagramMermaid({ viewId: 'rbac' })
    }
    return selectedCopyText
  }, [dbView, selectedCopyText])

  const selectTable = (id) => {
    setSelectedTableId((prev) => (prev === id ? null : id))
  }

  const onDbViewChange = (view) => {
    setDbView(view)
    const url = new URL(window.location.href)
    url.searchParams.set('dbView', view)
    url.searchParams.delete('tab')
    window.history.replaceState({}, '', url)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,rgba(56,189,248,0.1),transparent),radial-gradient(ellipse_50%_45%_at_90%_30%,rgba(52,211,153,0.08),transparent)]" />

      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
          <Link
            to={paths.home}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            Menú principal
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">Destacado</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">Arquitectura</h2>
              <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
                Modelo de datos V2.0: tablas 3NF, relaciones (ER), <code className="text-emerald-200/90">warehouse_state</code>{' '}
                y RLS por tenant. Las carpetas de código están en{' '}
                <Link to={paths.projectStructure} className="text-sky-400 hover:text-sky-300">
                  Estructura del proyecto
                </Link>
                .
              </p>
            </div>
            <CopyButton
              text={buildFullArchitectureText()}
              label="Copiar modelo completo"
              className="shrink-0 border-emerald-500/40 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25"
            />
          </div>

          <div className="mt-8">
            <DatabaseSection
              section={section}
              selectedTableId={selectedTableId}
              onSelectTable={selectTable}
              dbView={dbView}
              onDbViewChange={onDbViewChange}
            />
          </div>

          {dbView === 'tables' ? (
            <div className="mt-6 flex justify-end">
              <CopyButton
                text={
                  selectedTableId
                    ? databaseTableToText(getDatabaseTableById(selectedTableId))
                    : selectedCopyText
                }
                label="Copiar tabla seleccionada"
              />
            </div>
          ) : null}

          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Vista previa (texto)</h3>
              <CopyButton text={previewText} label="Copiar vista previa" className="!py-1.5 !text-xs" />
            </div>
            <pre className="app-scroll-panel mt-3 max-h-72 rounded-xl border border-slate-700/55 bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-emerald-100/90 whitespace-pre">
              {previewText}
            </pre>
          </section>
        </div>
      </div>
    </div>
  )
}
