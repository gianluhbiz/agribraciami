import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import { Photo } from '../components/ui'

const chapters = [
  {
    mark: "Anni '30",
    title: 'Prima c’era la fattoria',
    text: 'L’azienda agricola di famiglia alleva bovini, suini e cinghiali da quasi un secolo.',
    photo: 'ulivo-tramonto',
    alt: 'Ulivo al tramonto sul prato di Braciami',
  },
  {
    mark: '5 ettari',
    title: 'Monti Cimini alle spalle',
    text: 'Prati a più livelli e, nelle giornate limpide, il mare in fondo all’orizzonte.',
    photo: 'altalena-tramonto',
    alt: 'Altalena sul prato con vista fino al mare',
  },
  {
    mark: 'Senza catene',
    title: 'Grotte d’estate, stalle d’inverno',
    text: 'I bovini vivono all’aperto. D’estate dormono in grotte centenarie con ricoveri di paglia.',
    photo: 'peace-tramonto',
    alt: 'Tramonto sulla campagna della Tuscia',
  },
  {
    mark: "L'orto",
    title: 'Quello che c’è, quando c’è',
    text: 'Le verdure crescono a pochi metri dalla cucina e finiscono nei contorni e nelle zuppe.',
    photo: 'colazione-rose',
    alt: 'Colazione apparecchiata tra le rose del giardino',
  },
  {
    mark: '2015',
    title: 'Il maneggio diventa casa',
    text: 'La scuderia ora ospita le camere. La stalla è diventata la braceria.',
    photo: 'camere-esterno',
    alt: 'Le porte azzurre delle camere nella vecchia scuderia',
  },
  {
    mark: 'Ghisa',
    title: 'Dalla brace alla tavola',
    text: 'La carne arriva sulla ghisa ancora sfrigolante, con il pane bruscato accanto.',
    photo: 'braceria-parete',
    alt: 'Parete della braceria con quadri e divanetti',
  },
]

export function Origins() {
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const raw = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const x = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <section ref={ref} className="relative bg-cream text-coal" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex h-[80svh] w-max items-stretch gap-5 px-5 sm:gap-8 sm:px-12">
          <div className="flex w-[82vw] shrink-0 flex-col justify-between py-4 sm:w-[38vw] lg:w-[30vw]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-ember">Dalla terra alla brace</p>
            <h2 className="font-display font-soft text-[clamp(2.8rem,6vw,5.6rem)] font-medium leading-[0.95] tracking-tight">
              Novant’anni di fattoria prima del primo piatto.
            </h2>
            <p className="flex items-center gap-3 text-sm text-coal/60">
              <i className="ri-arrow-down-line animate-bounce text-lg" aria-hidden />
              Continua a scorrere
            </p>
          </div>

          {chapters.map((c, i) => (
            <article
              key={c.mark}
              className={`relative flex h-[68svh] w-[78vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-coal text-cream sm:w-[46vw] lg:w-[34vw] ${
                i % 2 ? 'self-end' : 'self-start'
              }`}
            >
              <Photo name={c.photo} alt={c.alt} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/40 to-transparent" />
              <div className="relative mt-auto p-6 sm:p-8">
                <span className="font-display text-[clamp(2.6rem,5vw,4.4rem)] italic leading-none text-flame">{c.mark}</span>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">{c.title}</h3>
                <p className="mt-2 max-w-sm text-cream/80">{c.text}</p>
              </div>
            </article>
          ))}
          <div className="w-[6vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  )
}
