import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  HiArrowLeft,
  HiChevronDown,
  HiChevronRight,
  HiOutlineCheck,
  HiOutlineClipboardDocument,
  HiOutlineFolder,
  HiOutlineTableCells,
} from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import {
  ARCHITECTURE_SECTIONS,
  buildFullArchitectureText,
  buildSelectedNodeText,
  collectNodeIds,
  databaseTableToText,
  findNode,
  getDatabaseTableById,
  getDatabaseTables,
  getSectionTree,
  isTreeSection,
  sectionToText,
} from '../data/projectArchitecture.js'
import { buildErDiagramMermaid } from '../data/buildErDiagram.js'
import { DatabaseSection } from './DatabaseSection.jsx'

const TAB_STYLES = {
  sky: 'border-sky-500/50 bg-sky-500/15 text-sky-200',
  violet: 'border-violet-500/50 bg-violet-500/15 text-violet-200',
  emerald: 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200',
}

function CopyButton({ text, label = 'Copiar', className = '' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={[
        'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
        copied
          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
          : 'border-slate-600/50 bg-slate-800/80 text-slate-200 hover:border-sky-400/40 hover:text-sky-100',
        className,
      ].join(' ')}
    >
      {copied ? (
        <>
          <HiOutlineCheck className="h-4 w-4" aria-hidden />
          Copiado
        </>
      ) : (
        <>
          <HiOutlineClipboardDocument className="h-4 w-4" aria-hidden />
          {label}
        </>
      )}
    </button>
  )
}

