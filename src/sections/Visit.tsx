import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { contact, links } from '../data/site'
import { FadeIn, Kicker, Photo, RiseText } from '../components/ui'
import { useOpenStatus, weekDays } from '../lib/hooks'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'ok'>('idle')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState('error')
    // TODO: collegare al servizio newsletter (oggi il sito usa un form WordPress).
    setState('ok')
  }
  return (
    <form onSubmit={submit} noValidate className="rounded-[2rem] bg-cream p-6 text-coal sm:p-8">
      <p className="font-display text-3xl italic">5% sul primo soggiorno</p>
      <p className="mt-2 text-sm text-coal/65">Iscriviti alla newsletter: novità del menu, serate ed eventi. Niente spam, promesso.</p>
      <AnimatePresence mode="wait">
        {state === 'ok' ? (
          <motion.p
            key="ok"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex min-h-14 items-center gap-2 font-semibold text-bottle"
          >
            <i className="ri-checkbox-circle-fill text-xl" aria-hidden /> Grazie! Controlla la posta per confermare.
          </motion.p>
        ) : (
          <motion.div key="f" exit={{ opacity: 0 }} className="mt-6">
            <div className="flex gap-2 rounded-full bg-paper p-1.5 ring-1 ring-coal/10 focus-within:ring-2 focus-within:ring-ember">
              <label htmlFor="nl-email" className="sr-only">
                Email
              </label>
              <input
                id="nl-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="La tua email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setState('idle')
                }}
                aria-invalid={state === 'error'}
                className="w-0 min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-coal/40"
              />
              <button type="submit" className="min-h-11 rounded-full bg-coal px-5 text-sm font-semibold text-cream transition-transform duration-150 active:scale-[0.97]">
                Iscriviti
              </button>
            </div>
            {state === 'error' && <p className="mt-2 pl-4 text-sm text-ember">Controlla l’indirizzo email.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

function ContactForm() {
  const [f, setF] = useState({ nome: '', email: '', oggetto: '', messaggio: '' })
  const [err, setErr] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.nome.trim()) return setErr('nome')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('email')
    setErr('')
    const body = `${f.messaggio}\n\n${f.nome} · ${f.email}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(f.oggetto || 'Informazioni')}&body=${encodeURIComponent(body)}`
  }
  const field =
    'w-full rounded-2xl bg-cream/5 px-4 py-3.5 text-base text-cream ring-1 ring-cream/15 placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-flame'
  return (
    <form onSubmit={submit} noValidate className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/55">Nome</span>
          <input className={field} autoComplete="name" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} aria-invalid={err === 'nome'} />
          {err === 'nome' && <span className="mt-1 block text-sm text-flame">Come ti chiami?</span>}
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/55">Email</span>
          <input
            className={field}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            aria-invalid={err === 'email'}
          />
          {err === 'email' && <span className="mt-1 block text-sm text-flame">Serve un’email valida.</span>}
        </label>
      </div>
      <label>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/55">Oggetto</span>
        <input className={field} value={f.oggetto} onChange={(e) => setF({ ...f, oggetto: e.target.value })} />
      </label>
      <label>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/55">Messaggio (facoltativo)</span>
        <textarea className={`${field} min-h-28`} value={f.messaggio} onChange={(e) => setF({ ...f, messaggio: e.target.value })} />
      </label>
      <button type="submit" className="mt-1 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-cream py-3.5 font-semibold text-coal transition-transform duration-150 active:scale-[0.97]">
        Invia il messaggio <i className="ri-send-plane-line" aria-hidden />
      </button>
    </form>
  )
}

export function Visit() {
  const status = useOpenStatus()
  return (
    <section id="visita" className="relative bg-coal px-5 py-24 sm:px-12 sm:py-32 lg:px-20">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="min-w-0">
          <Kicker className="text-flame">Come arrivare</Kicker>
          <RiseText
            as="h2"
            text="Quattro chilometri da Viterbo, cinquanta minuti da Roma."
            className="mt-5 block font-display font-soft text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[1] tracking-tight"
          />

          <FadeIn className="mt-10 flex items-center gap-3 rounded-2xl bg-cream/5 p-4 ring-1 ring-cream/10">
            <span className="relative flex size-3">
              {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7bd88f] opacity-60" />}
              <span className={`relative inline-flex size-3 rounded-full ${status.open ? 'bg-[#7bd88f]' : 'bg-smoke'}`} />
            </span>
            <p className="font-medium">{status.long}</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ul className="mt-6 divide-y divide-cream/10 border-y border-cream/10">
              {weekDays.map((d) => {
                const today = d.day === status.today
                return (
                  <li key={d.day} className={`flex justify-between py-3 text-sm ${today ? 'font-semibold text-cream' : 'text-cream/65'}`}>
                    <span className="flex items-center gap-2">
                      {d.label}
                      {today && <span className="rounded-full bg-ember px-2 py-0.5 text-[0.65rem] uppercase tracking-wider">oggi</span>}
                    </span>
                    <span>{d.service ?? 'Chiuso'}</span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-xs text-cream/45">Piscina: sabato e domenica, da giugno a settembre.</p>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-8 grid gap-2 sm:grid-cols-2">
            {[
              { icon: 'ri-phone-line', label: contact.phone, href: contact.phoneHref },
              { icon: 'ri-mail-line', label: 'Scrivici una mail', href: `mailto:${contact.email}` },
              { icon: 'ri-map-pin-2-line', label: 'Indicazioni stradali', href: contact.mapsDirections, ext: true },
              { icon: 'ri-instagram-line', label: '@agriturismobraciami', href: links.instagram, ext: true },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex min-h-14 items-center gap-3 rounded-2xl bg-cream/5 px-4 ring-1 ring-cream/10 transition-colors duration-200 hover:bg-cream/10"
              >
                <i className={`${c.icon} text-lg text-flame`} aria-hidden />
                <span className="truncate text-sm">{c.label}</span>
              </a>
            ))}
          </FadeIn>
        </div>

        <FadeIn className="relative min-h-[420px] overflow-hidden rounded-[2rem] ring-1 ring-cream/10">
          <iframe
            title="Mappa di Braciami"
            src={contact.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full [filter:invert(92%)_hue-rotate(180deg)_saturate(0.6)_contrast(0.9)]"
          />
          <a
            href={contact.mapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-2xl bg-coal/85 p-3 backdrop-blur-xl sm:right-auto"
          >
            <Photo name="neon" small alt="" className="size-14 shrink-0 rounded-xl" />
            <span className="pr-3">
              <span className="block font-semibold">Strada Cimina 21</span>
              <span className="block text-sm text-cream/60">01100 Viterbo · Apri in Maps</span>
            </span>
          </a>
        </FadeIn>
      </div>

      <div className="mt-20 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div className="min-w-0">
          <p className="mb-6 font-display text-3xl italic">Mandaci un messaggio</p>
          <ContactForm />
        </div>
        <div className="min-w-0 self-end">
          <Newsletter />
        </div>
      </div>
    </section>
  )
}
