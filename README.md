# Libri in CAA per la Didattica Inclusiva

Sito statico in React + Vite, con una sola Cloudflare Pages Function per il form contatti.

## Sviluppo locale

```bash
npm install
npm run dev
```

Il form su `/chi-siamo` chiama `/api/contact`. Con `npm run dev` quella rotta non esiste: per provarlo insieme al sito:

1. Copia `.dev.vars.example` in `.dev.vars` e inserisci email e chiave Resend
2. Avvia `npm run pages` (build + `wrangler pages dev dist`)

## Pubblicare su Cloudflare Pages

1. Carica il repository su GitHub
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**
3. Impostazioni di build:
   - Framework preset: **Vite** (oppure None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node: `20` (c’è già `.nvmrc`)
4. Variabili (Settings → Environment variables / Secrets):
   - `CONTACT_TO_EMAIL` — casella che riceve i messaggi
   - `RESEND_API_KEY` — chiave API di [Resend](https://resend.com)
   - `RESEND_FROM_EMAIL` (opzionale) — mittente verificato, es. `Libri CAA <info@tuodominio.it>`

Le route SPA (`/libri/...`, `/chi-siamo`) funzionano grazie a `public/_redirects`. La funzione in `functions/api/contact.ts` viene pubblicata in automatico su `/api/contact`.

## Contenuti da sostituire

- Testi in `src/data/libri.ts` e nella pagina Chi siamo
- Link Amazon (`amazonUrl`)
- Copertine: metti i file in `public/copertine/` e aggiungi il campo `copertina` (es. `"/copertine/emozioni.jpg"`)
