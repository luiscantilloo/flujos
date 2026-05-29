import { Handle, Position } from 'reactflow'

export function DecisionNode({ data, selected }) {
  const drill = Boolean(data?.drillDownTo)
  return (
    <div
      className={[
        'relative flex h-[140px] w-[140px] items-center justify-center',
        drill ? 'cursor-pointer rounded-md ring-2 ring-amber-300/45 ring-offset-2 ring-offset-slate-950' : '',
        selected ? 'drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]' : '',
      ].join(' ')}
      title={drill ? 'Clic para abrir sub-flujo' : undefined}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-0 !bg-amber-200"
      />
      <Handle
        id="yes"
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-0 !bg-amber-200"
      />
      <Handle
        id="no"
        type="source"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-0 !bg-amber-200"
      />
      <div className="pointer-events-none flex h-[102px] w-[102px] items-center justify-center rounded-md border-2 border-amber-200/80 bg-amber-400 shadow-lg [transform:rotate(45deg)]">
        <span className="max-w-[120px] px-1 text-center text-[11px] font-semibold leading-tight text-slate-900 [transform:rotate(-45deg)]">
          {data.label}
        </span>
      </div>
    </div>
  )
}
