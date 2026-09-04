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

Devono essere **runtime** del Worker **libricaadidatticainclusiva**, non “Build variables”.

1. Workers & Pages → apri il Worker (non un progetto Pages omonimo)
2. **Settings → Variables and Secrets** (sezione runtime)
3. Aggiungi, con i nomi esatti:
   - `CONTACT_TO_EMAIL` — tipo **Secret**
   - `RESEND_API_KEY` — tipo **Secret**
   - `RESEND_FROM_MAIL` o `RESEND_FROM_EMAIL` — Variable va bene
4. In fondo alla schermata premi **Deploy**. Senza questo passo il form continua a rispondere 503.

Se le hai messe come Variable (non Secret), un deploy da Git può cancellarle: Wrangler riscrive le var da `wrangler.toml`, che è vuoto. I Secret restano. Per questo entrambe le chiavi vanno come Secret.

Il comando di deploy del repo usa `--keep-vars` per non cancellare le Variable del dashboard.

## Contenuti da sostituire

- Testi in `src/data/libri.ts` e nella pagina Chi siamo
- Link Amazon (`amazonUrl`)
- Copertine: metti i file in `public/copertine/` e aggiungi il campo `copertina` (es. `"/copertine/emozioni.jpg"`)
