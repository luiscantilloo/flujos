import { Handle, Position } from 'reactflow'

export function ErrorNode({ data, selected }) {
  return (
    <div
      className={[
        'relative flex min-h-[48px] min-w-[180px] max-w-[240px] items-center justify-center rounded-md border px-3 py-2 text-center text-xs font-semibold leading-snug text-red-50 shadow-md',
        'border-red-400/70 bg-red-600/90',
        selected ? 'ring-2 ring-red-300/80 ring-offset-2 ring-offset-slate-950' : '',
      ].join(' ')}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-0 !bg-red-200"
      />
      {data.label}
    </div>
  )
}
