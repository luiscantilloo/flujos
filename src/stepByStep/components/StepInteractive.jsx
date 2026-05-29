import { useCallback, useMemo, useRef, useState } from 'react'
import { EVIDENCE_ITEM_ICONS, FrostIcon } from '../frostIcons.jsx'

function useFx(ctx) {
  const { burst, burstFromElement, setMood, addEnergy } = ctx ?? {}
  return {
    pop: (e, opts) => burst?.(e?.clientX ?? 0, e?.clientY ?? 0, opts),
    popEl: (el, opts) => burstFromElement?.(el, opts),
    happy: () => {
      setMood?.('happy')
      addEnergy?.(12)
    },
    sad: () => setMood?.('think'),
    energy: (n) => addEnergy?.(n),
  }
}

function BranchChoice({ config, onResolved, ctx }) {
  const fx = useFx(ctx)
  const [picked, setPicked] = useState(null)
  const [hover, setHover] = useState(null)

  const choose = (value, e) => {
    setPicked(value)
    const yes = value === 'yes'
    if (yes) {
      fx.happy()
      fx.pop(e, { count: 20, iconKey: 'sparkles' })
    } else {
      fx.sad()
      fx.pop(e, { count: 10, colors: ['#fb7185', '#fda4af'] })
    }
    onResolved?.(yes)
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-cyan-100/90">{config.question}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { id: 'yes', label: config.yesLabel ?? 'Sí', tone: 'emerald', icon: 'check' },
          { id: 'no', label: config.noLabel ?? 'No', tone: 'rose', icon: 'x' },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onMouseEnter={() => setHover(opt.id)}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => choose(opt.id, e)}
            className={[
              'frost-choice-card relative min-w-[140px] overflow-hidden rounded-2xl border-2 px-6 py-5 text-sm font-bold transition-all duration-300',
              picked === opt.id
                ? opt.tone === 'emerald'
                  ? 'frost-choice-win border-emerald-400/70 bg-emerald-500/25 text-emerald-50 scale-105'
                  : 'frost-choice-lose border-rose-400/70 bg-rose-500/25 text-rose-50 scale-105'
                : hover === opt.id
                  ? 'scale-105 border-cyan-400/50 bg-cyan-950/60 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.25)]'
                  : 'border-slate-600/80 bg-slate-900/70 text-slate-200',
            ].join(' ')}
          >
            <span className="mb-2 flex justify-center">
              <FrostIcon name={opt.icon} className="h-8 w-8" />
            </span>
            {opt.label}
            {hover === opt.id && !picked ? (
              <span className="pointer-events-none absolute inset-0 frost-shimmer" aria-hidden />
            ) : null}
          </button>
        ))}
      </div>
      {picked ? (
        <div
          className={[
            'frost-reveal rounded-xl border px-4 py-3 text-sm leading-relaxed',
            picked === 'yes' ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-100' : 'border-rose-500/30 bg-rose-950/40 text-rose-100',
          ].join(' ')}
        >
          {picked === 'yes' ? config.yesOutcome : config.noOutcome}
        </div>
      ) : (
        <p className="text-center text-xs text-slate-500">Haz clic en una tarjeta — se iluminará la rama del diagrama</p>
      )}
    </div>
  )
}

