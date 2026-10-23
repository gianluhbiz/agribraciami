import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { links, rating, reviews } from '../data/site'
import { FadeIn, Kicker } from '../components/ui'
import { easeOut } from '../lib/motion'

export function Voices() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const r = reviews[i]
  const next = () => setI((v) => (v + 1) % reviews.length)
  const prev = () => setI((v) => (v - 1 + reviews.length) % reviews.length)

  useEffect(() => {
    if (paused || reduce) return
    const id = setTimeout(next, 7000)
    return () => clearTimeout(id)
  }, [i, paused, reduce])

  return (
    <section
      className="relative overflow-hidden bg-paper px-5 py-24 text-coal sm:px-12 sm:py-32 lg:px-20"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <FadeIn>
          <Kicker className="text-ember">Chi è già passato</Kicker>
          <p className="mt-8 font-display text-[clamp(6rem,16vw,12rem)] italic leading-[0.8] tracking-tight">{rating.score}</p>
          <div className="mt-4 flex gap-1 text-2xl text-ember" aria-label={`${rating.score} su 5`}>
            {[0, 1, 2, 3].map((s) => (
              <i key={s} className="ri-star-fill" aria-hidden />
            ))}
            <i className="ri-star-half-fill" aria-hidden />
          </div>
          <p className="mt-4 max-w-xs text-coal/70">
            {rating.count} recensioni su Tripadvisor. N. {rating.rank} su {rating.of} ristoranti a Viterbo.
          </p>
          <a
            href={links.tripadvisor}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-ember decoration-2 underline-offset-4"
          >
            Leggile tutte <i className="ri-arrow-right-up-line" aria-hidden />
          </a>
        </FadeIn>

        <div className="flex flex-col justify-between" aria-live="polite">
          <i className="ri-double-quotes-l text-6xl text-ember" aria-hidden />
          <div className="relative min-h-[16rem] sm:min-h-[15rem]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, filter: 'blur(8px)', transform: 'translateY(16px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, ease: easeOut }}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-coal/50">{r.title}</p>
                <p className="mt-4 font-display font-soft text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[1.2]">{r.text}</p>
                <footer className="mt-6 text-sm text-coal/60">
                  <strong className="text-coal">{r.author}</strong> su {r.source}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <button onClick={prev} aria-label="Recensione precedente" className="grid size-12 place-items-center rounded-full ring-1 ring-coal/20 transition-colors hover:bg-coal hover:text-cream active:scale-95">
              <i className="ri-arrow-left-line" aria-hidden />
            </button>
            <button onClick={next} aria-label="Recensione successiva" className="grid size-12 place-items-center rounded-full ring-1 ring-coal/20 transition-colors hover:bg-coal hover:text-cream active:scale-95">
              <i className="ri-arrow-right-line" aria-hidden />
            </button>
            <div className="ml-2 flex flex-1 gap-1.5">
              {reviews.map((_, j) => (
                <button key={j} onClick={() => setI(j)} aria-label={`Recensione ${j + 1} di ${reviews.length}`} className="h-11 flex-1">
                  <span className="relative block h-0.5 overflow-hidden rounded-full bg-coal/15">
                    {j === i && (
                      <motion.span
                        key={`${i}-${paused}`}
                        className="absolute inset-0 origin-left bg-ember"
                        initial={{ scaleX: paused || reduce ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: paused || reduce ? 0 : 7, ease: 'linear' }}
                      />
                    )}
                    {j < i && <span className="absolute inset-0 bg-coal/40" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
