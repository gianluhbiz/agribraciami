import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { amenities, links, rooms, stayInfo } from '../data/site'
import { Cta, FadeIn, Kicker, Photo, RiseText } from '../components/ui'
import { easeOut } from '../lib/motion'

function KeyTag({ i, active, onSelect }: { i: number; active: boolean; onSelect: () => void }) {
  const r = rooms[i]
  return (
    <motion.button
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`Camera ${r.name}`}
      className="group relative flex flex-col items-center outline-none"
      style={{ originY: 0 }}
      initial={{ rotate: (i % 2 ? 1 : -1) * 14 }}
      whileInView={{ rotate: 0 }}
      viewport={{ once: true }}
      whileHover={{ rotate: [0, -7, 5, -2, 0], transition: { duration: 1.1 } }}
      transition={{ type: 'spring', stiffness: 60, damping: 6, delay: i * 0.08 }}
    >
      <span className="h-6 w-px bg-coal/40 sm:h-10" />
      <span className="-mt-1 size-4 rounded-full border-2 border-coal/50 sm:size-5" />
      <motion.span
        animate={{ y: active ? 14 : 0 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.35 }}
        className={`-mt-1.5 flex h-32 w-[20vw] max-w-28 flex-col items-center justify-between rounded-t-[3rem] rounded-b-[1.2rem] px-2 pb-4 pt-3 shadow-lg transition-colors duration-300 sm:h-44 ${
          active ? 'bg-ember text-cream shadow-ember/30' : 'bg-coal text-cream group-hover:bg-ash'
        }`}
      >
        <span className="size-3 rounded-full bg-cream ring-2 ring-black/20" />
        <span className="font-display text-4xl italic leading-none sm:text-5xl">{r.tag}</span>
        <span className="max-w-full truncate text-[0.52rem] font-semibold uppercase tracking-normal sm:text-[0.7rem] sm:tracking-[0.18em]">{r.name}</span>
      </motion.span>
    </motion.button>
  )
}

export function Rooms() {
  const [sel, setSel] = useState(3)
  const [shot, setShot] = useState(0)
  const [info, setInfo] = useState<number | null>(null)
  const r = rooms[sel]

  const pick = (i: number) => {
    setSel(i)
    setShot(0)
  }

  return (
    <section id="camere" className="relative bg-cream px-5 py-24 text-coal sm:px-12 sm:py-32 lg:px-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Kicker className="text-ember">Sleep · la vecchia scuderia</Kicker>
          <RiseText
            as="h2"
            text="Scegli una chiave."
            className="mt-5 block font-display font-soft text-[clamp(2.8rem,7vw,6.4rem)] font-medium leading-none tracking-tight"
          />
          <FadeIn delay={0.15}>
            <p className="mt-5 max-w-lg text-lg text-coal/70">
              Sette camere con il soffitto in legno, dove prima c’erano i cavalli. Colazione inclusa, piscina salina e un
              salotto comune con tisane e giochi in scatola.
            </p>
          </FadeIn>
        </div>
        <FadeIn
          delay={0.2}
          className="flex items-center gap-3 self-start rounded-2xl bg-coal px-5 py-4 text-cream lg:self-end"
        >
          <i className="ri-price-tag-3-line text-2xl text-flame" aria-hidden />
          <p className="text-sm leading-snug">
            <strong className="block text-base">Miglior prezzo qui</strong>
            Prenotando dal sito spendi il 20% in meno che su Booking.
          </p>
        </FadeIn>
      </div>

      <div className="relative mt-12 border-t-[3px] border-coal/80">
        <div className="flex justify-around sm:justify-start sm:gap-12 sm:pl-10">
          {rooms.map((room, i) => (
            <KeyTag key={room.id} i={i} active={sel === i} onSelect={() => pick(i)} />
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-paper">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={r.photos[shot] + sel}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(0 0 0 100%)' }}
                animate={{ clipPath: 'inset(0 0 0 0%)' }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
              >
                <Photo name={r.photos[shot]} alt={`Camera ${r.name}`} className="h-full w-full" />
              </motion.div>
            </AnimatePresence>
            <span className="absolute left-4 top-4 rounded-full bg-coal/70 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur-md">
              {shot + 1} / {r.photos.length}
            </span>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {r.photos.map((p, i) => (
              <button
                key={p}
                onClick={() => setShot(i)}
                aria-label={`Foto ${i + 1}`}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-[opacity,transform] duration-200 active:scale-95 sm:h-20 sm:w-28 ${
                  shot === i ? 'opacity-100 ring-2 ring-ember ring-offset-2 ring-offset-cream' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Photo name={p} small alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={r.id}
            initial={{ opacity: 0, transform: 'translateY(16px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="flex flex-col"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-5xl italic sm:text-6xl">{r.name}</h3>
              <p className="text-right text-sm text-coal/60">
                da <span className="font-display text-4xl not-italic text-coal">€ {r.price}</span>
                <span className="block">a notte</span>
              </p>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-coal/75">{r.blurb}</p>

            <dl className="mt-6 grid grid-cols-3 divide-x divide-coal/15 rounded-2xl bg-paper py-4 text-center">
              {[
                ['Superficie', `${r.sqm} mq`],
                ['Ospiti', String(r.guests)],
                ['Letti', r.beds],
              ].map(([k, v]) => (
                <div key={k} className="px-2">
                  <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-coal/50">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-tight">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-5 flex flex-wrap gap-2">
              {r.features.map((f) => (
                <li key={f} className="rounded-full bg-coal px-3.5 py-1.5 text-xs font-medium text-cream">
                  {f}
                </li>
              ))}
            </ul>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-coal/70 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {amenities.map((a) => (
                <li key={a.label} className="flex items-center gap-2">
                  <i className={`${a.icon} text-base text-ember`} aria-hidden />
                  {a.label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href={links.room(r.octorate)} external icon="ri-calendar-check-line">
                Verifica le date
              </Cta>
              <Cta href={links.rooms} external variant="cream" className="ring-1 ring-coal/15" icon="ri-hotel-bed-line">
                Tutte le camere
              </Cta>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-16 border-t border-coal/15">
        {stayInfo.map((s, i) => (
          <div key={s.title} className="border-b border-coal/15">
            <button
              onClick={() => setInfo(info === i ? null : i)}
              aria-expanded={info === i}
              className="flex min-h-16 w-full items-center justify-between gap-4 text-left text-lg font-medium"
            >
              {s.title}
              <motion.i
                className="ri-add-line text-2xl text-ember"
                animate={{ rotate: info === i ? 45 : 0 }}
                transition={{ duration: 0.2, ease: easeOut }}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {info === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="overflow-hidden"
                >
                  <ul className="grid gap-2 pb-6 text-coal/70 sm:grid-cols-2">
                    {s.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ember" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
