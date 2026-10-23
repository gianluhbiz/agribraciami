import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
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
  secondary: { label: string; href?: string; action?: 'menu' | 'camere' | 'giornata' }
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
    secondary: { label: 'Sfoglia il menu', action: 'menu' },
  },
  {
    key: 'sleep',
    title: 'Sleep.',
    label: 'Camere',
    photo: 'suite-letto',
    alt: 'Letto a baldacchino della suite',
    text: 'Sette camere nella vecchia scuderia, colazione fatta da noi. Da € 95 a notte.',
    primary: { label: 'Prenota una camera', href: links.rooms },
    secondary: { label: 'Guarda le camere', action: 'camere' },
  },
  {
    key: 'kick',
    title: 'Kick back.',
    label: 'Piscina',
    photo: 'piscina-cappello',
    alt: 'Cappello di paglia sul bordo della piscina salina',
    text: 'Piscina salina, cinque ettari di prato e il mare in fondo all’orizzonte. Aperta anche a chi viene per la giornata.',
    primary: { label: 'Prenota la piscina', href: links.pool },
    secondary: { label: 'Com’è una giornata qui', action: 'giornata' },
  },
]

export function Hero() {
  const [active, setActive] = useState(0)
  const desktop = useMediaQuery('(min-width: 768px)')
  const status = useOpenStatus()
  const jump = useJump()
  const { go } = usePageTransition()

  const run = (action: Panel['primary']['action'], e: React.MouseEvent) => {
    if (action === 'menu') go('/menu', 'Menu', { x: e.clientX, y: e.clientY })
    else if (action) jump(action, e)
  }

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
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)', flexGrow: isActive ? (desktop ? 3.2 : 3.4) : 1 }}
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
                  {!isActive && (
                    <button
                      aria-label={`Apri ${p.label}`}
                      className="grid size-9 place-items-center rounded-full bg-cream/10 backdrop-blur-md md:hidden"
                    >
                      <i className="ri-add-line" aria-hidden />
                    </button>
                  )}
                </div>

                <motion.div layout="position" transition={{ type: 'spring', duration: 0.6, bounce: 0 }}>
                  <motion.h2
                    style={{ originX: 0, originY: 1 }}
                    initial={false}
                    animate={{ scale: isActive ? 1 : desktop ? 0.36 : 0.5 }}
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
