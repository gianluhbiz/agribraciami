import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { menu, season, tagLabel, type Dish, type MenuSection, type Tag } from '../data/menu'
import { links } from '../data/site'
import { Cta, Photo } from '../components/ui'
import { easeOut } from '../lib/motion'
import { euro } from '../lib/hooks'
import { usePageTransition } from '../lib/transition-context'

const filters: { tag: Tag; short: string; icon: string }[] = [
  { tag: 'GF', short: 'Senza glutine', icon: 'ri-leaf-line' },
  { tag: 'LF', short: 'Senza lattosio', icon: 'ri-drop-line' },
  { tag: 'V', short: 'Vegetariano', icon: 'ri-seedling-line' },
]

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function WeightCalc({ d }: { d: Dish }) {
  const { perEtto, minG } = d.byWeight!
  const [g, setG] = useState(minG + 200)
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="overflow-hidden"
    >
      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl bg-cream/5 p-4 ring-1 ring-cream/10">
        <label className="flex-1 basis-48">
          <span className="sr-only">Peso</span>
          <input
            type="range"
            min={minG}
            max={2000}
            step={50}
            value={g}
            onChange={(e) => setG(Number(e.target.value))}
            className="h-10 w-full accent-ember"
          />
        </label>
        <p className="font-display text-2xl italic tabular-nums">
          {(g / 1000).toLocaleString('it-IT', { maximumFractionDigits: 2 })} kg ·{' '}
          <span className="text-flame">{euro((g / 100) * perEtto)}</span>
        </p>
      </div>
    </motion.div>
  )
}

function DishRow({ d, compact }: { d: Dish; compact?: boolean }) {
  const [calc, setCalc] = useState(false)
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.3 }}
      className={`group border-b border-cream/10 ${compact ? 'py-3.5' : 'py-5'}`}
    >
      <div className="flex items-baseline gap-3">
        <h3 className={`font-display ${compact ? 'text-lg' : 'text-xl sm:text-2xl'} leading-tight`}>
          {d.name}
          {d.tags?.map((t) => (
            <span
              key={t}
              title={tagLabel[t]}
              className="ml-2 inline-block translate-y-[-0.15em] rounded-full bg-cream/10 px-1.5 py-0.5 align-middle font-sans text-[0.6rem] font-semibold tracking-wider text-cream/70"
            >
              {t}
            </span>
          ))}
        </h3>
        <span aria-hidden className="mb-1 min-w-6 flex-1 border-b border-dotted border-cream/25" />
        <span className={`shrink-0 font-display ${compact ? 'text-lg' : 'text-xl sm:text-2xl'} italic tabular-nums text-flame`}>
          {d.price.includes('/') ? `€ ${d.price}` : `€ ${d.price}`}
        </span>
      </div>
      {d.desc && <p className={`mt-1 max-w-xl text-cream/60 ${compact ? 'text-sm' : ''}`}>{d.desc}</p>}
      {d.byWeight && (
        <>
          <button
            onClick={() => setCalc((c) => !c)}
            aria-expanded={calc}
            className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-flame"
          >
            <i className="ri-scales-3-line" aria-hidden /> {calc ? 'Chiudi' : 'Calcola il prezzo per peso'}
          </button>
          <AnimatePresence>{calc && <WeightCalc d={d} />}</AnimatePresence>
        </>
      )}
    </motion.li>
  )
}