function TreeBranch({ node, depth, expanded, selectedId, onToggle, onSelect }) {
  const hasChildren = Boolean(node.children?.length)
  const isOpen = expanded.has(node.id)
  const isSelected = selectedId === node.id
  const isColumn = depth >= 3 && !hasChildren

  return (
    <li className="list-none">
      <div
        className={[
          'flex items-start gap-1 rounded-lg pr-2 transition-colors',
          isSelected ? 'bg-violet-500/15 ring-1 ring-violet-400/30' : 'hover:bg-slate-800/50',
        ].join(' ')}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="mt-1.5 shrink-0 rounded p-0.5 text-slate-500 hover:text-slate-200"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Contraer' : 'Expandir'}
          >
            {isOpen ? (
              <HiChevronDown className="h-4 w-4" aria-hidden />
            ) : (
              <HiChevronRight className="h-4 w-4" aria-hidden />
            )}
          </button>
        ) : (
          <span className="mt-1.5 w-5 shrink-0" aria-hidden />
        )}
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className="min-w-0 flex-1 py-1.5 text-left"
        >
          <span
            className={[
              'font-mono text-sm',
              isColumn ? 'text-cyan-200/90' : 'text-slate-100',
              hasChildren && depth < 2 ? 'font-semibold' : '',
            ].join(' ')}
          >
            {node.name}
          </span>
          {node.hint ? (
            <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{node.hint}</span>
          ) : null}
        </button>
      </div>
      {hasChildren && isOpen ? (
        <ul role="group">
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function ArchitecturePanel({ section, expanded, selectedId, onToggle, onSelect }) {
  const tree = getSectionTree(section)
  const Icon = HiOutlineFolder

  return (
    <div className="flex min-h-[28rem] flex-col rounded-2xl border border-slate-700/55 bg-slate-900/40">
      <div className="flex items-center gap-2 border-b border-slate-700/50 px-4 py-3">
        <Icon className="h-5 w-5 text-slate-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-semibold text-slate-100">{section.rootLabel}</p>
          <p className="text-xs text-slate-500">{section.label}</p>
        </div>
        <CopyButton text={sectionToText(section)} label="Copiar sección" className="!py-1.5 !text-xs" />
      </div>
      <div className="flex-1 overflow-auto p-2">
        <ul role="tree" aria-label={`Árbol ${section.label}`}>
          {tree.map((node) => (
            <TreeBranch
              key={node.id}
              node={node}
              depth={0}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

const VALID_TABS = new Set(['frontend', 'backend', 'database'])
const VALID_DB_VIEWS = new Set(['tables', 'er'])

export function StackArchitecturePortal() {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const dbViewFromUrl = searchParams.get('dbView')
  const initialTab = VALID_TABS.has(tabFromUrl) ? tabFromUrl : 'frontend'
  const initialDbView = VALID_DB_VIEWS.has(dbViewFromUrl) ? dbViewFromUrl : 'tables'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [dbView, setDbView] = useState(initialDbView)
  const [selectedByTab, setSelectedByTab] = useState({ frontend: null, backend: null, database: null })
  const [expandedByTab, setExpandedByTab] = useState(() => {
    const initial = {}
    for (const s of ARCHITECTURE_SECTIONS) {
      if (isTreeSection(s)) initial[s.id] = new Set(collectNodeIds(s.getTree(), 0, 1))
    }
    return initial
  })

  const section = ARCHITECTURE_SECTIONS.find((s) => s.id === activeTab) ?? ARCHITECTURE_SECTIONS[0]
  const selectedId = selectedByTab[activeTab]
  const expanded = expandedByTab[activeTab] ?? new Set()

  const isDatabaseView = section.view === 'tables'

  const selectedNode = useMemo(() => {
    if (isDatabaseView) {
      const table = selectedId ? getDatabaseTableById(selectedId) : getDatabaseTables()[0]
      if (!table) return null
      return { name: `${table.schema}.${table.table}`, hint: table.desc ?? table.name }
    }
    if (!selectedId || !isTreeSection(section)) return null
    return findNode(getSectionTree(section), selectedId)
  }, [section, selectedId, isDatabaseView])

  const selectedCopyText = useMemo(() => {
    if (!selectedId) return sectionToText(section)
    return buildSelectedNodeText(section, selectedId)
  }, [section, selectedId])

  const previewText = useMemo(() => {
    if (isDatabaseView && dbView === 'er') {
      return buildErDiagramMermaid({ includeAttributes: true })
    }
    if (selectedId && selectedNode) {
      return selectedCopyText
    }
    return sectionToText(section)
  }, [isDatabaseView, dbView, section, selectedId, selectedNode, selectedCopyText])

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
    if (!isTreeSection(section)) return
    setExpandedByTab((prev) => ({
      ...prev,
      [activeTab]: new Set(collectNodeIds(section.getTree(), 0, 99)),
    }))
  }, [activeTab, section])

  const collapseAll = useCallback(() => {
    if (!isTreeSection(section)) return
    setExpandedByTab((prev) => ({
      ...prev,
      [activeTab]: new Set(collectNodeIds(section.getTree(), 0, 0)),
    }))
  }, [activeTab, section])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,rgba(56,189,248,0.1),transparent),radial-gradient(ellipse_50%_45%_at_90%_30%,rgba(52,211,153,0.08),transparent)]" />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-auto">
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
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                Arquitectura del proyecto
              </h2>
              <p className="mt-3 text-pretty text-base leading-relaxed text-slate-400">
                Carpetas del frontend y backend en árbol; base de datos en tablas con columnas. Selecciona y copia con
                un clic.
              </p>
            </div>
            <CopyButton
              text={buildFullArchitectureText()}
              label="Copiar arquitectura completa"
              className="shrink-0 border-emerald-500/40 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist">
            {ARCHITECTURE_SECTIONS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id === 'database' && !selectedByTab.database) {
                    const first = getDatabaseTables()[0]
                    if (first) setSelectedByTab((prev) => ({ ...prev, database: first.id }))
                  }
                  const url = new URL(window.location.href)
                  url.searchParams.set('tab', tab.id)
                  if (tab.id !== 'database') url.searchParams.delete('dbView')
                  window.history.replaceState({}, '', url)
                }}
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

          {!isDatabaseView ? (
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
          ) : null}

          {isDatabaseView ? (
            <div className="mt-4">
              <DatabaseSection
                section={section}
                selectedTableId={selectedId}
                onSelectTable={(id) => selectNode('database', id)}
                dbView={dbView}
                onDbViewChange={(view) => {
                  setDbView(view)
                  const url = new URL(window.location.href)
                  url.searchParams.set('tab', 'database')
                  url.searchParams.set('dbView', view)
                  window.history.replaceState({}, '', url)
                }}
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_minmax(16rem,22rem)]">
              <ArchitecturePanel
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
          )}

          {isDatabaseView && dbView === 'tables' ? (
            <div className="mt-6 flex justify-end">
              <CopyButton
                text={
                  selectedId
                    ? databaseTableToText(getDatabaseTableById(selectedId))
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
            <pre className="mt-3 max-h-72 overflow-auto rounded-xl border border-slate-700/55 bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-emerald-100/90 whitespace-pre">
              {previewText}
            </pre>
          </section>
        </div>
      </div>
    </div>
  )
}
