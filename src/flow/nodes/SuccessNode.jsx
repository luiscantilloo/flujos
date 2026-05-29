import { Handle, Position } from 'reactflow'

export function SuccessNode({ data, selected }) {
  return (
    <div
      className={[
        'relative flex h-[104px] w-[104px] items-center justify-center rounded-full border-2 border-emerald-200/80 bg-emerald-500 px-3 text-center text-[11px] font-bold leading-snug text-emerald-950 shadow-lg',
        selected ? 'ring-2 ring-emerald-200/90 ring-offset-2 ring-offset-slate-950' : '',
      ].join(' ')}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-0 !bg-emerald-900"
      />
      {data.label}
    </div>
  )
}
