# Didattica Inclusiva

Sito ufficiale: **[didatticainclusiva.it](https://didatticainclusiva.it)**

Progetto editoriale per la **didattica inclusiva** e l’**educazione speciale**: albi e materiali in Comunicazione Aumentativa Alternativa (CAA) per la scuola e per casa.

**Ideatrice e autrice:** Roberta Panaccione.

Questo repository contiene il codice del sito (vetrina dei libri, pagine dedicate, presentazione del progetto e modulo contatti).

---

## Cosa fa il sito

- **Home** — presentazione dell’iniziativa e due titoli in evidenza (i più recenti)
- **Libri** — scaffale orizzontale di tutti i titoli
- **Pagina libro** — temi, strumenti, data di pubblicazione, link Amazon
- **Chi siamo** — il progetto e il form per scrivere all’autrice

I testi dei libri arrivano da Cloudflare D1. Le copertine sono file statici (o URL) indicati in tabella.

---

## Stack tecnico

Il sito è una **Single Page Application**: HTML, CSS e JavaScript vengono serviti come file statici. Non c’è un CMS di scrittura nel Worker. Il Worker fa due cose in sola lettura/invio: catalogo da D1 (`SELECT`) e form contatti (Resend).

| Ruolo | Strumento |
| --- | --- |
| Linguaggio | TypeScript |
| Interfaccia | React 19, React DOM |
| Routing (Home, Libri, Chi siamo) | React Router |
| Build e server di sviluppo | Vite 7 |
| Runtime Node | Node.js 20 (`engines` in `package.json`, `.nvmrc`) |
| Pacchetti | npm |
| Hosting, HTTPS, CDN, API | Cloudflare Workers + Static Assets |
| Database catalogo | Cloudflare D1 (`didatticainclusiva-assets`, binding `DB`) |
| CLI Cloudflare | Wrangler 4 |
| Invio email | Resend (HTTP API) |
| Font | Google Fonts (Fredoka, Nunito) |
| Stili | CSS custom (nessun UI kit) |
| Codice sorgente | Git, GitHub |
| Editor / agente | Cursor |

File principali:

- `src/` — pagine e componenti React
- `src/data/libri.ts` — tipo `Libro` e fetch verso l’API
- `worker/index.ts` — `GET /api/books`, `GET /api/books/:slug`, `POST /api/contact`, SEO HTML su `/libri/:slug`
- `worker/books.ts` — `SELECT` su D1 e mapping JSON
- `worker/contact.ts` — validazione e chiamata a Resend
- `wrangler.toml` — Worker `libricaadidatticainclusiva`, cartella `dist`, SPA, Worker prima su `/api/*` e `/libri/*`, binding D1 `DB`

---

## Sviluppo locale

```bash
npm install
npm run dev
```

Apre Vite (in genere `http://localhost:5173`). **Né il form né il catalogo funzionano**: Vite non esegue il Worker e non legge D1.

Per provarli come in produzione:

1. Copia `.dev.vars.example` in `.dev.vars` (non va su Git) e inserisci i secret del form
2. `npm run dev:cf` — build + `wrangler dev` (Worker + D1 locale di default)

`wrangler dev` usa una **copia locale** di D1, non automaticamente il database remoto. Se in locale la tabella è vuota, Home e Libri mostrano lista vuota o errore. Per interrogare il D1 di produzione (sola lettura):

```bash
npx wrangler d1 execute didatticainclusiva-assets --remote --command "SELECT id, slug, title FROM books"
```

Altri comandi:

- `npm run build` — TypeScript + bundle in `dist/`
- `npm run preview` — anteprima statica Vite (senza API)
- `npm run deploy` — `wrangler deploy --keep-vars` (non cancella le Variable del dashboard)

---

## Catalogo D1

Il browser chiama:

1. `GET /api/books` → `{ ok: true, books: Libro[] }`
2. `GET /api/books/:slug` → `{ ok: true, book }` oppure 404

Il Worker fa solo `SELECT` sulla tabella **`books`** (binding `DB`). Nessun INSERT/UPDATE/DELETE.

| Colonna D1 | Uso nel sito |
| --- | --- |
| `slug` | URL `/libri/:slug` (se manca, lo slug si ricava dal titolo) |
| `title` | Titolo |
| `small_desc` | Sottotitolo |
| `long_desc` | Descrizione |
| `tags_json` | Temi (`JSON.parse`, fallback `[]`) |
| `tools_json` | Strumenti |
| `path_cover` | Copertina (se vuoto, placeholder colorato) |
| `link_buy` | Pulsante acquisto |
| `data_publishing` | Ordinamento e riga «Pubblicato il …» |
| `id` | Colore placeholder a rotazione |

Query elenco:

```sql
SELECT id, slug, title, small_desc, long_desc, tags_json, tools_json,
       path_cover, link_buy, data_publishing
FROM books
ORDER BY data_publishing DESC, id DESC
```

In `wrangler.toml` il binding deve restare dichiarato, altrimenti un deploy può perdere il D1 collegato solo da dashboard:

```toml
[[d1_databases]]
binding = "DB"
database_name = "didatticainclusiva-assets"
database_id = "4d859b1a-1cbf-4cf1-ab51-e8c200c68833"
```

I contenuti (titoli, slug, JSON, copertine) si aggiornano in D1, non nel codice del Worker.

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

- Testi in Chi siamo
- Righe in D1 (`books`): slug, descrizioni, `tags_json`, `tools_json`, `link_buy`
- File copertina in `public/` (o CDN) allineati a `path_cover` (es. `/copertine/cover_storia_geografia_3.png`)
- Slug in `public/sitemap.xml` quando aggiungi o rinomini un titolo (il file è statico, non si aggiorna da D1)
