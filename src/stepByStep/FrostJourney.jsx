import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiArrowRight, HiOutlineSparkles } from 'react-icons/hi2'
import { paths } from '../router/paths.js'
import {
  BODEGA_STEP_CHAPTERS,
  BODEGA_STEP_COUNT,
  bodegaStepByStepSteps,
} from '../data/bodegaStepByStepData.js'
import { useFrostParticles } from './hooks/useFrostParticles.js'
import { FrostAmbience } from './components/FrostAmbience.jsx'
import { FrostMascot } from './components/FrostMascot.jsx'
import { FrostParticleLayer } from './components/FrostParticleLayer.jsx'
import { IceStepTrail } from './components/IceStepTrail.jsx'
import { InteractiveStage } from './components/InteractiveStage.jsx'
import { StepInteractive } from './components/StepInteractive.jsx'
import { FrostIcon } from './frostIcons.jsx'

const VISUAL_BG = {
  ice: 'from-cyan-600/10 via-slate-950 to-slate-950',
  snow: 'from-sky-400/10 via-slate-950 to-indigo-950/30',
  cloud: 'from-slate-400/10 via-slate-950 to-slate-950',
  crystal: 'from-violet-500/10 via-slate-950 to-cyan-950/20',
  aurora: 'from-emerald-400/10 via-cyan-500/5 to-violet-950/20',
}

const SCENE_ICON = {
  ice: 'ice',
  snow: 'snow',
  cloud: 'cloud',
  crystal: 'crystal',
  aurora: 'aurora',
}

