import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { giftCards } from '../data/site'
import { FadeIn, Kicker, Logo, RiseText } from '../components/ui'

function TiltCard({ card, i }: { card: (typeof giftCards)[number]; i: number }) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [10, -10]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(px, [0, 1], [-12, 12]), { stiffness: 150, damping: 15 })
  const gx = useTransform(px, [0, 1], [0, 100])
  const gy = useTransform(py, [0, 1], [0, 100])
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 55%)`

  return (
    <FadeIn delay={i * 0.1} className="[perspective:1000px]">
      <motion.a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          px.set((e.clientX - r.left) / r.width)
          py.set((e.clientY - r.top) / r.height)
        }}
        onPointerLeave={() => {
          px.set(0.5)
          py.set(0.5)
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.98 }}
        className="group block"
      >
        <div
          className={`relative min-h-56 overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-5 text-cream sm:aspect-[1.6/1] sm:min-h-0 sm:p-6 shadow-2xl shadow-black/40 ring-1 ring-white/15 ${card.tone}`}
        >
          <div className="flex h-full min-h-46 flex-col justify-between gap-6 sm:min-h-0">
            <div className="flex items-start justify-between">
              <Logo className="h-12 w-auto" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] opacity-80">Gift card</span>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <span className="font-display text-[1.7rem] italic leading-tight sm:text-3xl">{card.name}</span>
              <span className="font-display text-4xl leading-none">€ {card.price}</span>
            </div>
          </div>
          <motion.div className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: glare }} />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <p className="text-cream/80">{card.text}</p>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold">
            Regala
            <i className="ri-arrow-right-up-line transition-transform duration-300 ease-out-strong group-hover:rotate-45" aria-hidden />
          </span>
        </div>
      </motion.a>
    </FadeIn>
  )
}

export function Gift() {
  return (
    <section id="regala" className="relative overflow-hidden bg-ember px-5 py-24 sm:px-12 sm:py-32 lg:px-20">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Kicker className="text-coal">Regala Braciami</Kicker>
          <RiseText
            as="h2"
            text="Una cena, una notte, o tutte e due."
            className="mt-5 block font-display font-soft text-[clamp(2.6rem,6.4vw,6rem)] font-medium leading-[0.98] tracking-tight"
          />
        </div>
        <p className="max-w-sm text-cream/85">Scegli il regalo e lo paghi online sul nostro negozio. Al resto pensiamo noi.</p>
      </div>
      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
        {giftCards.map((c, i) => (
          <TiltCard key={c.name} card={c} i={i} />
        ))}
      </div>
    </section>
  )
}
