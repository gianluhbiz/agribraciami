import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { menu, season } from '../data/menu'
import { Cta, FadeIn, Kicker, Photo, RiseText } from '../components/ui'
import { easeOut } from '../lib/motion'
import { euro } from '../lib/hooks'
import { usePageTransition } from '../lib/transition-context'

const cuts = menu.find((s) => s.id === 'tagli')!.items.filter((d) => d.byWeight)

const count = (ids: string[]) => menu.filter((s) => ids.includes(s.id)).reduce((n, s) => n + s.items.length, 0)

const rows = [
  { id: 'tartare', n: count(['tartare']), label: 'tartare battute al coltello', photo: 'tavola-piatti' },
  { id: 'primi', n: count(['primi']), label: 'primi di pasta tirata a mano', photo: 'ravioli' },
  { id: 'tagliate', n: count(['tagli', 'tagliate', 'brace']), label: 'piatti di carne alla brace', photo: 'brace-fiamme' },
  { id: 'burger', n: count(['burger']), label: 'burger nel nostro panino', photo: 'braceria-hall' },
  { id: 'bianchi', n: count(['bianchi', 'mezze-bianche', 'rossi', 'mezze-rosse', 'rose', 'bollicine', 'passiti']), label: 'etichette, tutte del Lazio', photo: 'ash-vini' },
]

function AnimatedPrice({ value }: { value: number }) {
  const mv = useSpring(value, { stiffness: 180, damping: 26 })
  const text = useTransform(mv, (v) => euro(Math.round(v * 2) / 2))
  useEffect(() => mv.set(value), [mv, value])
  return <motion.span>{text}</motion.span>
}

export function MenuTeaser() {
  const [cut, setCut] = useState(0)
  const [grams, setGrams] = useState(1200)
  const [hover, setHover] = useState<number | null>(null)
  const { go } = usePageTransition()
  const area = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 260, damping: 28 })
  const sy = useSpring(my, { stiffness: 260, damping: 28 })

  const c = cuts[cut]
  const min = c.byWeight!.minG
  const g = Math.max(grams, min)
  const price = (g / 100) * c.byWeight!.perEtto

  const open = (e: React.MouseEvent, hash = '') => go(`/menu${hash}`, 'Menu', { x: e.clientX, y: e.clientY })

  return (
    <section id="menu" className="relative overflow-hidden bg-coal px-5 py-24 sm:px-12 sm:py-32 lg:px-20">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Kicker className="text-flame">Menu {season}</Kicker>
          <RiseText
            as="h2"
            text="Pesa la fiorentina prima di sederti."
            className="mt-6 block font-display font-soft text-[clamp(2.6rem,5.6vw,5.4rem)] font-medium leading-[0.98] tracking-tight"
          />
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/70">
              I tagli nobili si pagano a peso. Scegli quanto ne vuoi e vedi subito il prezzo, come al bancone.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-10 rounded-[2rem] bg-soot p-5 ring-1 ring-cream/10 sm:p-8">
            <div role="tablist" aria-label="Taglio" className="relative inline-flex rounded-full bg-coal p-1">
              {cuts.map((d, i) => (
                <button
                  key={d.name}
                  role="tab"
                  aria-selected={cut === i}
                  onClick={() => setCut(i)}
                  className="relative min-h-11 rounded-full px-5 text-sm font-semibold"
                >
                  {cut === i && (
                    <motion.span
                      layoutId="cut-pill"
                      className="absolute inset-0 rounded-full bg-ember"
                      transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative">{d.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Peso</p>
                <p className="font-display text-5xl italic tabular-nums sm:text-6xl">
                  {(g / 1000).toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} kg
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Al tavolo</p>
                <p className="font-display text-5xl italic tabular-nums text-flame sm:text-6xl">
                  <AnimatedPrice value={price} />
                </p>
              </div>
            </div>

            <label className="mt-6 block">
              <span className="sr-only">Peso in grammi</span>
              <input
                type="range"
                min={min}
                max={2000}
                step={50}
                value={g}
                onChange={(e) => setGrams(Number(e.target.value))}
                className="h-11 w-full cursor-grab accent-ember active:cursor-grabbing"
              />
            </label>
            <p className="mt-2 flex justify-between text-xs text-cream/50">
              <span>
                {c.desc} € {c.price}
              </span>
              <span>Servizio € 2,5</span>
            </p>
          </FadeIn>
        </div>

        <div
          ref={area}
          className="relative"
          onPointerMove={(e) => {
            const r = area.current!.getBoundingClientRect()
            mx.set(e.clientX - r.left)
            my.set(e.clientY - r.top)
          }}
        >
          <ul className="border-t border-cream/15">
            {rows.map((r, i) => (
              <li key={r.id}>
                <button
                  onClick={(e) => open(e, `#${r.id}`)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  className="group flex w-full items-baseline gap-5 border-b border-cream/15 py-6 text-left sm:py-7"
                >
                  <span className="w-20 shrink-0 font-display text-5xl italic tabular-nums text-flame transition-transform duration-300 ease-out-strong group-hover:-translate-y-1 sm:w-24 sm:text-6xl">
                    {r.n}
                  </span>
                  <span className="flex-1 text-xl leading-snug text-cream/85 transition-colors duration-200 group-hover:text-cream sm:text-2xl">
                    {r.label}
                  </span>
                  <i
                    className="ri-arrow-right-line text-xl text-cream/40 transition-transform duration-300 ease-out-strong group-hover:translate-x-1 group-hover:text-flame"
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ul>

          <AnimatePresence>
            {hover !== null && (
              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-10 hidden h-56 w-44 overflow-hidden rounded-2xl shadow-2xl shadow-black/60 lg:block"
                style={{ x: sx, y: sy, translateX: '-50%', translateY: '-110%' }}
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25, ease: easeOut }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={rows[hover].photo}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Photo name={rows[hover].photo} small alt="" className="h-full w-full" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <FadeIn className="mt-10 flex flex-wrap items-center gap-4">
            <Cta onClick={(e) => open(e)} icon="ri-book-open-line">
              Apri il menu completo
            </Cta>
            <span className="text-sm text-cream/50">Senza PDF da scaricare. Filtri per glutine, lattosio e piatti vegetariani.</span>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
