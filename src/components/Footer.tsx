import { contact, links } from '../data/site'
import { Embers } from '../sections/Fire'
import { useJump } from '../lib/nav'
import { Logo } from './ui'

export function Footer() {
  const jump = useJump()
  const cols = [
    { title: 'Eat', items: [['Braceria', 'fuoco'], ['Menu', 'menu']] },
    { title: 'Sleep', items: [['Le camere', 'camere'], ['Prenota', links.rooms]] },
    { title: 'Kick back', items: [['Piscina ed esperienze', 'giornata'], ['Sala Ash', 'eventi'], ['Gift card', 'regala']] },
  ]
  return (
    <footer className="relative overflow-hidden bg-coal px-5 pb-28 pt-24 sm:px-12 lg:px-20">
      <Embers count={14} />
      <div className="relative flex flex-col items-center text-center">
        <Logo glow className="h-auto w-[min(70vw,420px)] animate-flicker" />
        <p className="mt-6 max-w-md text-cream/60">Agriturismo con camere e piscina. Rilassati nella natura e mangia nella nostra braceria.</p>
      </div>

      <div className="relative mt-16 grid gap-10 border-t border-cream/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <p className="font-display text-2xl italic text-flame">{c.title}</p>
            <ul className="mt-3 space-y-1">
              {c.items.map(([label, target]) => (
                <li key={label}>
                  {target.startsWith('http') ? (
                    <a href={target} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-cream/70 hover:text-cream">
                      {label}
                    </a>
                  ) : (
                    <button onClick={(e) => jump(target, e)} className="min-h-10 text-cream/70 hover:text-cream">
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="font-display text-2xl italic text-flame">Contatti</p>
          <address className="mt-4 space-y-2 not-italic text-cream/70">
            <p>{contact.address}</p>
            <a href={contact.phoneHref} className="block hover:text-cream">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="block break-all hover:text-cream">
              {contact.email}
            </a>
          </address>
          <div className="mt-4 flex gap-2">
            {[
              ['ri-instagram-line', links.instagram, 'Instagram'],
              ['ri-facebook-circle-line', links.facebook, 'Facebook'],
              ['ri-star-smile-line', links.tripadvisor, 'Tripadvisor'],
            ].map(([icon, href, label]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full bg-cream/5 ring-1 ring-cream/10 transition-colors hover:bg-ember"
              >
                <i className={`${icon} text-lg`} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Agriturismo Braciami · P. IVA {contact.vat}</p>
        <p>
          Developed and Designed by{' '}
          <a
            href="https://gianluh.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-cream/80 underline underline-offset-4 transition-colors hover:text-cream"
          >
            Gianluca De Maio
            <i className="ri-external-link-line" aria-hidden />
          </a>
        </p>
        <p className="flex gap-4">
          <a href={links.privacy} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
            Privacy e cookie
          </a>
          <a href={links.terms} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
            Condizioni di vendita
          </a>
        </p>
      </div>
    </footer>
  )
}
