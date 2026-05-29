export function FlowNavigation({
  stack,
  goToCrumb,
  switchTopLevelFlow,
  flowDefinitions,
  topLevelFlowKeys,
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 border-b border-slate-800/90 bg-slate-900/70 px-3 py-2 text-sm"
      aria-label="Navegación de flujos"
    >
      {topLevelFlowKeys.length > 1 ? (
        <div
          className="flex max-h-[44vh] min-w-0 flex-1 flex-wrap gap-1 overflow-y-auto overflow-x-hidden sm:max-h-none sm:overflow-x-auto"
          role="tablist"
          aria-label="Elegir flujo"
        >
          {topLevelFlowKeys.map((key) => {
            const def = flowDefinitions[key]
            const isRoot = stack[0].key === key
            const isSolo = stack.length === 1
            const isActive = isRoot && isSolo
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => switchTopLevelFlow(key)}
                className={[
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-violet-600/40 text-violet-100 ring-1 ring-violet-400/50'
                    : isRoot && !isSolo
                      ? 'bg-slate-800 text-violet-200/90 ring-1 ring-violet-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                ].join(' ')}
              >
                {def.tabShort ?? def.title}
              </button>
            )
          })}
        </div>
      ) : null}
      {stack.length > 1 ? (
        <>
          <span className="select-none text-slate-600" aria-hidden="true">
            /
          </span>
          <span className="text-xs text-slate-500">Detalle:</span>
          {stack.slice(1).map((crumb, sliceIndex) => {
            const index = sliceIndex + 1
            const isLast = index === stack.length - 1
            return (
              <span key={`${crumb.key}-${index}`} className="flex items-center gap-1">
                <span className="select-none text-slate-600" aria-hidden="true">
                  /
                </span>
                <button
                  type="button"
                  onClick={() => goToCrumb(index)}
                  className={[
                    'rounded-md px-2 py-1 transition-colors',
                    isLast
                      ? 'cursor-default font-semibold text-slate-100'
                      : 'text-sky-400 hover:bg-slate-800 hover:text-sky-300',
                  ].join(' ')}
                >
                  {crumb.title}
                </button>
              </span>
            )
          })}
        </>
      ) : null}
      {stack.length === 1 && topLevelFlowKeys.length <= 1 ? (
        <span className="ml-auto hidden text-xs text-slate-500 sm:inline">
          WMS — un solo diagrama
        </span>
      ) : null}
      {stack.length === 1 && topLevelFlowKeys.length > 1 ? (
        <span className="ml-auto hidden text-xs text-slate-500 sm:inline">
          Migas: flujo actual
        </span>
      ) : null}
      {stack.length > 1 ? (
        <button
          type="button"
          className="ml-auto rounded-md px-2 py-1 text-xs text-sky-400 hover:bg-slate-800 hover:text-sky-300"
          onClick={() => goToCrumb(0)}
        >
          Volver a {stack[0].title}
        </button>
      ) : null}
    </nav>
  )
}
