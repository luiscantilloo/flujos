export function FlowDiagramLegend({ text }) {
  if (!text?.trim()) return null
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-md rounded-md border border-slate-800/80 bg-slate-900/80 px-3 py-2 text-xs text-slate-400 backdrop-blur">
      {text}
    </div>
  )
}
