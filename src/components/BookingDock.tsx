import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { contact, links } from '../data/site'
import { easeOut } from '../lib/motion'

const options = [
  { label: 'Tavolo', long: 'Prenota un tavolo', note: 'Cena mer–dom, pranzo sab e dom', icon: 'ri-restaurant-2-line', href: links.table },
  { label: 'Camera', long: 'Prenota una camera', note: 'Qui risparmi il 20% rispetto a Booking', icon: 'ri-hotel-bed-line', href: links.rooms },
  { label: 'Piscina', long: 'Prenota la piscina', note: 'Giornata in piscina, da giugno a settembre', icon: 'ri-sun-line', href: links.pool },
]

/** Booking is always one tap away once the hero scrolls out of view. */
export function BookingDock() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > window.innerHeight * 0.7))

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !panel.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', close)
    window.addEventListener('keydown', close)
    return () => {
      window.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Phones: a thumb-reachable bar. */}
          <motion.nav
            key="bar"
            aria-label="Prenotazioni"
            className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-[1fr_1fr_1fr_auto] gap-1 rounded-full bg-coal/85 p-1.5 shadow-2xl shadow-black/50 ring-1 ring-cream/10 backdrop-blur-xl md:hidden"
            initial={{ transform: 'translateY(140%)' }}
            animate={{ transform: 'translateY(0%)' }}
            exit={{ transform: 'translateY(140%)' }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            {options.map((o, i) => (
              <a
                key={o.label}
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-12 flex-col items-center justify-center rounded-full text-[0.7rem] font-semibold leading-tight transition-transform duration-150 active:scale-95 ${
                  i === 0 ? 'bg-ember text-cream' : 'text-cream/85'
                }`}
              >
                <i className={`${o.icon} text-lg leading-none`} aria-hidden />
                {o.label}
              </a>
            ))}
            <a
              href={contact.phoneHref}
              aria-label="Chiama Braciami"
              className="grid size-12 place-items-center rounded-full bg-cream/10 transition-transform duration-150 active:scale-95"
            >
              <i className="ri-phone-line text-lg" aria-hidden />
            </a>
          </motion.nav>

          {/* Desktop: a pill that unfolds from its own corner. */}
          <motion.div
            key="pill"
            ref={panel}
            className="fixed bottom-6 right-6 z-40 hidden md:block"
            initial={{ opacity: 0, transform: 'translateY(20px) scale(0.96)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={{ opacity: 0, transform: 'translateY(20px) scale(0.96)' }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  className="absolute bottom-[calc(100%+0.75rem)] right-0 w-80 origin-bottom-right overflow-hidden rounded-3xl bg-cream p-2 text-coal shadow-2xl shadow-black/40"
                  initial={{ opacity: 0, transform: 'scale(0.92)' }}
                  animate={{ opacity: 1, transform: 'scale(1)' }}
                  exit={{ opacity: 0, transform: 'scale(0.95)', transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: easeOut }}
                >
                  {options.map((o) => (
                    <a
                      key={o.label}
                      href={o.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-2xl p-3 transition-colors duration-150 hover:bg-paper"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-coal text-cream transition-colors duration-200 group-hover:bg-ember">
                        <i className={`${o.icon} text-lg`} aria-hidden />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{o.long}</span>
                        <span className="block text-xs text-coal/60">{o.note}</span>
                      </span>
                      <i className="ri-arrow-right-up-line text-coal/40 transition-transform duration-200 group-hover:rotate-45" aria-hidden />
                    </a>
                  ))}
                  <a
                    href={contact.phoneHref}
                    className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-paper p-3 text-sm font-medium"
                  >
                    <i className="ri-phone-line" aria-hidden /> {contact.phone}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="flex min-h-14 items-center gap-3 rounded-full bg-ember py-2 pl-6 pr-2 font-semibold text-cream shadow-xl shadow-ember/30 transition-transform duration-150 active:scale-[0.97]"
            >
              Prenota
              <span className="grid size-10 place-items-center rounded-full bg-coal/25">
                <motion.i
                  className="ri-add-line text-xl"
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: easeOut }}
                  aria-hidden
                />
              </span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
