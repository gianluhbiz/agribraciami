import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, type PanInfo } from 'framer-motion'
import { useEffect, useState } from 'react'
import { links, rating } from '../data/site'
import { useJump } from '../lib/nav'
import { Photo } from '../components/ui'
import { easeInOut, easeOut } from '../lib/motion'
import { useMediaQuery, useOpenStatus } from '../lib/hooks'
import { usePageTransition } from '../lib/transition-context'

type Panel = {
  key: string
  title: string
  label: string
  photo: string
  alt: string
  text: string
  primary: { label: string; href?: string; action?: 'menu' | 'camere' | 'giornata' }
  secondary: { label: string; short: string; href?: string; action?: 'menu' | 'camere' | 'giornata' }
  icon: string
}

const panels: Panel[] = [
  {
    key: 'eat',
    title: 'Eat.',
    label: 'Braceria',
    photo: 'brace-fiamme',
    alt: 'Hamburger sulla griglia con le fiamme della brace',
    text: 'La carne dei nostri allevamenti sulla brace di una ex stalla. Pasta tirata a mano, vini solo del Lazio.',
    primary: { label: 'Prenota un tavolo', href: links.table },
    secondary: { label: 'Sfoglia il menu', short: 'Menu', action: 'menu' },
    icon: 'ri-fire-line',
  },
  {
    key: 'sleep',
    title: 'Sleep.',
    label: 'Camere',
    photo: 'suite-letto',
    alt: 'Letto a baldacchino della suite',
    text: 'Sette camere nella vecchia scuderia, colazione fatta da noi. Da € 95 a notte.',
    primary: { label: 'Prenota una camera', href: links.rooms },
    secondary: { label: 'Guarda le camere', short: 'Camere', action: 'camere' },
    icon: 'ri-hotel-bed-line',
  },
  {
    key: 'kick',
    title: 'Kick back.',
    label: 'Piscina',
    photo: 'piscina-cappello',
    alt: 'Cappello di paglia sul bordo della piscina salina',
    text: 'Piscina salina, cinque ettari di prato e il mare in fondo all’orizzonte. Aperta anche a chi viene per la giornata.',
    primary: { label: 'Prenota la piscina', href: links.pool },
    secondary: { label: 'Com’è una giornata qui', short: 'La giornata', action: 'giornata' },
    icon: 'ri-sun-line',
  },
]

function useHeroAction() {
  const jump = useJump()
  const { go } = usePageTransition()
  return (action: Panel['primary']['action'], e: React.MouseEvent) => {
    if (action === 'menu') go('/menu', 'Menu', { x: e.clientX, y: e.clientY })
    else if (action) jump(action, e)
  }
}

export function Hero() {
  const desktop = useMediaQuery('(min-width: 768px)')
  return desktop ? <DesktopHero /> : <MobileHero />
}

