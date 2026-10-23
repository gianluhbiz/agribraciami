import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { contact } from '../data/site'
import { FadeIn, Kicker, Photo, RiseText } from '../components/ui'
import { useMediaQuery } from '../lib/hooks'
import { easeOut } from '../lib/motion'

const spots = [
  { x: 54, y: 20, title: 'La carrozza sospesa', text: 'Appesa alle travi, sopra la sala.' },
  { x: 20, y: 11, title: 'Il soffitto in legno', text: 'Travi a vista per tutta la lunghezza del loft.' },
  { x: 27, y: 42, title: 'La carta da parati', text: 'Fiori scuri, alla maniera di un vecchio salotto inglese.' },
  { x: 41, y: 47, title: 'L’american bar', text: 'Il bancone in fondo alla sala, per l’aperitivo e il dopo cena.' },
  { x: 73, y: 47, title: 'La vecchia farmacia', text: 'Vetrine e mobili recuperati da una farmacia d’epoca.' },
  { x: 64, y: 76, title: 'Mattonelle del ’600', text: 'Un tappeto di maioliche antiche al centro del pavimento.' },
]

const columnA = ['ash-tavolata', 'ash-camino', 'ash-porta']
const columnB = ['ash-giardino-inverno', 'ash-grammofono', 'ash-bar-2']

const eventTypes = ['Compleanno', 'Anniversario o matrimonio', 'Battesimo o comunione', 'Evento aziendale', 'Cena privata', 'Altro']

type Form = { nome: string; cognome: string; email: string; tipo: string; data: string; ospiti: string; note: string; news: boolean }

