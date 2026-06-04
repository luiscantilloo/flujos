import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import {
  buildFullProjectStructureText,
  buildSelectedNodeText,
  collectNodeIds,
  findNode,
  getSectionTree,
  PROJECT_STRUCTURE_SECTIONS,
  sectionToText,
} from '../data/projectArchitecture.js'
import {
  buildInitialExpandedByStructureSection,
  CopyButton,
  StructureTreePanel,
} from './architectureTreeUi.jsx'

const TAB_STYLES = {
  sky: 'border-sky-500/50 bg-sky-500/15 text-sky-200',
  violet: 'border-violet-500/50 bg-violet-500/15 text-violet-200',
}

const VALID_TABS = new Set(['frontend', 'backend'])

export function ProjectStructurePortal({ initialTab = 'frontend' }) {
  const [activeTab, setActiveTab] = useState(VALID_TABS.has(initialTab) ? initialTab : 'frontend')
  const [selectedByTab, setSelectedByTab] = useState({ frontend: null, backend: null })
  const [expandedByTab, setExpandedByTab] = useState(() =>
    buildInitialExpandedByStructureSection(PROJECT_STRUCTURE_SECTIONS, 2),
  )

  const section = PROJECT_STRUCTURE_SECTIONS.find((s) => s.id === activeTab) ?? PROJECT_STRUCTURE_SECTIONS[0]
  const selectedId = selectedByTab[activeTab]
  const expanded = expandedByTab[activeTab] ?? new Set()

  const selectedNode = useMemo(() => {
    if (!selectedId) return null
    return findNode(getSectionTree(section), selectedId)
  }, [section, selectedId])

  const selectedCopyText = useMemo(() => {
    if (!selectedId) return sectionToText(section)
    return buildSelectedNodeText(section, selectedId)
  }, [section, selectedId])

  const toggleExpand = useCallback((tabId, nodeId) => {
    setExpandedByTab((prev) => {
      const next = new Set(prev[tabId] ?? [])
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return { ...prev, [tabId]: next }
    })
  }, [])

  const selectNode = useCallback((tabId, nodeId) => {
    setSelectedByTab((prev) => ({
      ...prev,
      [tabId]: prev[tabId] === nodeId ? null : nodeId,
    }))
  }, [])

  const expandAll = useCallback(() => {
    setExpandedByTab((prev) => ({
      ...prev,
      [activeTab]: new Set(collectNodeIds(section.getTree(), 0, 99)),
    }))
  }, [activeTab, section])

  const collapseAll = useCallback(() => {
    setExpandedByTab((prev) => ({
      ...prev,
      [activeTab]: new Set(collectNodeIds(section.getTree(), 0, 0)),
    }))
  }, [activeTab, section])

  const setTab = (tabId) => {
    setActiveTab(tabId)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tabId)
    window.history.replaceState({}, '', url)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,rgba(56,189,248,0.1),transparent),radial-gradient(ellipse_50%_45%_at_90%_30%,rgba(139,92,246,0.08),transparent)]" />

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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/90">Explorar</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                Estructura del proyecto
              </h2>
              <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
                Árbol de carpetas de <strong className="font-medium text-slate-300">frio-frontend</strong> y{' '}
                <strong className="font-medium text-slate-300">frio-backend</strong> según doc V2.0 §4. El modelo de
                datos vive en{' '}
                <Link to={paths.stackArchitecture} className="text-sky-400 hover:text-sky-300">
                  Arquitectura
                </Link>
                .
              </p>
            </div>
            <CopyButton
              text={buildFullProjectStructureText()}
              label="Copiar estructura completa"
              className="shrink-0 border-sky-500/40 bg-sky-500/15 text-sky-100 hover:bg-sky-500/25"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist">
            {PROJECT_STRUCTURE_SECTIONS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setTab(tab.id)}
                className={[
                  'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? TAB_STYLES[tab.accent]
                    : 'border-slate-700/60 bg-slate-900/40 text-slate-400 hover:text-slate-200',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Expandir todo
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Contraer todo
            </button>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_minmax(16rem,22rem)]">
            <StructureTreePanel
              section={section}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={(id) => toggleExpand(activeTab, id)}
              onSelect={(id) => selectNode(activeTab, id)}
            />

            <aside className="flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-700/55 bg-slate-900/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Selección</p>
                {selectedNode ? (
                  <>
                    <p className="mt-2 font-mono text-sm font-semibold text-slate-100">{selectedNode.name}</p>
                    {selectedNode.hint ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{selectedNode.hint}</p>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    Haz clic en una carpeta. Sin selección, se copia toda la sección activa.
                  </p>
                )}
              </div>

              <CopyButton text={selectedCopyText} label="Copiar selección" className="w-full justify-center" />
            </aside>
          </div>

          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Vista previa (texto)</h3>
              <CopyButton text={selectedCopyText} label="Copiar vista previa" className="!py-1.5 !text-xs" />
            </div>
            <pre className="app-scroll-panel mt-3 max-h-72 rounded-xl border border-slate-700/55 bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-emerald-100/90 whitespace-pre">
              {selectedCopyText}
            </pre>
          </section>
        </div>
      </div>
    </div>
  )
}
