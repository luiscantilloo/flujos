import { Handle, Position } from 'reactflow'

export function StartNode({ data, selected }) {
  const drill = Boolean(data?.drillDownTo)
  return (
    <div
      className={[
        'relative flex min-h-[48px] min-w-[160px] max-w-[220px] items-center justify-center rounded-lg border px-3 py-2 text-center text-xs font-semibold leading-snug text-fuchsia-50 shadow-lg',
        'border-fuchsia-400/55 bg-gradient-to-b from-fuchsia-900/90 to-fuchsia-950/95',
        drill ? 'cursor-pointer ring-2 ring-fuchsia-400/30 ring-offset-2 ring-offset-slate-950' : '',
        selected ? 'ring-2 ring-sky-400/80 ring-offset-2 ring-offset-slate-950' : '',
      ].join(' ')}
      title={drill ? 'Clic para abrir sub-flujo' : undefined}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-0 !bg-fuchsia-200"
      />
      {data.label}
    </div>
  )
}
