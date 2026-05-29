import { Handle, Position } from 'reactflow'

/** Supervisión: permisos, Zod/API, reglas de negocio, auditoría (capa automática). */
export function ValidationGateNode({ data, selected }) {
  return (
    <div
      className={[
        'relative flex min-h-[64px] w-[220px] max-w-[260px] flex-col items-center justify-center rounded-lg border-2 px-2 py-1.5 text-center shadow-md',
        'border-cyan-400/70 bg-gradient-to-b from-cyan-950/95 to-slate-900/95',
        selected ? 'ring-2 ring-cyan-300/80 ring-offset-2 ring-offset-slate-950' : '',
      ].join(' ')}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-0 !bg-cyan-200"
      />
      <Handle
        id="yes"
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-0 !bg-emerald-300"
      />
      <Handle
        id="no"
        type="source"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-0 !bg-rose-300"
      />
      <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-200">
        Validación
      </span>
      <span className="mt-0.5 text-[11px] font-semibold leading-snug text-cyan-50">
        {data.label}
      </span>
      {data.subtitle ? (
        <span className="mt-0.5 max-w-[220px] text-[9px] leading-tight text-slate-400">
          {data.subtitle}
        </span>
      ) : null}
    </div>
  )
}
