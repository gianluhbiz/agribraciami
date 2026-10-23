import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { TransitionContext, type TransitionCtx } from './transition-context'

type Curtain = { to: string; x: number; y: number; label: string; phase: 'cover' | 'reveal' }

const ease = [0.77, 0, 0.175, 1] as const

/**
 * Route changes run behind a curtain: an ember circle grows from the click point,
 * the route swaps while the screen is covered, then the curtain slides up.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [curtain, setCurtain] = useState<Curtain | null>(null)
  const busy = useRef(false)

  const go = useCallback<TransitionCtx['go']>(
    (to, label, origin) => {
      if (busy.current) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        navigate(to)
        window.scrollTo(0, 0)
        return
      }
      busy.current = true
      setCurtain({
        to,
        label,
        x: origin?.x ?? window.innerWidth / 2,
        y: origin?.y ?? window.innerHeight / 2,
        phase: 'cover',
      })
    },
    [navigate],
  )

  const onCovered = () => {
    if (!curtain || curtain.phase !== 'cover') return
    const hash = curtain.to.split('#')[1]
    navigate(curtain.to.startsWith('#') ? '/' + curtain.to : curtain.to)
    requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash) : null
      if (target) target.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
      else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      setTimeout(() => setCurtain((c) => (c ? { ...c, phase: 'reveal' } : c)), 380)
    })
  }

  return (
    <TransitionContext.Provider value={{ go, covering: curtain?.phase === 'cover' }}>
      {children}
      <AnimatePresence onExitComplete={() => (busy.current = false)}>
        {curtain && curtain.phase === 'cover' && (
          <motion.div
            key="curtain"
            aria-hidden
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ember"
            initial={{ clipPath: `circle(0% at ${curtain.x}px ${curtain.y}px)` }}
            animate={{ clipPath: `circle(150% at ${curtain.x}px ${curtain.y}px)` }}
            exit={{ transform: 'translateY(-100%)' }}
            transition={{ duration: 0.75, ease }}
            onAnimationComplete={onCovered}
          >
            <motion.span
              className="font-display font-soft text-[clamp(3rem,12vw,10rem)] italic leading-none text-cream"
              initial={{ opacity: 0, transform: 'translateY(30px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              {curtain.label}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}
