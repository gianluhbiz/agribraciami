import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { contact, links } from '../data/site'
import { useOpenStatus } from '../lib/hooks'
import { sections, useJump } from '../lib/nav'
import { Logo, Photo } from './ui'
import { easeInOut, easeOut } from '../lib/motion'

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const jump = useJump()
  const status = useOpenStatus()
  const { pathname } = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 240 && !open)
    setSolid(y > 40)
  })

  // Sticky bars elsewhere read this to sit below the header while it is visible.
  useEffect(() => {
    document.documentElement.dataset.nav = hidden ? 'hidden' : 'shown'
  }, [hidden])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const home = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
    else jump('top', e)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ transform: hidden ? 'translateY(-110%)' : 'translateY(0%)' }}
        transition={{ duration: 0.35, ease: easeOut }}
      >
        <div
          className={`mx-auto flex items-center justify-between gap-4 px-4 py-3 transition-[background-color,backdrop-filter] duration-300 sm:px-8 ${
            solid ? 'bg-coal/70 backdrop-blur-xl' : 'bg-transparent'
          }`}
        >
          <a href="/" onClick={home} className="relative z-10 shrink-0" aria-label="Braciami, torna all'inizio">
            <Logo className="h-9 w-auto sm:h-11" />
          </a>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Sezioni">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={(e) => jump(s.id, e)}
                className="rounded-full px-3.5 py-2 text-[0.8rem] font-medium text-cream/80 transition-colors duration-200 hover:bg-cream/10 hover:text-cream"
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-cream/5 px-3 py-2 text-xs text-cream/75 ring-1 ring-cream/10 md:flex">
              <span className={`size-1.5 rounded-full ${status.open ? 'bg-[#7bd88f]' : 'bg-smoke'}`} />
              {status.short}
            </span>
            <a
              href={links.table}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-10 items-center rounded-full bg-ember px-5 text-sm font-semibold transition-transform duration-150 active:scale-[0.97] sm:inline-flex"
            >
              Prenota un tavolo
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Chiudi menu' : 'Apri menu'}
              className="grid size-11 place-items-center rounded-full bg-cream/10 ring-1 ring-cream/15 backdrop-blur-md transition-transform duration-150 active:scale-95 xl:hidden"
            >
              <i className={`${open ? 'ri-close-line' : 'ri-menu-4-line'} text-xl`} aria-hidden />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[45] flex flex-col bg-coal px-5 pb-8 pt-24"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.35, ease: easeInOut } }}
            transition={{ duration: 0.55, ease: easeInOut }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, transform: 'translateY(24px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: easeOut }}
                >
                  <button
                    onClick={(e) => {
                      setOpen(false)
                      setTimeout(() => jump(s.id, e), s.route ? 0 : 350)
                    }}
                    className="flex w-full items-center gap-4 py-2 text-left"
                  >
                    <Photo name={s.photo} small alt="" className="size-12 shrink-0 rounded-full" />
                    <span className="font-display font-soft text-[2.1rem] leading-none">{s.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="grid grid-cols-2 gap-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href={contact.phoneHref} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-cream/10">
                <i className="ri-phone-line" aria-hidden /> Chiama
              </a>
              <a
                href={links.table}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ember font-semibold"
              >
                Prenota un tavolo
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
