import { useEffect, useState, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** 0 = Sunday ... 6 = Saturday, in the restaurant's time zone. */
function romeWeekday(date: Date) {
  const name = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Rome' }).format(date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(name)
}

export const weekDays = [
  { day: 1, label: 'Lunedì', service: null },
  { day: 2, label: 'Martedì', service: null },
  { day: 3, label: 'Mercoledì', service: 'Cena' },
  { day: 4, label: 'Giovedì', service: 'Cena' },
  { day: 5, label: 'Venerdì', service: 'Cena' },
  { day: 6, label: 'Sabato', service: 'Pranzo e cena' },
  { day: 0, label: 'Domenica', service: 'Pranzo e cena' },
] as const

export type OpenStatus = { open: boolean; today: number; short: string; long: string }

export function getOpenStatus(date = new Date()): OpenStatus {
  const today = romeWeekday(date)
  if (today === 1 || today === 2) {
    return {
      open: false,
      today,
      short: 'Oggi chiusi',
      long: 'Oggi siamo chiusi. Riapriamo mercoledì a cena.',
    }
  }
  if (today === 6 || today === 0) {
    return { open: true, today, short: 'Oggi pranzo e cena', long: 'Oggi siamo aperti a pranzo e a cena.' }
  }
  return { open: true, today, short: 'Stasera aperti', long: 'Stasera siamo aperti a cena.' }
}

export function useOpenStatus() {
  const [status, setStatus] = useState(() => getOpenStatus())
  useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus()), 60_000)
    return () => clearInterval(id)
  }, [])
  return status
}

export const euro = (n: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n)
