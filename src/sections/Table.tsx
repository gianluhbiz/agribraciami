import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Kicker, Photo, RiseText } from '../components/ui'
import { easeOut } from '../lib/motion'
import { useMediaQuery } from '../lib/hooks'

type Snap = { name: string; caption: string; x: number; y: number; r: number; w: number; tall?: boolean }

const snaps: Snap[] = [
  { name: 'neon', caption: 'L’insegna, appena fa buio', x: 4, y: 8, r: -7, w: 19 },
  { name: 'ravioli', caption: 'Ravioli tirati a mano', x: 25, y: 2, r: 4, w: 14, tall: true },
  { name: 'giradischi', caption: 'Il giradischi della sala', x: 43, y: 10, r: -3, w: 13, tall: true },
  { name: 'tavola-piatti', caption: 'Antipasti per tutto il tavolo', x: 60, y: 4, r: 6, w: 20 },
  { name: 'colazione-torte', caption: 'Colazione: torte di casa', x: 82, y: 12, r: -5, w: 13, tall: true },
  { name: 'ash-grammofono', caption: 'Sala Ash', x: 2, y: 48, r: 5, w: 13, tall: true },
  { name: 'uovo-gazzetta', caption: 'Uovo e Gazzetta', x: 18, y: 56, r: -4, w: 14, tall: true },
  { name: 'moto-rose', caption: 'Rose e una vecchia moto', x: 34, y: 50, r: 3, w: 20 },
  { name: 'scarpe-rosse', caption: 'Scarpe rosse, tappeto persiano', x: 56, y: 46, r: -6, w: 13, tall: true },
  { name: 'piscina', caption: 'La piscina salina', x: 71, y: 54, r: 4, w: 19 },
  { name: 'ash-cappelli', caption: 'Il muro dei cappelli', x: 88, y: 50, r: -3, w: 11, tall: true },
  { name: 'matrimoniale-4', caption: 'Camera Good Luck', x: 44, y: 76, r: -2, w: 17 },
  { name: 'colazione-letto', caption: 'Colazione a letto', x: 8, y: 80, r: 6, w: 12, tall: true },
  { name: 'tavolo-legno', caption: 'Il tavolo è pronto', x: 76, y: 80, r: -5, w: 12, tall: true },
]

function Polaroid({ s, onOpen, z, raise }: { s: Snap; onOpen: () => void; z: number; raise: () => void }) {
  const dragged = useRef(false)
  return (
    <motion.figure
      drag
      dragMomentum
      dragTransition={{ power: 0.25, timeConstant: 220 }}
      onDragStart={() => {
        dragged.current = true
        raise()
      }}
      onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
      onPointerDown={raise}
      onClick={() => !dragged.current && onOpen()}
      initial={{ opacity: 0, scale: 0.8, rotate: s.r * 3 }}
      whileInView={{ opacity: 1, scale: 1, rotate: s.r }}
      viewport={{ once: true, margin: '-10%' }}
      whileHover={{ scale: 1.04 }}
      whileDrag={{ scale: 1.08, rotate: 0, boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7)' }}
      transition={{ type: 'spring', duration: 0.7, bounce: 0.2 }}
      className="absolute cursor-grab touch-none bg-cream p-2 pb-10 shadow-xl shadow-black/50 active:cursor-grabbing"
      style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, zIndex: z }}
    >
      <Photo name={s.name} small alt={s.caption} className={s.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'} />
      <figcaption className="absolute inset-x-2 bottom-2.5 truncate font-display text-sm italic text-coal/80">{s.caption}</figcaption>
    </motion.figure>
  )
}

/**
 * Phones: a native scroll-snap strip. The browser owns the swipe, so it never
 * fights vertical scrolling and always lands on exactly one photo.
 */
