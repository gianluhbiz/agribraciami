import { motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { Photo } from '../components/ui'

const frames = [
  { name: 'braceria-sala', alt: 'La braceria: pareti di mattoncini bianchi piene di quadri' },
  { name: 'giardino-inverno', alt: 'Il giardino d’inverno apparecchiato' },
  { name: 'tavola-piatti', alt: 'Tavola dall’alto con antipasti, hamburger e vino rosso' },
  { name: 'braceria-hall', alt: 'La sala lunga della braceria con i tavoli in legno' },
]

const lines = ['Sale grosso,', 'olio e rosmarino.', 'Mi passi il vino?']

/** Deterministic pseudo random so embers render the same every time. */
const rand = (i: number, s: number) => {
  const x = Math.sin(i * 9301 + s * 49297) * 233280
  return x - Math.floor(x)
}

export function Embers({ count = 22 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute bottom-[-10px] block animate-rise rounded-full bg-flame"
          style={
            {
              left: `${rand(i, 1) * 100}%`,
              width: 2 + rand(i, 2) * 4,
              height: 2 + rand(i, 2) * 4,
              animationDuration: `${5 + rand(i, 3) * 7}s`,
              animationDelay: `${-rand(i, 4) * 10}s`,
              boxShadow: '0 0 10px 2px rgba(255,138,61,0.7)',
              '--drift': `${(rand(i, 5) - 0.5) * 160}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

function Frame({ i, progress, name, alt }: { i: number; progress: MotionValue<number>; name: string; alt: string }) {
  const step = 1 / frames.length
  const start = i * step
  const last = i === frames.length - 1
  // Scroll offsets must stay inside [0, 1] or the accelerated scroll timeline throws.
  const opacity = useTransform(
    progress,
    i === 0 ? [0, step, step + 0.05] : last ? [start - 0.05, start, 1] : [start - 0.05, start, start + step, start + step + 0.05],
    i === 0 ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0],
  )
  const scale = useTransform(progress, [Math.max(0, start - 0.1), Math.min(1, start + step + 0.1)], [1.15, 1])
  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale }}>
      <Photo name={name} alt={alt} className="h-full w-full" />
    </motion.div>
  )
}

function Line({ text, i, progress }: { text: string; i: number; progress: MotionValue<number> }) {
  const a = 0.08 + i * 0.12
  const opacity = useTransform(progress, [a, a + 0.08], [0, 1])
  const y = useTransform(progress, [a, a + 0.1], [60, 0])
  const blur = useTransform(progress, [a, a + 0.08], [12, 0])
  const filter = useMotionTemplate`blur(${blur}px)`
  return (
    <motion.span className="block" style={{ opacity, y, filter }}>
      {text}
    </motion.span>
  )
}

export function Fire() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const inset = useTransform(scrollYProgress, [0, 0.3], [14, 0])
  const radius = useTransform(scrollYProgress, [0, 0.3], [32, 0])
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`
  const shade = useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [0.3, 0.6, 0.62, 0.85])
  const bodyOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1])
  const bodyY = useTransform(scrollYProgress, [0.5, 0.62], [40, 0])
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="fuoco" ref={ref} className="relative h-[380vh] bg-coal">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          {frames.map((f, i) => (
            <Frame key={f.name} i={i} progress={scrollYProgress} {...f} />
          ))}
          <motion.div className="absolute inset-0 bg-coal" style={{ opacity: shade }} />
          <div className="absolute inset-0 bg-gradient-to-r from-coal/85 via-coal/40 to-transparent" />
          <Embers />
        </motion.div>

        <div className="relative flex h-full flex-col justify-center px-5 sm:px-12 lg:px-20">
          <p className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-flame">La braceria</p>
          <h2 className="font-display font-soft text-[clamp(3rem,9.5vw,9rem)] font-medium italic leading-[0.92] tracking-tight text-cream">
            {lines.map((l, i) => (
              <Line key={l} text={l} i={i} progress={scrollYProgress} />
            ))}
          </h2>

          <motion.div
            className="mt-10 grid max-w-4xl gap-6 text-cream/90 sm:grid-cols-[1.3fr_1fr] sm:gap-12"
            style={{ opacity: bodyOpacity, y: bodyY }}
          >
            <p className="text-lg leading-relaxed sm:text-xl">
              Una ex stalla di mattoncini bianchi. Il braciere sta al centro, la cucina è a vista, e ogni piatto prende
              l’odore del fuoco.
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ['Km 0', 'carne dalla nostra azienda agricola'],
                ['A mano', 'tutta la pasta, ogni giorno'],
                ['Lazio', 'l’intera carta dei vini'],
                ['Stagione', 'il menu segue le stagioni'],
              ].map(([k, v]) => (
                <li key={k} className="border-t border-cream/20 pt-3">
                  <span className="block font-display text-2xl italic text-flame">{k}</span>
                  <span className="text-cream/70">{v}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-5 right-5 h-px bg-cream/15 sm:left-12 sm:right-12">
          <motion.div className="h-full origin-left bg-flame" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  )
}