function DesktopHero() {
  const [active, setActive] = useState(0)
  const status = useOpenStatus()
  const run = useHeroAction()

  return (
    <section id="top" className="relative flex h-[100svh] min-h-[620px] flex-col bg-coal px-2 pb-2 pt-[68px] sm:px-3 sm:pt-[76px]">
      <h1 className="sr-only">Braciami, agriturismo e braceria a km 0 a Viterbo</h1>

      <div className="flex flex-1 flex-col gap-2 md:flex-row">
        {panels.map((p, i) => {
          const isActive = active === i
          return (
            <motion.div
              key={p.key}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="relative min-h-0 min-w-0 overflow-hidden rounded-[1.4rem] sm:rounded-[2rem]"
              style={{ flexBasis: 0 }}
              initial={{ clipPath: 'inset(100% 0% 0% 0% round 2rem)', flexGrow: i === 0 ? 3 : 1 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)', flexGrow: isActive ? 3.2 : 1 }}
              transition={{
                clipPath: { duration: 1.1, ease: easeInOut, delay: 0.1 + i * 0.12 },
                flexGrow: { type: 'spring', duration: 0.75, bounce: 0.08 },
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ transform: 'scale(1.3)' }}
                animate={{ transform: isActive ? 'scale(1.02)' : 'scale(1.12)' }}
                transition={{ duration: 1.4, ease: easeOut }}
              >
                <Photo name={p.photo} alt={p.alt} eager className="h-full w-full" />
              </motion.div>
              <div
                className={`absolute inset-0 bg-gradient-to-t from-coal via-coal/30 to-coal/10 transition-opacity duration-500 ${
                  isActive ? 'opacity-90' : 'opacity-100'
                }`}
              />
              <div className={`absolute inset-0 bg-coal/40 transition-opacity duration-500 ${isActive ? 'opacity-0' : 'opacity-100'}`} />

              <div className="relative flex h-full flex-col justify-between p-4 sm:p-7">
                <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-cream/80">
                  <span>
                    0{i + 1} · {p.label}
                  </span>
                </div>

                <motion.div layout="position" transition={{ type: 'spring', duration: 0.6, bounce: 0 }}>
                  <motion.h2
                    style={{ originX: 0, originY: 1 }}
                    initial={false}
                    animate={{ scale: isActive ? 1 : 0.36 }}
                    transition={{ type: 'spring', duration: 0.7, bounce: 0 }}
                    className="whitespace-nowrap font-display font-soft text-[clamp(3.6rem,10vw,9.5rem)] italic leading-[0.85] tracking-tight text-cream"
                  >
                    {p.title}
                  </motion.h2>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key="body"
                        initial={{ opacity: 0, transform: 'translateY(16px)' }}
                        animate={{ opacity: 1, transform: 'translateY(0px)' }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.5, ease: easeOut, delay: 0.2 }}
                        className="mt-4 max-w-md"
                      >
                        <p className="text-[0.95rem] leading-relaxed text-cream/85 sm:text-base">{p.text}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <a
                            href={p.primary.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ember px-5 text-sm font-semibold transition-[transform,background-color] duration-150 hover:bg-[#ff5b38] active:scale-[0.97]"
                          >
                            {p.primary.label}
                            <i className="ri-arrow-right-up-line" aria-hidden />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              run(p.secondary.action, e)
                            }}
                            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cream/10 px-5 text-sm font-semibold ring-1 ring-cream/25 backdrop-blur-md transition-[transform,background-color] duration-150 hover:bg-cream/20 active:scale-[0.97]"
                          >
                            {p.secondary.label}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-2 pt-2.5 text-[0.72rem] text-cream/65 sm:text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span>Agriturismo dal 2015 · Strada Cimina 21, Viterbo</span>
        <a href={links.tripadvisor} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cream">
          <i className="ri-star-fill text-flame" aria-hidden />
          {rating.score} su Tripadvisor · {rating.count} recensioni
        </a>
        <span className="flex items-center gap-2">
          <span className={`size-1.5 rounded-full ${status.open ? 'bg-[#7bd88f]' : 'bg-smoke'}`} />
          {status.long}
        </span>
      </motion.div>
    </section>
  )
}

const STORY_SECONDS = 6

/**
 * Phones get one full-screen story per offer instead of squeezed panels:
 * auto-advancing, swipeable, hold to pause, with a tab bar to jump directly.
 */
function MobileHero() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [auto, setAuto] = useState(true)
  const [held, setHeld] = useState(false)
  const reduce = useReducedMotion()
  const status = useOpenStatus()
  const run = useHeroAction()
  const progress = useMotionValue(0)
  const p = panels[i]

  const show = (n: number, manual = false) => {
    setDir(n > i ? 1 : -1)
    progress.set(0)
    setI((n + panels.length) % panels.length)
    if (manual) setAuto(false)
  }

  useEffect(() => {
    if (!auto || held || reduce) return
    const controls = animate(progress, 1, {
      duration: STORY_SECONDS * (1 - progress.get()),
      ease: 'linear',
      onComplete: () => {
        progress.set(0)
        setDir(1)
        setI((v) => (v + 1) % panels.length)
      },
    })
    return () => controls.stop()
  }, [i, auto, held, reduce, progress])

  const onSwipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) show(i + 1, true)
    else if (info.offset.x > 50 || info.velocity.x > 400) show(i - 1, true)
  }

  return (
    <section id="top" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-coal">
      <h1 className="sr-only">Braciami, agriturismo e braceria a km 0 a Viterbo</h1>

      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={p.key}
          className="absolute inset-0"
          custom={dir}
          variants={{
            enter: (d: number) => ({ opacity: 0, transform: `translateX(${d * 12}%) scale(1.15)` }),
            show: { opacity: 1, transform: 'translateX(0%) scale(1)' },
            leave: (d: number) => ({ opacity: 0, transform: `translateX(${d * -8}%) scale(1.05)` }),
          }}
          initial="enter"
          animate="show"
          exit="leave"
          transition={{ opacity: { duration: 0.6 }, transform: { duration: STORY_SECONDS + 1, ease: [0.23, 1, 0.32, 1] } }}
        >
          <Photo name={p.photo} alt={p.alt} eager className="h-full w-full" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-coal/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-coal via-coal/75 to-transparent" />

      {/* Gesture layer: swipe to change, hold to pause. */}
      <motion.div
        className="absolute inset-0 touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={onSwipe}
        onPointerDown={() => setHeld(true)}
        onPointerUp={() => setHeld(false)}
        onPointerCancel={() => setHeld(false)}
        onPointerLeave={() => setHeld(false)}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-4 top-[72px] flex gap-1.5">
        {panels.map((panel, j) => (
          <span key={panel.key} className="h-[3px] flex-1 overflow-hidden rounded-full bg-cream/25">
            <motion.span
              className="block h-full origin-left rounded-full bg-cream"
              style={{ scaleX: j === i ? (auto && !reduce ? progress : 1) : j < i ? 1 : 0 }}
            />
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-4 top-[84px] flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cream/80">
        <span>
          0{i + 1} / 0{panels.length} · {p.label}
        </span>
        <a
          href={links.tripadvisor}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex min-h-9 items-center gap-1 rounded-full bg-coal/40 px-3 normal-case tracking-normal backdrop-blur-md"
        >
          <i className="ri-star-fill text-flame" aria-hidden />
          {rating.score} · {rating.count} recensioni
        </a>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.key}
            initial={{ opacity: 0, transform: 'translateY(24px)', filter: 'blur(6px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-12px)', filter: 'blur(4px)', transition: { duration: 0.18 } }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <h2 className="font-display font-soft text-[clamp(4.2rem,21vw,6.5rem)] italic leading-[0.85] tracking-tight text-cream">
              {p.title}
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-cream/85">{p.text}</p>
            <div className="mt-5 flex gap-2">
              <a
                href={p.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-ember px-4 text-[0.95rem] font-semibold transition-transform duration-150 active:scale-[0.97]"
              >
                {p.primary.label}
                <i className="ri-arrow-right-up-line" aria-hidden />
              </a>
              <button
                onClick={(e) => run(p.secondary.action, e)}
                className="inline-flex min-h-13 items-center justify-center gap-1.5 rounded-full bg-cream/10 px-4 text-[0.95rem] font-semibold ring-1 ring-cream/25 backdrop-blur-md transition-transform duration-150 active:scale-[0.97]"
              >
                {p.secondary.short}
                <i className="ri-arrow-right-line" aria-hidden />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div role="tablist" aria-label="Scegli" className="mt-5 grid grid-cols-3 rounded-full bg-coal/55 p-1 ring-1 ring-cream/10 backdrop-blur-xl">
          {panels.map((panel, j) => (
            <button
              key={panel.key}
              role="tab"
              aria-selected={j === i}
              onClick={() => show(j, true)}
              className={`relative flex min-h-11 items-center justify-center gap-1.5 rounded-full text-[0.8rem] font-semibold transition-colors duration-200 ${
                j === i ? 'text-coal' : 'text-cream/70'
              }`}
            >
              {j === i && (
                <motion.span
                  layoutId="hero-tab"
                  className="absolute inset-0 rounded-full bg-cream"
                  transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
                />
              )}
              <i className={`${panel.icon} relative`} aria-hidden />
              <span className="relative">{panel.title.replace('.', '')}</span>
            </button>
          ))}
        </div>

        <p className="mt-3 flex items-center justify-center gap-2 text-[0.72rem] text-cream/60">
          <span className={`size-1.5 rounded-full ${status.open ? 'bg-[#7bd88f]' : 'bg-smoke'}`} />
          {status.long}
        </p>
      </div>
    </section>
  )
}
