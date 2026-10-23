# Braciami · sito

React 19 + Vite, Tailwind 4, Framer Motion, Remix Icon, React Router 7.

```bash
npm run dev     # sviluppo
npm run build   # build di produzione in dist/
```

## Struttura

- `src/data/site.ts`: contatti, link di prenotazione (Octotable, Octorate), camere, esperienze, gift card, recensioni.
- `src/data/menu.ts`: menu completo (Autunno 2026, ricavato dal PDF del ristorante). Per un nuovo menu basta aggiornare questo file.
- `src/sections/`: le sezioni della home. `src/pages/Menu.tsx`: pagina menu.
- `src/lib/transition.tsx`: transizione a sipario tra le pagine.
- `public/img/`: foto del ristorante in WebP (versione grande e `-sm`).

## Funzioni riprese dal sito attuale

Prenotazione tavolo, camera (anche per singola camera) e piscina, menu, camere con prezzi e condizioni, esperienze,
Sala Ash con richiesta preventivo, gift card (link al negozio esistente), contatti, orari, mappa, newsletter, social.

## Da collegare prima della messa online

- Newsletter (`src/sections/Visit.tsx`): oggi mostra solo la conferma, va collegata al servizio usato dal ristorante.
- I form contatti e preventivo aprono l’app di posta con il messaggio già scritto. Per l’invio diretto serve un servizio
  tipo Formspree o un endpoint.
- Hosting: serve il fallback SPA (tutte le rotte su `index.html`) per far funzionare `/menu` al refresh.
