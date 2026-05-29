import { Handle, Position } from 'reactflow'

export function HeaderNode({ data, selected }) {
  const drill = Boolean(data?.drillDownTo)
  return (
    <div
      className={[
        'relative flex min-h-[48px] min-w-[240px] max-w-[300px] items-center justify-center rounded-lg border px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-violet-100 shadow-lg',
        'border-violet-400/60 bg-gradient-to-r from-violet-900/95 to-purple-900/90',
        drill ? 'cursor-pointer ring-2 ring-violet-300/40 ring-offset-2 ring-offset-slate-950' : '',
        selected ? 'ring-2 ring-violet-300/70 ring-offset-2 ring-offset-slate-950' : '',
      ].join(' ')}
      title={drill ? 'Clic para abrir sub-flujo' : undefined}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-0 !bg-violet-200"
      />
      {data.label}
    </div>
  )
}