function QuoteForm() {
  const [f, setF] = useState<Form>({ nome: '', cognome: '', email: '', tipo: '', data: '', ospiti: '', note: '', news: false })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [sent, setSent] = useState(false)
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value })
  const errors = {
    email: !/^\S+@\S+\.\S+$/.test(f.email) ? 'Serve un’email valida per risponderti.' : '',
    tipo: !f.tipo ? 'Scegli il tipo di evento.' : '',
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, tipo: true })
    if (errors.email || errors.tipo) return
    const body = [
      `Nome: ${f.nome} ${f.cognome}`,
      `Email: ${f.email}`,
      `Evento: ${f.tipo}`,
      f.data && `Data: ${f.data}`,
      f.ospiti && `Ospiti: ${f.ospiti}`,
      f.note && `\n${f.note}`,
      f.news && '\nVorrei iscrivermi alla newsletter.',
    ]
      .filter(Boolean)
      .join('\n')
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Preventivo Sala Ash: ${f.tipo}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const field =
    'peer w-full rounded-2xl border-0 bg-cream/5 px-4 pb-2.5 pt-6 text-base text-cream ring-1 ring-cream/15 transition-shadow duration-200 placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-flame'
  const label =
    'pointer-events-none absolute left-4 top-2 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-cream/50'

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[420px] flex-col items-start justify-center rounded-[2rem] bg-cream/5 p-8 ring-1 ring-cream/10"
        >
          <i className="ri-mail-send-line text-4xl text-flame" aria-hidden />
          <p className="mt-4 font-display text-3xl italic">Richiesta pronta.</p>
          <p className="mt-3 max-w-sm text-cream/70">
            Abbiamo aperto la tua app di posta con tutti i dettagli. Premi invia e ti rispondiamo con un preventivo.
          </p>
          <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-flame underline underline-offset-4">
            Modifica la richiesta
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2" exit={{ opacity: 0 }}>
          <label className="relative">
            <input className={field} placeholder="Nome" autoComplete="given-name" value={f.nome} onChange={set('nome')} />
            <span className={label}>Nome</span>
          </label>
          <label className="relative">
            <input className={field} placeholder="Cognome" autoComplete="family-name" value={f.cognome} onChange={set('cognome')} />
            <span className={label}>Cognome</span>
          </label>
          <label className="relative sm:col-span-2">
            <input
              className={field}
              type="email"
              inputMode="email"
              placeholder="Email"
              autoComplete="email"
              value={f.email}
              onChange={set('email')}
              onBlur={() => setTouched({ ...touched, email: true })}
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby="err-email"
            />
            <span className={label}>Email *</span>
            {touched.email && errors.email && (
              <span id="err-email" className="mt-1.5 block text-sm text-flame">
                {errors.email}
              </span>
            )}
          </label>
          <label className="relative">
            <select
              className={`${field} appearance-none`}
              value={f.tipo}
              onChange={set('tipo')}
              onBlur={() => setTouched({ ...touched, tipo: true })}
              aria-invalid={!!(touched.tipo && errors.tipo)}
            >
              <option value="" disabled>
                Scegli
              </option>
              {eventTypes.map((t) => (
                <option key={t} className="text-coal">
                  {t}
                </option>
              ))}
            </select>
            <span className={label}>Tipo di evento *</span>
            <i className="ri-arrow-down-s-line pointer-events-none absolute right-4 top-5 text-cream/50" aria-hidden />
            {touched.tipo && errors.tipo && <span className="mt-1.5 block text-sm text-flame">{errors.tipo}</span>}
          </label>
          <label className="relative">
            <input className={`${field} [color-scheme:dark]`} type="date" value={f.data} onChange={set('data')} />
            <span className={label}>Data</span>
          </label>
          <label className="relative sm:col-span-2">
            <input className={field} type="number" inputMode="numeric" min={1} placeholder="Ospiti" value={f.ospiti} onChange={set('ospiti')} />
            <span className={label}>Quanti ospiti, più o meno</span>
          </label>
          <label className="relative sm:col-span-2">
            <textarea className={`${field} min-h-28 resize-y`} placeholder="Altro" value={f.note} onChange={set('note')} />
            <span className={label}>Raccontaci l’idea</span>
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm text-cream/70 sm:col-span-2">
            <input type="checkbox" checked={f.news} onChange={set('news')} className="size-5 accent-ember" />
            Iscrivimi alla newsletter (5% di sconto sul primo soggiorno)
          </label>
          <button
            type="submit"
            className="mt-2 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-ember px-6 font-semibold text-cream transition-[transform,background-color] duration-150 hover:bg-[#ff5b38] active:scale-[0.97] sm:col-span-2"
          >
            Chiedi un preventivo <i className="ri-arrow-right-line" aria-hidden />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export function Ash() {
  const [spot, setSpot] = useState<number | null>(0)
  const cols = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: cols, offset: ['start end', 'end start'] })
  const ya = useTransform(scrollYProgress, [0, 1], [60, -60])
  const yb = useTransform(scrollYProgress, [0, 1], [-40, 120])
  const parallax = useMediaQuery('(min-width: 1024px)')

  return (
    <section id="eventi" className="relative bg-coal px-5 py-24 sm:px-12 sm:py-32 lg:px-20">
      <div className="max-w-4xl">
        <Kicker className="text-flame">Eventi privati e aziendali</Kicker>
        <RiseText
          as="h2"
          text="Sala Ash. Un loft inglese in mezzo alla campagna."
          className="mt-5 block font-display font-soft text-[clamp(2.6rem,6.4vw,6rem)] font-medium leading-[0.98] tracking-tight"
        />
      </div>

      <FadeIn className="relative mt-12 overflow-hidden rounded-[2rem]">
        <Photo name="ash-sala-1" alt="La Sala Ash con la carrozza appesa al soffitto" className="aspect-[4/3] sm:aspect-[3/2]" />
        {spots.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setSpot(spot === i ? null : i)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setSpot(i)}
            aria-label={s.title}
            aria-expanded={spot === i}
            className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span className={`absolute size-7 rounded-full bg-flame/40 ${spot === i ? '' : 'animate-ping'}`} />
            <span
              className={`relative grid size-7 place-items-center rounded-full text-sm font-bold transition-colors duration-200 ${
                spot === i ? 'bg-cream text-coal' : 'bg-flame text-coal'
              }`}
            >
              {i + 1}
            </span>
          </button>
        ))}
        <AnimatePresence mode="wait">
          {spot !== null && (
            <motion.div
              key={spot}
              initial={{ opacity: 0, transform: 'translateY(10px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.3, ease: easeOut }}
              className="absolute bottom-3 left-3 right-3 rounded-2xl bg-coal/80 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:p-5"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-flame">
                {spot + 1} di {spots.length}
              </p>
              <p className="mt-1 font-display text-2xl italic">{spots[spot].title}</p>
              <p className="mt-1 text-sm text-cream/70">{spots[spot].text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeIn>

      <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div ref={cols} className="grid grid-cols-2 gap-3 sm:gap-4">
          <motion.div style={parallax ? { y: ya } : undefined} className="grid gap-3 sm:gap-4">
            {columnA.map((n) => (
              <Photo key={n} name={n} small alt="Dettaglio della Sala Ash" className="aspect-[4/5] rounded-2xl" />
            ))}
          </motion.div>
          <motion.div style={parallax ? { y: yb } : undefined} className="grid gap-3 pt-10 sm:gap-4 lg:pt-16">
            {columnB.map((n) => (
              <Photo key={n} name={n} small alt="Dettaglio della Sala Ash" className="aspect-[4/5] rounded-2xl" />
            ))}
          </motion.div>
        </div>

        <div>
          <p className="max-w-lg text-lg leading-relaxed text-cream/75">
            Carta da parati, chesterfield, una carrozza appesa al soffitto. Accanto c’è un giardino d’inverno riscaldato con
            bar e salottini. Al mattino qui si fa colazione. Per il vostro evento la allestiamo su misura.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {[
              ['ri-cake-2-line', 'Compleanni e anniversari'],
              ['ri-briefcase-4-line', 'Cene aziendali'],
              ['ri-goblet-line', 'Aperitivi privati'],
              ['ri-plant-line', 'Giardino d’inverno'],
            ].map(([icon, t]) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl bg-cream/5 px-4 py-3.5 ring-1 ring-cream/10">
                <i className={`${icon} text-lg text-flame`} aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <p className="mb-4 font-display text-2xl italic">Chiedi un preventivo</p>
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  )
}