function TempGauge({ config, onResolved, ctx }) {
  const fx = useFx(ctx)
  const { min = -25, max = 10, threshold = 4, unit = '°C' } = config
  const [value, setValue] = useState(2)
  const tubeRef = useRef(null)
  const ok = value <= threshold

  const setFromPointer = (clientY) => {
    const tube = tubeRef.current
    if (!tube) return
    const rect = tube.getBoundingClientRect()
    const ratio = 1 - (clientY - rect.top) / rect.height
    const v = min + Math.max(0, Math.min(1, ratio)) * (max - min)
    const rounded = Math.round(v * 2) / 2
    setValue(rounded)
    if (rounded <= threshold) {
      fx.happy()
      onResolved?.(true)
    } else {
      ctx?.setMood?.('hot')
      onResolved?.(false)
    }
  }

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setFromPointer(e.clientY)
    fx.energy(5)
  }

  const onPointerMove = (e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    setFromPointer(e.clientY)
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-slate-400">Arrastra o toca dentro del termómetro</p>
      <div
        ref={tubeRef}
        role="slider"
        aria-valuenow={value}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') setValue((v) => Math.min(max, v + 0.5))
          if (e.key === 'ArrowDown') setValue((v) => Math.max(min, v - 0.5))
        }}
        className="relative mx-auto h-48 w-20 cursor-ns-resize overflow-hidden rounded-full border-2 border-cyan-400/40 bg-slate-900 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] touch-none"
      >
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-150 ${ok ? 'from-cyan-400/90 to-sky-300/50' : 'from-rose-500/80 to-amber-400/50'} bg-gradient-to-t`}
          style={{ height: `${((value - min) / (max - min)) * 100}%` }}
        />
        <div
          className="absolute left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all"
          style={{ bottom: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400"
          style={{ bottom: `${((threshold - min) / (max - min)) * 100}%` }}
        />
        {!ok ? <div className="frost-heat-wave pointer-events-none absolute inset-0" aria-hidden /> : null}
      </div>
      <p className="text-center text-3xl font-bold tabular-nums text-cyan-100">
        {value.toFixed(1)}
        {unit}
      </p>
      <p
        className={[
          'frost-reveal flex items-center justify-center gap-2 text-center text-sm font-medium',
          ok ? 'text-emerald-300' : 'text-amber-300',
        ].join(' ')}
      >
        {ok ? (
          <>
            <FrostIcon name="checkCircle" className="h-5 w-5 shrink-0" />
            Cadena de frío OK — inspección física
          </>
        ) : (
          <>
            <FrostIcon name="hot" className="h-5 w-5 shrink-0" />
            Override del jefe o rechazo total
          </>
        )}
      </p>
    </div>
  )
}

function SlotGrid({ config, onResolved, ctx }) {
  const fx = useFx(ctx)
  const count = config.slots ?? 8
  const locked = config.lockedIndex ?? -1
  const [selected, setSelected] = useState(() => new Set())
  const [dragOver, setDragOver] = useState(null)
  const [shake, setShake] = useState(null)
  const [inventory, setInventory] = useState(3)

  const placeOn = (i, e) => {
    if (config.mode === 'map' && i === locked) {
      setShake(i)
      ctx?.setMood?.('locked')
      fx.pop(e, { count: 8, colors: ['#fb7185'] })
      setTimeout(() => setShake(null), 500)
      return
    }
    if (inventory <= 0) return
    setSelected((prev) => {
      const next = new Set(prev)
      next.add(i)
      const done = config.mode === 'inbound' ? next.size >= 2 : next.size >= 1
      if (done) {
        fx.happy()
        onResolved?.(true)
      }
      return next
    })
    setInventory((n) => Math.max(0, n - 1))
    fx.pop(e, { iconKey: 'ice', count: 8 })
    fx.energy(8)
  }

  const cells = useMemo(() => Array.from({ length: count }, (_, i) => i), [count])

  return (
    <div className="space-y-4">
      {config.label ? <p className="text-center text-xs text-slate-400">{config.label}</p> : null}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/30 px-4 py-3">
        <span className="text-xs text-slate-400">Arrastra cajas →</span>
        <div className="flex gap-2">
          {Array.from({ length: inventory }, (_, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', 'box')
                e.dataTransfer.effectAllowed = 'move'
              }}
              className="frost-draggable flex h-12 w-12 cursor-grab items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/20 text-cyan-200 active:cursor-grabbing"
            >
              <FrostIcon name="package" className="h-6 w-6" />
            </div>
          ))}
        </div>
        <span className="text-xs text-slate-500">{inventory} restantes</span>
      </div>
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {cells.map((i) => {
          const isLocked = config.mode === 'map' && i === locked
          const isOn = selected.has(i)
          const isDrag = dragOver === i
          return (
            <button
              key={i}
              type="button"
              disabled={isLocked && !isOn}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(i)
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(null)
                placeOn(i, e)
              }}
              onClick={(e) => placeOn(i, e)}
              className={[
                'aspect-square rounded-xl border text-xs font-bold transition-all duration-200',
                shake === i ? 'frost-shake' : '',
                isDrag ? 'scale-110 border-cyan-300 bg-cyan-500/30' : '',
                isLocked
                  ? 'border-rose-500/50 bg-rose-950/50 text-rose-300'
                  : isOn
                    ? 'border-cyan-400/70 bg-cyan-500/25 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105'
                    : 'border-slate-600/60 bg-slate-900/70 text-slate-400 hover:border-cyan-500/40',
              ].join(' ')}
            >
              {isLocked ? (
                <FrostIcon name="lock" className="mx-auto h-5 w-5" />
              ) : isOn ? (
                <FrostIcon name="ice" className="mx-auto h-5 w-5" />
              ) : (
                i + 1
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BalanceMass({ config, onResolved, ctx }) {
  const fx = useFx(ctx)
  const target = config.inputKg ?? 100
  const [values, setValues] = useState(() =>
    Object.fromEntries((config.outputs ?? []).map((o) => [o.id, o.kg])),
  )

  const sum = Object.values(values).reduce((a, b) => a + b, 0)
  const balanced = sum === target
  const tilt = balanced ? 0 : sum > target ? 8 : -8

  const onSlide = (id, raw, e) => {
    const v = Number(raw)
    setValues((prev) => {
      const next = { ...prev, [id]: v }
      const s = Object.values(next).reduce((a, b) => a + b, 0)
      if (s === target) {
        fx.happy()
        fx.pop(e, { count: 24, iconKey: 'scale' })
        onResolved?.(true)
      }
      return next
    })
    fx.energy(4)
  }

  return (
    <div className="space-y-4">
      <div
        className="frost-scale relative mx-auto h-4 w-48 rounded-full bg-slate-800 transition-transform duration-300"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <div
          className="absolute bottom-full left-1/2 h-8 w-1 -translate-x-1/2 bg-slate-500"
          style={{ transform: `translateX(${(sum - target) * 0.8}px)` }}
        />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-cyan-300">
          <FrostIcon name="scale" className="h-8 w-8" />
        </div>
      </div>
      <p className="text-center text-sm text-slate-400">
        Meta: <span className="font-bold text-cyan-200">{target} kg</span> — mueve las barras
      </p>
      <div className="space-y-4">
        {(config.outputs ?? []).map((o) => (
          <div key={o.id} className="rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-3">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">{o.label}</span>
              <span className="font-bold tabular-nums text-cyan-100">{values[o.id]} kg</span>
            </div>
            <input
              type="range"
              min={0}
              max={target}
              value={values[o.id]}
              onChange={(e) => onSlide(o.id, e.target.value, e)}
              className="w-full accent-cyan-400"
            />
          </div>
        ))}
      </div>
      <p
        className={[
          'text-center text-sm font-semibold',
          balanced ? 'text-emerald-300 frost-reveal' : sum > target ? 'text-rose-300' : 'text-amber-300',
        ].join(' ')}
      >
        <span className="inline-flex items-center justify-center gap-1.5">
          Total: {sum} kg
          {balanced ? (
            <>
              <FrostIcon name="check" className="h-4 w-4" />
              ¡Balanza nivelada!
            </>
          ) : null}
        </span>
      </p>
    </div>
  )
}

function RoleCards({ config, ctx }) {
  const fx = useFx(ctx)
  const [flipped, setFlipped] = useState(() => new Set())

  const toggle = (id, e) => {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        fx.pop(e, { iconKey: 'sparkles', count: 12 })
        fx.energy(10)
      }
      if (next.size >= (config.cards?.length ?? 0)) {
        fx.happy()
        ctx?.onEngaged?.()
      }
      return next
    })
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {(config.cards ?? []).map((card) => {
        const isFlipped = flipped.has(card.id)
        return (
          <button
            key={card.id}
            type="button"
            onClick={(e) => toggle(card.id, e)}
            className="frost-flip-card h-44 w-36 [perspective:800px]"
          >
            <div
              className={[
                'relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]',
                isFlipped ? '[transform:rotateY(180deg)]' : '',
              ].join(' ')}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-900/80 to-slate-900 [backface-visibility:hidden]">
                <FrostIcon name={card.icon ?? 'sparkles'} className="h-10 w-10 text-cyan-300" />
                <p className="mt-3 text-sm font-semibold text-cyan-100">?</p>
                <p className="mt-1 text-[10px] text-slate-500">Toca para voltear</p>
              </div>
              <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border-2 border-violet-400/50 bg-violet-950/80 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="font-semibold text-violet-100">{card.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-violet-200/80">{card.desc}</p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function EvidenceChecklist({ config, onResolved, ctx }) {
  const fx = useFx(ctx)
  const [checked, setChecked] = useState(() => new Set())
  const [stamped, setStamped] = useState(false)

  const toggle = (id, e) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        fx.pop(e, { iconKey: 'check', count: 6 })
        fx.energy(8)
      }
      if (next.size >= (config.items?.length ?? 0)) {
        fx.happy()
        onResolved?.(true)
      }
      return next
    })
  }

  const stamp = (e) => {
    if (checked.size < (config.items?.length ?? 0)) return
    setStamped(true)
    fx.pop(e, { count: 30, iconKey: 'camera' })
    fx.happy()
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {(config.items ?? []).map((item) => {
          const on = checked.has(item.id)
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={(e) => toggle(item.id, e)}
                className={[
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300',
                  on ? 'border-emerald-500/50 bg-emerald-950/50 scale-[1.02] text-emerald-100' : 'border-slate-600/60 bg-slate-900/50 text-slate-300 hover:scale-[1.01]',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-9 w-9 items-center justify-center rounded-lg border',
                    on ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-slate-600 text-slate-500',
                  ].join(' ')}
                >
                  <FrostIcon
                    name={on ? 'check' : (EVIDENCE_ITEM_ICONS[item.id] ?? 'circle')}
                    className="h-5 w-5"
                  />
                </span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        disabled={checked.size < (config.items?.length ?? 0) || stamped}
        onClick={stamp}
        className={[
          'mx-auto block rounded-2xl border-2 px-8 py-4 text-sm font-bold transition-all',
          stamped
            ? 'border-emerald-400 bg-emerald-500/30 text-emerald-100 frost-stamp'
            : 'border-cyan-500/40 bg-cyan-950/50 text-cyan-200 hover:scale-105 disabled:opacity-40',
        ].join(' ')}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {stamped ? (
            '¡CERRADO CON EVIDENCIAS!'
          ) : (
            <>
              <FrostIcon name="pencil" className="h-5 w-5" />
              Sellar cierre del viaje
            </>
          )}
        </span>
      </button>
    </div>
  )
}

function FefoPicker({ config, onResolved, ctx }) {
  const fx = useFx(ctx)
  const sorted = [...(config.lots ?? [])].sort((a, b) => a.days - b.days)
  const correctId = sorted[0]?.id
  const [order, setOrder] = useState(() => (config.lots ?? []).map((l) => l.id))
  const [dragId, setDragId] = useState(null)
  const [validated, setValidated] = useState(false)

  const lotsById = useMemo(() => Object.fromEntries((config.lots ?? []).map((l) => [l.id, l])), [config.lots])

  const onDragStart = (id) => setDragId(id)
  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) return
    setOrder((prev) => {
      const next = [...prev]
      const from = next.indexOf(dragId)
      const to = next.indexOf(targetId)
      next.splice(from, 1)
      next.splice(to, 0, dragId)
      return next
    })
    setDragId(null)
    fx.energy(5)
  }

  const validate = (e) => {
    const ok = order[0] === correctId
    setValidated(true)
    if (ok) {
      fx.happy()
      fx.pop(e, { count: 22, iconKey: 'package' })
      onResolved?.(true)
    } else {
      fx.sad()
      fx.pop(e, { colors: ['#fb7185'] })
      onResolved?.(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-slate-400">Arrastra los lotes — el que vence antes arriba (FEFO)</p>
      <ul className="space-y-2">
        {order.map((id, rank) => {
          const lot = lotsById[id]
          return (
            <li
              key={id}
              draggable
              onDragStart={() => onDragStart(id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(id)}
              className={[
                'frost-draggable flex cursor-grab items-center justify-between rounded-xl border px-4 py-3 text-sm active:cursor-grabbing',
                validated && rank === 0
                  ? order[0] === correctId
                    ? 'border-emerald-500/50 bg-emerald-950/40'
                    : 'border-rose-500/50'
                  : 'border-slate-600/60 bg-slate-900/50 hover:border-cyan-500/40',
              ].join(' ')}
            >
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-cyan-300">
                  {rank + 1}
                </span>
                {lot.label}
              </span>
              <span className="text-slate-500">{lot.days} días</span>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={validate}
        className="mx-auto block rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-5 py-2 text-sm text-cyan-200 hover:bg-cyan-900/50"
      >
        Validar orden FEFO
      </button>
      {validated ? (
        <p className="frost-reveal text-center text-sm text-cyan-200">
          <span className="inline-flex items-center justify-center gap-2">
            <FrostIcon name={order[0] === correctId ? 'checkCircle' : 'x'} className="h-5 w-5" />
            {order[0] === correctId ? '¡Orden perfecto!' : 'El más urgente debe quedar primero'}
          </span>
        </p>
      ) : null}
    </div>
  )
}

function ChainReveal({ config, ctx }) {
  const fx = useFx(ctx)
  const items = config.steps ?? []
  const [progress, setProgress] = useState(0)
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (e) => {
    trackRef.current?.setPointerCapture(e.pointerId)
    setDragging(true)
    updateProgress(e)
  }

  const updateProgress = (e) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const step = Math.round(ratio * (items.length - 1))
    if (step > progress) {
      fx.energy(6)
      if (step >= items.length - 1) {
        fx.happy()
        ctx?.onEngaged?.()
      }
    }
    setProgress(step)
  }

  return (
    <div className="space-y-6">
      <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        Arrastra el camión
        <FrostIcon name="truck" className="h-4 w-4 text-cyan-400" />
        por la pista
      </p>
      <div
        ref={trackRef}
        className="relative mx-auto h-16 max-w-md cursor-pointer rounded-2xl border border-cyan-500/30 bg-slate-900/80 touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={(e) => dragging && updateProgress(e)}
        onPointerUp={() => setDragging(false)}
      >
        <div className="absolute inset-x-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-700" />
        <div
          className="absolute left-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
          style={{ width: `calc(${items.length > 1 ? (progress / (items.length - 1)) * 100 : 0}% - 1rem)` }}
        />
        <span
          className="frost-truck absolute top-1/2 text-cyan-300 transition-all duration-150"
          style={{
            left: `${items.length > 1 ? (progress / (items.length - 1)) * 92 + 4 : 4}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <FrostIcon name="truck" className="h-9 w-9" />
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((label, i) => (
          <span
            key={label}
            className={[
              'rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all',
              i <= progress ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-100 scale-105' : 'border-slate-700 text-slate-600',
            ].join(' ')}
          >
            <FrostIcon name={i <= progress ? 'check' : 'circle'} className="mr-1 inline h-3 w-3" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function DocChecklist({ config, onResolved, ctx }) {
  const fx = useFx(ctx)
  const [checked, setChecked] = useState(() => new Set())

  const toggle = (id, e) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        fx.pop(e, { count: 8 })
        fx.energy(6)
      }
      const required = (config.items ?? []).filter((i) => i.required).map((i) => i.id)
      if (required.every((r) => next.has(r))) {
        fx.happy()
        onResolved?.(true)
      }
      return next
    })
  }

  return (
    <ul className="space-y-2">
      {(config.items ?? []).map((item) => {
        const on = checked.has(item.id)
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={(e) => toggle(item.id, e)}
              className={[
                'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all',
                on ? 'border-emerald-500/50 bg-emerald-950/40 frost-doc-stamp' : 'border-slate-600/60 bg-slate-900/50 hover:border-cyan-500/30',
              ].join(' ')}
            >
              <FrostIcon
                name={on ? 'check' : (EVIDENCE_ITEM_ICONS[item.id] ?? 'circle')}
                className={on ? 'h-5 w-5 text-emerald-400' : 'h-5 w-5 text-slate-600'}
              />
              {item.label}
              {item.required ? <span className="ml-auto text-[10px] text-amber-400">requerido</span> : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function IntroPulse({ ctx }) {
  const fx = useFx(ctx)
  const [popped, setPopped] = useState(() => new Set())
  const bubbles = ['ice', 'snowflake', 'cloud', 'sparkles', 'mascot', 'crystal']

  const pop = (i, e) => {
    if (popped.has(i)) return
    setPopped((prev) => {
      const next = new Set(prev)
      next.add(i)
      if (next.size >= bubbles.length) {
        fx.happy()
        ctx?.onEngaged?.()
      }
      return next
    })
    fx.pop(e, { iconKey: bubbles[i], count: 16 })
    fx.energy(8)
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-cyan-300/80">¡Revienta todas las burbujas!</p>
      <div className="flex flex-wrap justify-center gap-3">
        {bubbles.map((iconKey, i) => (
          <button
            key={iconKey}
            type="button"
            disabled={popped.has(i)}
            onClick={(e) => pop(i, e)}
            className={[
              'flex h-16 w-16 items-center justify-center rounded-full border-2 text-cyan-200 transition-all duration-300',
              popped.has(i)
                ? 'scale-0 border-transparent opacity-0'
                : 'frost-bubble border-cyan-400/40 bg-cyan-500/10 hover:scale-110 active:scale-95',
            ].join(' ')}
          >
            <FrostIcon name={iconKey} className="h-8 w-8" />
          </button>
        ))}
      </div>
      <p className="text-center text-sm tabular-nums text-slate-400">
        {popped.size} / {bubbles.length} estalladas
      </p>
    </div>
  )
}

function CelebrateFinale({ ctx }) {
  const fx = useFx(ctx)
  const [clicks, setClicks] = useState(0)

  const fire = (e) => {
    setClicks((c) => c + 1)
    fx.pop(e, {
      count: 20 + clicks * 4,
      iconKey: ['celebrate', 'ice', 'sparkles', 'trophy', 'snowflake'][clicks % 5],
    })
    fx.happy()
    ctx?.onEngaged?.()
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-950/30 px-6 py-10 text-center">
      <div className="frost-confetti-field pointer-events-none absolute inset-0" aria-hidden />
      <button
        type="button"
        onClick={fire}
        className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-400/50 bg-emerald-500/20 text-emerald-200 transition-transform hover:scale-110 active:scale-95"
      >
        <FrostIcon name="trophy" className="h-12 w-12" />
      </button>
      <p className="relative mt-3 text-lg font-bold text-emerald-100">¡Recorrido completado!</p>
      <p className="relative mt-2 flex items-center justify-center gap-1.5 text-sm text-emerald-200/80">
        Toca el trofeo
        <FrostIcon name="trophy" className="h-4 w-4" />
        — lanza más confeti ({clicks} veces)
      </p>
    </div>
  )
}

export function StepInteractive({ interactive, onStepEngaged, fxContext }) {
  if (!interactive?.type) return null

  const ctx = {
    ...fxContext,
    onEngaged: onStepEngaged,
  }

  const props = { config: interactive, onResolved: onStepEngaged, ctx }

  switch (interactive.type) {
    case 'intro':
      return <IntroPulse {...props} />
    case 'branch':
      return <BranchChoice {...props} />
    case 'temp':
      return <TempGauge {...props} />
    case 'slots':
      return <SlotGrid {...props} />
    case 'balance':
      return <BalanceMass {...props} />
    case 'roles':
      return <RoleCards {...props} />
    case 'evidence':
      return <EvidenceChecklist {...props} />
    case 'fefo':
      return <FefoPicker {...props} />
    case 'chain':
      return <ChainReveal {...props} />
    case 'checklist':
      return <DocChecklist {...props} />
    case 'celebrate':
      return <CelebrateFinale {...props} />
    default:
      return null
  }
}
