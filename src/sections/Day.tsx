import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { contact, experiences, links } from '../data/site'
import { Kicker, Photo } from '../components/ui'
import { easeOut } from '../lib/motion'
import { useMediaQuery } from '../lib/hooks'

type Moment = {
  time: string
  title: string
  text: string
  photos: [string, string]
  alts: [string, string]
  cta?: { label: string; href?: string; drawer?: boolean }
}

const moments: Moment[] = [
  {
    time: '09:00',
    title: 'Colazione in Sala Ash',
    text: 'Torte, biscotti, uova e salato fatti da noi con prodotti a km 0. Diteci di allergie e intolleranze, ci pensiamo prima.',
    photos: ['colazione-buffet', 'uovo-gazzetta'],
    alts: ['Buffet della colazione', 'Uovo all’occhio di bue e la Gazzetta'],
  },
  {
    time: '11:00',
    title: 'Un tuffo in piscina salina',
    text: 'Dal 20 giugno al 7 settembre circa. Lettini sotto le querce e silenzio. Puoi venire anche solo per la giornata.',
    photos: ['piscina-collina', 'piscina-cappello'],
    alts: ['La piscina sulla collina', 'Cappello di paglia a bordo piscina'],
    cta: { label: 'Prenota la piscina', href: links.pool },
  },
  {
    time: '13:00',
    title: 'Pranzo alla brace',
    text: 'Sabato e domenica la braceria apre anche a pranzo. In mezza pensione il tavolo lo teniamo per voi.',
    photos: ['tavola-piatti', 'giardino-tavoli'],
    alts: ['Pranzo condiviso dall’alto', 'Tavolini nel giardino'],
    cta: { label: 'Prenota un tavolo', href: links.table },
  },
  {
    time: '16:00',
    title: 'Le mani in pasta',
    text: 'Pasta fatta in casa con zia Francesca, yoga aereo, pilates nel prato, massaggi, un workshop di fiori.',
    photos: ['ravioli', 'moto-rose'],
    alts: ['Ravioli fatti a mano', 'Rose e una moto d’epoca'],
    cta: { label: 'Tutte le esperienze', drawer: true },
  },
  {
    time: '18:30',
    title: 'Cantine e terme',
    text: 'Le cantine della nostra carta dei vini sono a pochi chilometri. Le terme di Viterbo pure.',
    photos: ['altalena-tramonto', 'ash-vini'],
    alts: ['Altalena al tramonto', 'La libreria dei vini in Sala Ash'],
    cta: { label: 'Organizza con noi', drawer: true },
  },
  {
    time: '20:00',
    title: 'Cena in braceria',
    text: 'Il braciere è acceso dal mercoledì alla domenica. Carne nostra, pasta tirata a mano, vino del Lazio.',
    photos: ['sala-verticale', 'braceria-hall'],
    alts: ['La sala della braceria', 'Tavoli in legno della braceria'],
    cta: { label: 'Prenota un tavolo', href: links.table },
  },
  {
    time: '23:00',
    title: 'Il cielo stellato',
    text: '“Un cielo stellato che non vedevamo da anni.” Lo ha scritto Girasole81 su Tripadvisor. Lontano da Roma, lo vedi anche tu.',
    photos: ['neon', 'ulivo-tramonto'],
    alts: ['L’insegna al neon di Braciami di notte', 'L’ulivo all’imbrunire'],
    cta: { label: 'Prenota una camera', href: links.rooms },
  },
]

const skies = ['#f4ecdf', '#d6e6e3', '#f2dcae', '#ebc796', '#e0804f', '#3b2420', '#15110e']
const inks = ['#15110e', '#15110e', '#15110e', '#15110e', '#15110e', '#f4ecdf', '#f4ecdf']

function ExperienceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const desktop = useMediaQuery('(min-width: 768px)')
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', k)
    }
  }, [open, onClose])

  const hidden = desktop ? 'translateX(100%)' : 'translateY(100%)'
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-coal/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal
            aria-label="Esperienze"
            className="fixed inset-x-0 bottom-0 z-[71] max-h-[88svh] overflow-y-auto rounded-t-[2rem] bg-cream p-6 text-coal md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[520px] md:rounded-l-[2rem] md:rounded-tr-none md:p-10"
            initial={{ transform: hidden }}
            animate={{ transform: 'translate(0,0)' }}
            exit={{ transform: hidden, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-coal/20 md:hidden" />
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-4xl italic">Esperienze</h3>
              <button onClick={onClose} aria-label="Chiudi" className="grid size-11 place-items-center rounded-full bg-coal/5 hover:bg-coal/10">
                <i className="ri-close-line text-xl" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-coal/60">Su richiesta. Il numero indica quanti giorni prima dell’arrivo ce lo devi dire.</p>
            {(['Braciami', 'Dintorni'] as const).map((w) => (
              <div key={w} className="mt-8">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ember">
                  {w === 'Braciami' ? 'Da noi' : 'Nei dintorni, con i nostri partner'}
                </p>
                <ul className="mt-3 divide-y divide-coal/10">
                  {experiences
                    .filter((e) => e.where === w)
                    .map((e) => (
                      <li key={e.title} className="flex gap-4 py-4">
                        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-coal text-center text-cream">
                          <span className="font-display text-lg italic leading-none">
                            {e.notice}
                            <span className="block font-sans text-[0.55rem] not-italic uppercase tracking-wide">giorni</span>
                          </span>
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold">{e.title}</p>
                          <p className="mt-0.5 text-sm text-coal/65">{e.text}</p>
                          {e.partners && <p className="mt-1 text-xs text-coal/45">{e.partners.join(' · ')}</p>}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <div className="sticky bottom-0 -mx-6 mt-6 grid grid-cols-2 gap-2 bg-cream p-4 md:-mx-10 md:px-10">
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent('Richiesta esperienze')}`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ember text-sm font-semibold text-cream"
              >
                <i className="ri-mail-line" aria-hidden /> Scrivici
              </a>
              <a href={contact.phoneHref} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-coal text-sm font-semibold text-cream">
                <i className="ri-phone-line" aria-hidden /> Chiama
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function MomentBlock({ m, i, onDrawer }: { m: Moment; i: number; onDrawer: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [80, -80])
  return (
    <div ref={ref} data-moment={i} className="grid min-h-[90svh] content-center gap-8 py-16 md:grid-cols-[1fr_1fr] md:gap-12">
      <div className="relative">
        <motion.div
          initial={{ clipPath: 'inset(30% 0% 30% 0% round 2rem)', opacity: 0.4 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)', opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
        >
          <Photo name={m.photos[0]} alt={m.alts[0]} className="aspect-[4/5] rounded-[2rem]" />
        </motion.div>
        <motion.div style={{ y }} className="absolute -bottom-8 -right-3 w-[42%] rotate-3 sm:-right-8">
          <Photo name={m.photos[1]} small alt={m.alts[1]} className="aspect-square rounded-2xl shadow-2xl shadow-black/30 ring-4 ring-current/0" />
        </motion.div>
      </div>
      <div className="md:pl-6">
        <p className="font-display text-2xl italic opacity-60 md:hidden">{m.time}</p>
        <h3 className="font-display font-soft text-[clamp(2.2rem,4.6vw,4rem)] font-medium leading-[1.02] tracking-tight">{m.title}</h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed opacity-75">{m.text}</p>
        {m.cta &&
          (m.cta.href ? (
            <a
              href={m.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-ember px-5 text-sm font-semibold text-cream transition-transform duration-150 active:scale-[0.97]"
            >
              {m.cta.label} <i className="ri-arrow-right-up-line" aria-hidden />
            </a>
          ) : (
            <button
              onClick={onDrawer}
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold ring-1 ring-current transition-transform duration-150 active:scale-[0.97]"
            >
              {m.cta.label} <i className="ri-arrow-right-line" aria-hidden />
            </button>
          ))}
      </div>
    </div>
  )
}

export function Day() {
  const ref = useRef<HTMLElement>(null)
  const [drawer, setDrawer] = useState(false)
  const closeDrawer = useCallback(() => setDrawer(false), [])
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const stops = moments.map((_, i) => i / (moments.length - 1))
  const bg = useTransform(scrollYProgress, stops, skies)
  const color = useTransform(scrollYProgress, stops, inks)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(moments.length - 1, Math.max(0, Math.round(v * (moments.length - 1)))))
  })

  return (
    <motion.section id="giornata" ref={ref} style={{ backgroundColor: bg, color }} className="relative px-5 sm:px-12 lg:px-20">
      <div className="pt-24 sm:pt-32">
        <Kicker>Kick back</Kicker>
        <h2 className="mt-5 max-w-4xl font-display font-soft text-[clamp(2.8rem,7vw,6.4rem)] font-medium leading-none tracking-tight">
          Una giornata da Braciami.
        </h2>
        <p className="mt-5 max-w-lg text-lg opacity-70">Dalla colazione alle stelle, senza prendere la macchina.</p>
      </div>

      <div className="relative grid md:grid-cols-[13rem_1fr] lg:grid-cols-[17rem_1fr]">
        <div className="hidden md:block">
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center">
            <div className="relative h-[1.1em] overflow-hidden font-display text-[clamp(3.4rem,6vw,5.6rem)] italic leading-none tabular-nums">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={moments[active].time}
                  className="absolute inset-0"
                  initial={{ transform: 'translateY(100%)', opacity: 0 }}
                  animate={{ transform: 'translateY(0%)', opacity: 1 }}
                  exit={{ transform: 'translateY(-100%)', opacity: 0 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                >
                  {moments[active].time}
                </motion.span>
              </AnimatePresence>
            </div>
            <ol className="mt-8 space-y-2 text-sm">
              {moments.map((m, i) => (
                <li key={m.time} className="flex items-center gap-3 transition-opacity duration-300" style={{ opacity: i === active ? 1 : 0.35 }}>
                  <span className="h-px bg-current transition-[width] duration-300" style={{ width: i === active ? 28 : 12 }} />
                  {m.time}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="pb-24">
          {moments.map((m, i) => (
            <MomentBlock key={m.time} m={m} i={i} onDrawer={() => setDrawer(true)} />
          ))}
        </div>
      </div>
      <ExperienceDrawer open={drawer} onClose={closeDrawer} />
    </motion.section>
  )
}
