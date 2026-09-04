# Didattica Inclusiva

Sito ufficiale: **[didatticainclusiva.it](https://didatticainclusiva.it)**

Progetto editoriale per la **didattica inclusiva** e l’**educazione speciale**: albi e materiali in Comunicazione Aumentativa Alternativa (CAA) per la scuola e per casa.

**Ideatrice e autrice:** Roberta Panaccione.

Questo repository contiene il codice del sito (vetrina dei libri, pagine dedicate, presentazione del progetto e modulo contatti).

---

## Cosa fa il sito

- **Home** — presentazione dell’iniziativa e due titoli in evidenza
- **Libri** — scaffale orizzontale di tutti i titoli
- **Pagina libro** — temi, strumenti, link Amazon
- **Chi siamo** — il progetto e il form per scrivere all’autrice

I testi e le copertine nel codice sono in parte placeholder, da sostituire con i contenuti definitivi.

---

## Stack tecnico

Il sito è una **Single Page Application**: HTML, CSS e JavaScript vengono serviti come file statici. Non c’è database né CMS. L’unica parte “server” è una funzione serverless su Cloudflare che riceve il form e spedisce la mail con Resend.

| Ruolo | Strumento |
| --- | --- |
| Linguaggio | TypeScript |
| Interfaccia | React 19, React DOM |
| Routing (Home, Libri, Chi siamo) | React Router |
| Build e server di sviluppo | Vite 7 |
| Runtime Node | Node.js 20 (`engines` in `package.json`, `.nvmrc`) |
| Pacchetti | npm |
| Hosting, HTTPS, CDN, API form | Cloudflare Workers + Static Assets |
| CLI Cloudflare | Wrangler 4 |
| Invio email | Resend (HTTP API) |
| Font | Google Fonts (Fredoka, Nunito) |
| Stili | CSS custom (nessun UI kit) |
| Codice sorgente | Git, GitHub |
| Editor / agente | Cursor |

File principali:

- `src/` — pagine e componenti React
- `src/data/libri.ts` — catalogo (titoli, testi, URL Amazon)
- `worker/index.ts` — ingresso del Worker: `POST /api/contact`
- `worker/contact.ts` — validazione e chiamata a Resend
- `wrangler.toml` — nome Worker `libricaadidatticainclusiva`, cartella `dist`, SPA, Worker prima su `/api/*`

---

## Sviluppo locale

```bash
npm install
npm run dev
```

Apre Vite (in genere `http://localhost:5173`). Il form **non** funziona: Vite non esegue il Worker.

Per provare il form come in produzione:

1. Copia `.dev.vars.example` in `.dev.vars` (non va su Git) e inserisci i secret
2. `npm run dev:cf` — build + `wrangler dev`

Altri comandi:

- `npm run build` — TypeScript + bundle in `dist/`
- `npm run preview` — anteprima statica Vite (senza API)
- `npm run deploy` — `wrangler deploy --keep-vars` (non cancella le Variable del dashboard)

---

## Form contatti e secret Cloudflare

Flusso:

1. Il browser invia `{ nome, email, messaggio }` a `POST /api/contact`
2. Il Worker valida i campi, mette l’email di chi scrive nel corpo del messaggio e in `reply_to`
3. Resend spedisce a `CONTACT_TO_EMAIL` (la casella del progetto)

Nel Worker **libricaadidatticainclusiva** → **Settings → Variables and Secrets** (runtime, non Build):

| Nome | Tipo |
| --- | --- |
| `CONTACT_TO_EMAIL` | Secret |
| `RESEND_API_KEY` | Secret |
| `RESEND_FROM_MAIL` o `RESEND_FROM_EMAIL` | Variable |

Poi **Deploy** in fondo alla schermata.

Con il mittente di prova Resend (`onboarding@resend.dev`) l’invio è limitato all’account Resend. Per spedire verso qualsiasi casella serve un dominio verificato su Resend.

---

## Contenuti da aggiornare

- Testi in `src/data/libri.ts` e in Chi siamo
- URL Amazon (`amazonUrl`)
- Copertine in `public/copertine/` e campo `copertina` sui libri