export function FrostJourney({ projectName, onBackToProjects }) {
  const [index, setIndex] = useState(0)
  const [engaged, setEngaged] = useState(false)
  const [slideDir, setSlideDir] = useState(1)
  const [energy, setEnergy] = useState(0)
  const [mascotMood, setMascotMood] = useState('idle')
  const [combo, setCombo] = useState(0)
  const touchRef = useRef(null)

  const { particles, burst, burstFromElement } = useFrostParticles()

  const step = bodegaStepByStepSteps[index]
  const chapter = BODEGA_STEP_CHAPTERS.find((c) => c.id === step.chapter)
  const progress = ((index + 1) / BODEGA_STEP_COUNT) * 100

  const addEnergy = useCallback((amount) => {
    setEnergy((e) => Math.min(100, e + amount))
    setCombo((c) => c + 1)
  }, [])

  const fxContext = {
    burst,
    burstFromElement,
    setMood: setMascotMood,
    addEnergy,
  }

  const go = useCallback(
    (next) => {
      if (next < 0 || next >= BODEGA_STEP_COUNT) return
      setSlideDir(next > index ? 1 : -1)
      setIndex(next)
      setEngaged(false)
      setMascotMood('idle')
      if (next > index) {
        addEnergy(5)
        setMascotMood('happy')
      }
    },
    [index, addEnergy],
  )

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  const handleEngaged = useCallback(() => {
    setEngaged(true)
    addEnergy(15)
    setMascotMood('happy')
  }, [addEnergy])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea, select, [role="slider"]')) return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        go(BODEGA_STEP_COUNT - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go])

  const onTouchStart = (e) => {
    touchRef.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (touchRef.current == null) return
    const delta = e.changedTouches[0].clientX - touchRef.current
    touchRef.current = null
    if (Math.abs(delta) < 60) return
    if (delta < 0) next()
    else prev()
  }

  const pokeMascot = (e) => {
    burst(e.clientX, e.clientY, { iconKey: 'mascot', count: 12 })
    addEnergy(3)
    setMascotMood('happy')
  }

  return (
    <div
      className="flex min-h-0 flex-1 flex-col bg-slate-950"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <FrostParticleLayer particles={particles} />
      <div className="frost-snow pointer-events-none fixed inset-0 z-0 opacity-40" aria-hidden />

      <div className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-cyan-900/30 bg-slate-900/50 px-4 py-3 backdrop-blur-md">
        <Link
          to={paths.stepByStep()}
          className="inline-flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300"
        >
          <HiArrowLeft className="h-4 w-4" />
          Proyectos
        </Link>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400/80">Paso a paso</p>
          <p className="text-sm font-medium text-slate-200">{projectName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs tabular-nums text-slate-500">
            {index + 1} / {BODEGA_STEP_COUNT}
          </p>
          {combo > 0 ? (
            <p className="text-[10px] font-bold text-amber-400/90">×{combo} combo</p>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 h-1.5 shrink-0 bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 shrink-0 border-b border-cyan-900/20 px-4 py-2">
        <FrostMascot mood={mascotMood} energy={energy} onPoke={pokeMascot} />
      </div>

      <IceStepTrail steps={bodegaStepByStepSteps} currentIndex={index} onJump={go} />

      <div
        className={`app-scroll-page relative z-10 flex min-h-0 flex-1 flex-col bg-gradient-to-b ${VISUAL_BG[step.visual] ?? VISUAL_BG.ice}`}
      >
        <FrostAmbience onPop={(x, y) => burst(x, y, { count: 6 })} />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="portal-orb portal-orb-sky absolute -left-20 top-10 h-64 w-64 rounded-full blur-3xl opacity-60" />
          <div
            className="portal-orb absolute -right-16 bottom-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl"
            style={{ animationDelay: '-6s' }}
          />
        </div>

        <article
          key={step.id}
          className={[
            'frost-step-enter relative mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-8 sm:py-8',
            slideDir > 0 ? 'frost-step-from-right' : 'frost-step-from-left',
          ].join(' ')}
        >
          <div className="pointer-events-none absolute -right-2 top-0 select-none opacity-[0.08] sm:-right-4">
            <FrostIcon name={SCENE_ICON[step.visual] ?? 'ice'} className="h-24 w-24 sm:h-28 sm:w-28" />
          </div>

          {chapter ? (
            <span
              className={`inline-flex rounded-full border border-white/10 bg-gradient-to-r ${chapter.color} px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300`}
            >
              {chapter.label}
            </span>
          ) : null}

          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            {step.title}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-cyan-200/90">
            <HiOutlineSparkles className="h-4 w-4 shrink-0 frost-sparkle" aria-hidden />
            {step.hook}
          </p>

          <details className="group mt-4 rounded-xl border border-slate-700/50 bg-slate-900/40 open:border-cyan-500/20">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-200 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <FrostIcon name="chevronRight" className="h-4 w-4 transition-transform group-open:rotate-90" />
                Leer contexto del paso
              </span>
            </summary>
            <div className="border-t border-slate-800/80 px-4 pb-4 pt-2">
              <p className="text-sm leading-relaxed text-slate-300">{step.narrative}</p>
              {step.funFact ? (
                <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-950/25 px-3 py-2 text-xs text-amber-100/90">
                  <span className="inline-flex items-start gap-2">
                    <FrostIcon name="lightBulb" className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    {step.funFact}
                  </span>
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {step.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-slate-600/50 bg-slate-950/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </details>

          <InteractiveStage
            engaged={engaged}
            onStageClick={(e) => {
              if (e.target.closest('button, input, [draggable], summary')) return
              burst(e.clientX, e.clientY, { count: 4 })
            }}
          >
            <StepInteractive
              interactive={step.interactive}
              onStepEngaged={handleEngaged}
              fxContext={fxContext}
            />
          </InteractiveStage>

          {!engaged ? (
            <p className="mt-3 animate-pulse text-center text-xs font-medium text-cyan-400/80">
              <span className="inline-flex items-center justify-center gap-1.5">
                <FrostIcon name="cursor" className="h-4 w-4" />
                Interactúa en la zona de juego para cargar energía
              </span>
            </p>
          ) : (
            <p className="frost-reveal mt-3 text-center text-xs font-semibold text-emerald-400/90">
              <span className="inline-flex items-center justify-center gap-1.5">
                <FrostIcon name="checkCircle" className="h-4 w-4" />
                Paso dominado — puedes avanzar
              </span>
            </p>
          )}
        </article>
      </div>

      <footer className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-t border-cyan-900/30 bg-slate-900/70 px-4 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className="frost-nav-btn inline-flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all enabled:hover:border-cyan-500/40 enabled:hover:text-cyan-100 enabled:active:scale-95 disabled:opacity-40"
        >
          <HiArrowLeft className="h-4 w-4" />
          Anterior
        </button>
        <p className="hidden text-center text-[10px] leading-tight text-slate-500 sm:block">
          ← → o desliza
          <br />
          Espacio = siguiente
        </p>
        <button
          type="button"
          onClick={next}
          disabled={index >= BODEGA_STEP_COUNT - 1}
          className="frost-nav-btn inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition-all enabled:hover:bg-cyan-900/50 enabled:hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] enabled:active:scale-95 disabled:opacity-40"
        >
          Siguiente
          <HiArrowRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  )
}
