# Libri in CAA per la Didattica Inclusiva

Sito React + Vite su Cloudflare Workers (asset statici + una rotta API per il form).

## Come funziona il form

1. Su **Chi siamo** il browser invia un JSON `{ nome, email, messaggio }` a `POST /api/contact`
2. Il Worker Cloudflare (`worker/index.ts`) valida i campi
3. Se sono impostati i secret, chiama [Resend](https://resend.com) e spedisce la mail a `CONTACT_TO_EMAIL` (con `reply_to` = email di chi ha scritto)

`npm run dev` (solo Vite) **non** espone `/api/contact`. Per provarlo in locale:

1. Copia `.dev.vars.example` in `.dev.vars` e inserisci email e chiave Resend
2. `npm run dev:cf` (build + `wrangler dev`)

## Secret su Cloudflare

Nel Worker **libricaadidatticainclusiva** → Settings → Variables and Secrets:

- `CONTACT_TO_EMAIL` — casella che riceve i messaggi
- `RESEND_API_KEY` — chiave API Resend (tipo Secret)
- `RESEND_FROM_EMAIL` (opzionale) — mittente verificato su Resend, es. `Libri CAA <info@tuodominio.it>`

Senza questi valori il form risponde 503 (configurazione mancante), non un invio finto.

## Contenuti da sostituire

- Testi in `src/data/libri.ts` e nella pagina Chi siamo
- Link Amazon (`amazonUrl`)
- Copertine: metti i file in `public/copertine/` e aggiungi il campo `copertina` (es. `"/copertine/emozioni.jpg"`)
