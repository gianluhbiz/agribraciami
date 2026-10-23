import { useLocation } from 'react-router'
import { usePageTransition } from './transition-context'

export const sections = [
  { id: 'fuoco', label: 'Braceria', photo: 'braceria-hall' },
  { id: 'menu', label: 'Menu', photo: 'tavola-piatti', route: '/menu' },
  { id: 'camere', label: 'Camere', photo: 'suite-letto' },
  { id: 'giornata', label: 'Piscina ed esperienze', photo: 'piscina-collina' },
  { id: 'eventi', label: 'Sala Ash', photo: 'ash-sala-1' },
  { id: 'regala', label: 'Gift card', photo: 'colazione-letto' },
  { id: 'visita', label: 'Contatti', photo: 'neon' },
]

/** Scroll to a home anchor, or run the curtain back home first when on another page. */
export function useJump() {
  const { pathname } = useLocation()
  const { go } = usePageTransition()
  return (id: string, e?: React.MouseEvent) => {
    const route = sections.find((s) => s.id === id)?.route
    if (route) {
      go(route, 'Menu', e ? { x: e.clientX, y: e.clientY } : undefined)
      return
    }
    if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    else go(`/#${id}`, 'Braciami', e ? { x: e.clientX, y: e.clientY } : undefined)
  }
}
