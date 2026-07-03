import { useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi2'
import { DocMarkdownView } from '../../docs/DocMarkdownView.jsx'
import { getDocumentationItemById } from '../../docs/docRegistry.js'
import { fetchDocMarkdown } from '../../docs/utils/fetchDocMarkdown.js'
import { extractSectionByTitle } from '../../docs/utils/extractMarkdownSection.js'
import { formatPolariaApiMarkdown } from '../../data/polariaWmsMeta.js'
import { formatPolariaSecurityMarkdown } from '../../data/polariaSecurityDoc.js'

function resolveReferenceMarkdown(project, topic) {
  if (topic.markdownSource === 'polaria-api' && project.id === 'bodega-frio') {
    return Promise.resolve({
      markdown: formatPolariaApiMarkdown(),
      sourceLabel: 'polariaWmsMeta.js — alineado a polaria-wms-api',
    })
  }

  if (topic.markdownSource === 'polaria-security' && project.id === 'bodega-frio') {
    return Promise.resolve({
      markdown: formatPolariaSecurityMarkdown(),
      sourceLabel: 'polariaSecurityDoc.js — Supabase + evaluación técnica',
    })
  }

  const docId = topic.sectionDocId ?? project.documentationDocId
  const doc = getDocumentationItemById(docId)
  if (!doc?.filePath || !topic.sectionPattern) {
    return Promise.reject(new Error('No hay documentación configurada para este tema.'))
  }

  return fetchDocMarkdown(doc.filePath).then((full) => {
    const section = extractSectionByTitle(full, topic.sectionPattern)
    if (!section) {
      throw new Error('No se encontró la sección en la documentación del proyecto.')
    }
    return {
      markdown: section,
      sourceLabel: `${doc.title} — sección extraída automáticamente`,
    }
  })
}

export function ReferenceMarkdownView({ project, topic, onBackToProjects }) {
  const [markdown, setMarkdown] = useState('')
  const [sourceLabel, setSourceLabel] = useState('')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    resolveReferenceMarkdown(project, topic)
      .then(({ markdown: md, sourceLabel: label }) => {
        if (cancelled) return
        setMarkdown(md)
        setSourceLabel(label)
        setStatus('idle')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Error al cargar')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [project, topic])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-15%,rgba(16,185,129,0.1),transparent)]" />

      <div className="relative flex min-h-0 flex-1 flex-col app-scroll-page">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={onBackToProjects}
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900/80 hover:text-sky-300"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            Cambiar proyecto
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
            {project.name} · Referencia
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-50">{topic.title}</h2>
          <p className="mt-2 text-sm text-slate-400">{topic.subtitle}</p>

          {status === 'loading' ? (
            <div className="mt-10 space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-800/60" />
              <div className="h-32 animate-pulse rounded-2xl bg-slate-800/40" />
              <div className="h-24 animate-pulse rounded-2xl bg-slate-800/40" />
            </div>
          ) : null}

          {status === 'error' ? (
            <p className="mt-10 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {status === 'idle' ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/35 p-4 sm:p-8">
              <DocMarkdownView markdown={markdown} />
            </div>
          ) : null}

          {sourceLabel ? (
            <p className="mt-8 text-xs text-slate-500">Fuente: {sourceLabel}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
