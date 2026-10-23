import { createContext, useContext } from 'react'

export type TransitionCtx = {
  go: (to: string, label: string, origin?: { x: number; y: number }) => void
  /** True while the curtain hides the page, so entering pages can wait before animating. */
  covering: boolean
}

export const TransitionContext = createContext<TransitionCtx>({ go: () => {}, covering: false })

export const usePageTransition = () => useContext(TransitionContext)
