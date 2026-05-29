import { Handle, Position } from 'reactflow'

export function ProcessNode({ data, selected }) {
  const drill = Boolean(data?.drillDownTo)
  return (
    <div
      className={[
        'relative flex min-h-[56px] min-w-[200px] max-w-[260px] items-center justify-center rounded-md border px-3 py-2 text-center text-xs font-medium leading-snug text-slate-100 shadow-md',
        'border-slate-500/60 bg-slate-800/95',
        drill ? 'cursor-pointer ring-2 ring-sky-400/35 ring-offset-2 ring-offset-slate-950' : '',
        selected ? 'ring-2 ring-sky-400/80 ring-offset-2 ring-offset-slate-950' : '',
      ].join(' ')}
      title={drill ? 'Clic para abrir sub-flujo' : undefined}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-0 !bg-slate-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-0 !bg-slate-400"
      />
      {data.label}
    </div>
  )
}
