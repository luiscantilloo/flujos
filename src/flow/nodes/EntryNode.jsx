import { Handle, Position } from 'reactflow'

export function EntryNode({ data, selected }) {
  return (
    <div
      className={[
        'relative flex min-h-[52px] min-w-[200px] max-w-[260px] items-center justify-center rounded-md border px-3 py-2 text-center text-xs font-semibold leading-snug text-sky-50 shadow-md',
        'border-sky-400/55 bg-sky-900/50',
        selected ? 'ring-2 ring-sky-400/80 ring-offset-2 ring-offset-slate-950' : '',
      ].join(' ')}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-0 !bg-sky-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-0 !bg-sky-300"
      />
      {data.label}
    </div>
  )
}