function Strip({ onOpen }: { onOpen: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)

  const step = () => {
    const items = ref.current?.children
    if (!items || items.length < 2) return 1
    return (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft
  }
  const onScroll = () => {
    const el = ref.current
    if (el) setIdx(Math.min(snaps.length - 1, Math.max(0, Math.round(el.scrollLeft / step()))))
  }
  const to = (n: number) => ref.current?.scrollTo({ left: Math.max(0, Math.min(snaps.length - 1, n)) * step(), behavior: 'smooth' })

  return (
    <div className="mt-8">
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[11vw] py-6 sm:-mx-12"
      >
        {snaps.map((s, i) => (
          <figure
            key={s.name}
            onClick={() => onOpen(i)}
            className={`relative w-[78vw] max-w-sm shrink-0 snap-center snap-always bg-cream p-2.5 pb-12 shadow-2xl shadow-black/50 transition-transform duration-500 ease-out-strong ${
              i === idx ? 'scale-100 rotate-0' : `scale-[0.92] ${i % 2 ? 'rotate-3' : '-rotate-3'}`
            }`}
          >
            <Photo name={s.name} small alt={s.caption} className="aspect-[3/4]" />
            <figcaption className="absolute inset-x-3 bottom-3.5 truncate font-display text-base italic text-coal/80">{s.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-cream/60">
        <button
          onClick={() => to(idx - 1)}
          disabled={idx === 0}
          aria-label="Foto precedente"
          className="grid size-11 place-items-center rounded-full bg-cream/10 transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-30"
        >
          <i className="ri-arrow-left-line" aria-hidden />
        </button>
        <span className="min-w-14 text-center tabular-nums">
          {idx + 1} / {snaps.length}
        </span>
        <button
          onClick={() => to(idx + 1)}
          disabled={idx === snaps.length - 1}
          aria-label="Foto successiva"
          className="grid size-11 place-items-center rounded-full bg-cream/10 transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-30"
        >
          <i className="ri-arrow-right-line" aria-hidden />
        </button>
      </div>
    </div>
  )
}

export function Table() {
  const desktop = useMediaQuery('(min-width: 900px)')
  const [zs, setZs] = useState(() => snaps.map((_, i) => i + 1))
  const [top, setTop] = useState(snaps.length + 1)
  const [open, setOpen] = useState<number | null>(null)
  const raise = (i: number) => {
    setZs((z) => z.map((v, j) => (j === i ? top : v)))
    setTop((t) => t + 1)
  }

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o! + 1) % snaps.length)
      if (e.key === 'ArrowLeft') setOpen((o) => (o! - 1 + snaps.length) % snaps.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section className="relative overflow-hidden bg-soot px-5 py-24 sm:px-12 lg:py-28">
      <div className="pointer-events-none relative z-0 mx-auto max-w-3xl text-center">
        <Kicker className="justify-center text-flame">Fuori dalla cartolina</Kicker>
        <RiseText
          as="h2"
          text="Il tavolo, visto dall’alto."
          className="mt-5 block font-display font-soft text-[clamp(2.4rem,6vw,5.4rem)] font-medium leading-none tracking-tight"
        />
        <p className="mt-5 text-cream/60">
          {desktop ? 'Trascina le foto, spostale, toccale per ingrandirle.' : 'Scorri le foto di lato, toccale per ingrandirle.'}
        </p>
      </div>

      {desktop ? (
        <div className="relative mx-auto mt-10 h-[min(115vh,1100px)] max-w-[1500px]">
          {snaps.map((s, i) => (
            <Polaroid key={s.name} s={s} z={zs[i]} raise={() => raise(i)} onOpen={() => setOpen(i)} />
          ))}
        </div>
      ) : (
        <Strip onOpen={setOpen} />
      )}

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-coal/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal
            aria-label={snaps[open].caption}
          >
            <motion.figure
              key={open}
              className="relative max-h-[85vh] max-w-5xl"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: easeOut }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/img/${snaps[open].name}.webp`}
                alt={snaps[open].caption}
                className="max-h-[78vh] w-auto rounded-2xl object-contain"
              />
              <figcaption className="mt-3 flex items-center justify-between gap-4 font-display text-lg italic text-cream/80">
                {snaps[open].caption}
                <span className="flex gap-2 font-sans not-italic">
                  <button
                    aria-label="Foto precedente"
                    onClick={() => setOpen((open - 1 + snaps.length) % snaps.length)}
                    className="grid size-11 place-items-center rounded-full bg-cream/10 hover:bg-cream/20"
                  >
                    <i className="ri-arrow-left-line" aria-hidden />
                  </button>
                  <button
                    aria-label="Foto successiva"
                    onClick={() => setOpen((open + 1) % snaps.length)}
                    className="grid size-11 place-items-center rounded-full bg-cream/10 hover:bg-cream/20"
                  >
                    <i className="ri-arrow-right-line" aria-hidden />
                  </button>
                </span>
              </figcaption>
            </motion.figure>
            <button
              aria-label="Chiudi"
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-cream/10 text-xl hover:bg-cream/20"
            >
              <i className="ri-close-line" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
