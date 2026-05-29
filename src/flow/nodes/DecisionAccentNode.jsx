import { Handle, Position } from 'reactflow'

/** Decisión destacada (estilo Mermaid: amarillo + borde violeta). */
export function DecisionAccentNode({ data, selected }) {
  return (
    <div
      className={[
        'relative flex h-[140px] w-[140px] items-center justify-center',
        selected ? 'drop-shadow-[0_0_14px_rgba(192,132,252,0.55)]' : '',
      ].join(' ')}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-0 !bg-yellow-200"
      />
      <Handle
        id="yes"
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-0 !bg-yellow-200"
      />
      <Handle
        id="no"
        type="source"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-0 !bg-yellow-200"
      />
      <div className="pointer-events-none flex h-[102px] w-[102px] items-center justify-center rounded-md border-[2.5px] border-purple-900 bg-yellow-400 shadow-lg [transform:rotate(45deg)]">
        <span className="max-w-[120px] px-1 text-center text-[11px] font-semibold leading-tight text-yellow-950 [transform:rotate(-45deg)]">
          {data.label}
        </span>
      </div>
    </div>
  )
}
