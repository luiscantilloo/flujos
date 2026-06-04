import { useState } from 'react'
import {
  HiChevronDown,
  HiChevronRight,
  HiOutlineCheck,
  HiOutlineClipboardDocument,
  HiOutlineFolder,
} from 'react-icons/hi2'
import { collectNodeIds, getSectionTree, sectionToText } from '../data/projectArchitecture.js'

export function CopyButton({ text, label = 'Copiar', className = '' }) {
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

export function TreeBranch({ node, depth, expanded, selectedId, onToggle, onSelect }) {
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

export function StructureTreePanel({ section, expanded, selectedId, onToggle, onSelect }) {
  const tree = getSectionTree(section)

  return (
    <div className="flex min-h-[28rem] flex-col rounded-2xl border border-slate-700/55 bg-slate-900/40">
      <div className="flex items-center gap-2 border-b border-slate-700/50 px-4 py-3">
        <HiOutlineFolder className="h-5 w-5 text-slate-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-semibold text-slate-100">{section.rootLabel}</p>
          <p className="text-xs text-slate-500">{section.label}</p>
        </div>
        <CopyButton text={sectionToText(section)} label="Copiar sección" className="!py-1.5 !text-xs" />
      </div>
      <div className="app-scroll-panel flex-1 p-2">
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

/** Estado inicial de nodos expandidos por sección de estructura. */
export function buildInitialExpandedByStructureSection(sections, maxDepth = 1) {
  const initial = {}
  for (const s of sections) {
    initial[s.id] = new Set(collectNodeIds(s.getTree(), 0, maxDepth))
  }
  return initial
}