function Section({ s, items }: { s: MenuSection; items: Dish[] }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  return (
    <section ref={ref} id={s.id} data-section={s.id} className="scroll-mt-40 py-14 sm:py-20">
      <div className={`grid gap-8 ${s.image ? 'lg:grid-cols-[1fr_1.3fr] lg:gap-16' : 'lg:grid-cols-[1fr_1.3fr] lg:gap-16'}`}>
        <div className="lg:sticky lg:top-40 lg:self-start">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-flame">{s.kicker}</p>
          <h2 className="mt-3 font-display font-soft text-[clamp(2.4rem,5vw,4.4rem)] font-medium leading-none tracking-tight">{s.title}</h2>
          {s.intro && <p className="mt-5 max-w-md leading-relaxed text-cream/65">{s.intro}</p>}
          {s.image && (
            <div className="mt-8 hidden aspect-[4/3] overflow-hidden rounded-[1.6rem] lg:block">
              <motion.div style={{ y, scale: 1.25 }} className="h-full w-full">
                <Photo name={s.image} alt={s.title} className="h-full w-full" />
              </motion.div>
            </div>
          )}
        </div>
        <ul className={s.compact ? 'grid gap-x-10 sm:grid-cols-2' : ''}>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((d) => (
              <DishRow key={d.name + d.desc} d={d} compact={s.compact} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  )
}

export default function Menu() {
  const { go } = usePageTransition()
  const { hash } = useLocation()
  const [group, setGroup] = useState<'cucina' | 'bere'>(() =>
    menu.find((s) => `#${s.id}` === hash)?.group === 'bere' ? 'bere' : 'cucina',
  )
  const [active, setActive] = useState<string>('')
  const [tags, setTags] = useState<Tag[]>([])
  const [q, setQ] = useState('')
  const chips = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `Menu ${season} · Braciami`
  }, [])

  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }), 50)
    return () => clearTimeout(t)
  }, [hash])

  const visible = useMemo(() => {
    const nq = norm(q.trim())
    return menu
      .filter((s) => s.group === group)
      .map((s) => ({
        s,
        items: s.items.filter(
          (d) =>
            tags.every((t) => d.tags?.includes(t)) &&
            (!nq || norm(`${d.name} ${d.desc ?? ''} ${s.title}`).includes(nq)),
        ),
      }))
      .filter((x) => x.items.length > 0)
  }, [group, tags, q])

  const total = visible.reduce((n, x) => n + x.items.length, 0)

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-section]')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.getAttribute('data-section')!)),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [visible])

  useEffect(() => {
    const el = chips.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`)
    if (el && chips.current) {
      chips.current.scrollTo({ left: el.offsetLeft - chips.current.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
    }
  }, [active])

  const toggle = (t: Tag) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const switchGroup = (g: 'cucina' | 'bere') => {
    setGroup(g)
    setActive('')
    const top = document.getElementById('carta')
    if (top && window.scrollY > top.offsetTop) window.scrollTo({ top: top.offsetTop - 10, behavior: 'smooth' })
  }

  const h = { initial: { transform: 'translateY(110%)' }, animate: { transform: 'translateY(0%)' } }

  return (
    <main className="bg-coal">
      <header className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-12 sm:pt-36 lg:px-20">
        <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <button
              onClick={(e) => go('/#menu', 'Braciami', { x: e.clientX, y: e.clientY })}
              className="inline-flex min-h-10 items-center gap-2 text-sm text-cream/60 transition-colors hover:text-cream"
            >
              <i className="ri-arrow-left-line" aria-hidden /> Torna a Braciami
            </button>
            <motion.p
              className="mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-flame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Menu {season} · Tutto a km 0
            </motion.p>
            <h1 className="mt-4 font-display font-soft text-[clamp(4rem,10.5vw,10rem)] font-medium italic leading-[0.86] tracking-tight">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" {...h} transition={{ duration: 1, ease: easeOut, delay: 0.55 }}>
                  Dal fuoco
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block text-flame" {...h} transition={{ duration: 1, ease: easeOut, delay: 0.65 }}>
                  al piatto.
                </motion.span>
              </span>
            </h1>
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(16px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ delay: 0.9, duration: 0.6, ease: easeOut }}
            >
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-cream/70">
                Carne della nostra azienda agricola, verdure dell’orto, pasta tirata a mano. Il menu segue le stagioni, i vini
                vengono tutti dal Lazio.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Cta href={links.table} external icon="ri-calendar-check-line">
                  Prenota un tavolo
                </Cta>
                <Cta href={links.menuPdf} external variant="ghost" icon="ri-download-2-line">
                  Versione PDF
                </Cta>
              </div>
            </motion.div>
          </div>

          <div className="relative hidden h-[420px] lg:block">
            {[
              { n: 'brace-fiamme', r: -8, x: '0%', y: '6%', d: 0.7 },
              { n: 'ravioli', r: 5, x: '34%', y: '0%', d: 0.8 },
              { n: 'tavola-piatti', r: -2, x: '16%', y: '28%', d: 0.9 },
            ].map((c) => (
              <motion.div
                key={c.n}
                className="absolute w-[58%] bg-cream p-2 pb-8 shadow-2xl shadow-black/60"
                style={{ left: c.x, top: c.y }}
                initial={{ opacity: 0, transform: `translateY(80px) rotate(${c.r * 2}deg)` }}
                animate={{ opacity: 1, transform: `translateY(0px) rotate(${c.r}deg)` }}
                transition={{ delay: c.d, type: 'spring', duration: 1, bounce: 0.25 }}
              >
                <Photo name={c.n} small alt="" eager className="aspect-[4/3]" />
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      <div id="carta" className="sticky top-0 z-30 border-y border-cream/10 bg-coal/85 backdrop-blur-xl transition-[top] duration-300 ease-out-strong [html[data-nav=shown]_&]:top-[68px]">
        <div className="flex items-center gap-3 px-3 py-2.5 sm:px-12 lg:px-20">
          <div className="relative grid shrink-0 grid-cols-2 rounded-full bg-cream/5 p-1 ring-1 ring-cream/10">
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ember transition-transform duration-300 ease-out-strong"
              style={{ transform: `translateX(${group === 'bere' ? 100 : 0}%)` }}
            />
            {(['cucina', 'bere'] as const).map((g) => (
              <button key={g} onClick={() => switchGroup(g)} className="relative min-h-10 rounded-full px-4 text-sm font-semibold">
                <span className="relative">{g === 'bere' ? 'Da bere' : 'Cucina'}</span>
              </button>
            ))}
          </div>
          <div ref={chips} className="no-scrollbar relative flex flex-1 gap-1 overflow-x-auto">
            {visible.map(({ s }) => (
              <button
                key={s.id}
                data-chip={s.id}
                onClick={() => jumpTo(s.id)}
                className={`relative min-h-10 shrink-0 rounded-full px-3.5 text-sm transition-colors duration-200 ${
                  active === s.id ? 'bg-cream text-coal' : 'text-cream/65 hover:text-cream'
                }`}
              >
                <span className="relative">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-cream/5 px-3 py-2.5 sm:px-12 lg:px-20">
          <label className="relative flex min-w-0 flex-1 basis-56 items-center">
            <i className="ri-search-line pointer-events-none absolute left-4 text-cream/45" aria-hidden />
            <span className="sr-only">Cerca nel menu</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca: tartufo, cinghiale, Cesanese…"
              className="min-h-10 w-full rounded-full bg-cream/5 pl-10 pr-4 text-base ring-1 ring-cream/10 placeholder:text-cream/35 focus:outline-none focus:ring-2 focus:ring-flame sm:text-sm"
            />
          </label>
          {group === 'cucina' && (
            <div className="no-scrollbar -mx-3 flex w-[calc(100%+1.5rem)] gap-2 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:px-0">
            {filters.map((f) => {
              const on = tags.includes(f.tag)
              return (
                <button
                  key={f.tag}
                  onClick={() => toggle(f.tag)}
                  aria-pressed={on}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                    on ? 'bg-flame text-coal' : 'bg-cream/5 text-cream/70 ring-1 ring-cream/10 hover:text-cream'
                  }`}
                >
                  <i className={on ? 'ri-check-line' : f.icon} aria-hidden />
                  {f.short}
                </button>
              )
            })}
            </div>
          )}
          <span className="ml-auto hidden text-xs text-cream/45 sm:block" aria-live="polite">
            {total} {group === 'cucina' ? 'piatti' : 'voci'}
          </span>
        </div>
      </div>

      <div className="px-5 sm:px-12 lg:px-20">
        {visible.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <p className="font-display text-4xl italic">Niente con questi filtri.</p>
            <p className="mt-3 text-cream/60">Prova a toglierne uno, oppure chiedi in sala.</p>
            <button
              onClick={() => {
                setTags([])
                setQ('')
              }}
              className="mt-6 min-h-12 rounded-full bg-cream px-6 font-semibold text-coal"
            >
              Azzera i filtri
            </button>
          </div>
        ) : (
          visible.map(({ s, items }) => <Section key={s.id} s={s} items={items} />)
        )}

        <div className="grid gap-6 border-t border-cream/10 py-16 text-sm text-cream/55 sm:grid-cols-3">
          <p>
            <strong className="block text-cream">Allergie e intolleranze</strong>
            Diccelo quando prenoti o al tavolo. LF = senza lattosio, GF = senza glutine, V = vegetariano.
          </p>
          <p>
            <strong className="block text-cream">Servizio</strong>€ 2,5 a persona. Prezzi in euro, IVA inclusa.
          </p>
          <p>
            <strong className="block text-cream">Il menu cambia</strong>
            Questa è la carta d’{season.toLowerCase()}. Seguici su Instagram per sapere quando arriva la prossima.
          </p>
        </div>
      </div>
    </main>
  )
}
