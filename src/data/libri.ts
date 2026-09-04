export type Libro = {
  slug: string;
  titolo: string;
  sottotitolo: string;
  descrizione: string;
  temi: string[];
  strumenti: string[];
  amazonUrl: string;
  colore: "blu" | "giallo" | "verde" | "rosso";
  /** Percorso in /public, es. "/copertine/emozioni.jpg". Se assente, si usa il placeholder. */
  copertina?: string;
};

export const libri: Libro[] = [
  {
    slug: "emozioni-e-storie-sociali",
    titolo: "Emozioni e storie sociali",
    sottotitolo: "Riconoscere e raccontare come ci sentiamo",
    colore: "blu",
    amazonUrl: "https://www.amazon.it/dp/PLACEHOLDER01",
    descrizione:
      "Placeholder. Un albo in CAA per nominare le emozioni, dare loro un volto e una sequenza. Le pagine accompagnano il bambino e l’adulto in situazioni quotidiane (un cambio di programma, un conflitto, un momento di gioia) con linguaggio chiaro e pittogrammi. Il testo è pensato per la lettura condivisa in classe, a casa o in terapia.",
    temi: [
      "Riconoscimento delle emozioni di base",
      "Storie sociali e anticipazione degli eventi",
      "Regolazione e richiesta di aiuto",
      "Empatia e rispetto dei tempi di ciascuno",
    ],
    strumenti: [
      "Tavole in CAA con pittogrammi e didascalie brevi",
      "Schede “come mi sento oggi” da fotocopiare o plastificare",
      "Sequenze visive per preparare un cambio di routine",
      "Domande guida per l’adulto (insegnante, genitore, terapista)",
    ],
  },
  {
    slug: "la-mia-giornata",
    titolo: "La mia giornata",
    sottotitolo: "Routine visive dalla mattina alla sera",
    colore: "giallo",
    amazonUrl: "https://www.amazon.it/dp/PLACEHOLDER02",
    descrizione:
      "Placeholder. Un libro-agenda visiva che racconta una giornata tipo: sveglia, colazione, scuola, gioco, cena, nanna. Ogni passaggio è spezzato in passi piccoli, con pittogrammi e un ritmo prevedibile. Serve a ridurre l’ansia da incertezza e a costruire autonomia, senza pretendere che tutte le giornate siano uguali.",
    temi: [
      "Routine domestiche e scolastiche",
      "Transizioni e tempi di attesa",
      "Autonomia nelle attività di vita quotidiana",
      "Prevedibilità come sostegno, non come rigidità",
    ],
    strumenti: [
      "Striscia della giornata da appendere o da tenere sul banco",
      "Carte-attività da riordinare in sequenza",
      "Simboli per “adesso”, “dopo” e “pausa”",
      "Versione semplificata e versione estesa della stessa routine",
    ],
  },
  {
    slug: "a-scuola-insieme",
    titolo: "A scuola insieme",
    sottotitolo: "Partecipare alla classe, ognuno a modo proprio",
    colore: "verde",
    amazonUrl: "https://www.amazon.it/dp/PLACEHOLDER03",
    descrizione:
      "Placeholder. Materiale per la vita di classe: l’appello, il lavoro di gruppo, la ricreazione, la verifica. Il libro non “spiega la disabilità”: mostra come la classe può organizzarsi perché tutte e tutti possano capire, scegliere e contribuire. Utile per insegnanti curricolari, di sostegno e compagni di classe.",
    temi: [
      "Didattica inclusiva e progettazione universale",
      "Ruoli e cooperazione in gruppo",
      "Regole di classe scritte in modo accessibile",
      "Peer tutoring e rispetto delle differenze",
    ],
    strumenti: [
      "Regole di classe in CAA",
      "Schede per assegnare ruoli nel lavoro di gruppo",
      "Mappe per seguire una lezione o una consegna",
      "Suggerimenti per adattare una attività senza isolarla dal gruppo",
    ],
  },
  {
    slug: "comunicare-con-i-pittogrammi",
    titolo: "Comunicare con i pittogrammi",
    sottotitolo: "Prime frasi, scelte e richieste in CAA",
    colore: "rosso",
    amazonUrl: "https://www.amazon.it/dp/PLACEHOLDER04",
    descrizione:
      "Placeholder. Una guida pratica per iniziare (o rinforzare) la comunicazione aumentativa: come modellare una frase, come offrire scelte vere, come rispondere anche quando il bambino non usa la voce. Non sostituisce una presa in carico specialistica: è un ponte tra casa, scuola e terapia, con esempi concreti e tavole pronte.",
    temi: [
      "Principi della Comunicazione Aumentativa Alternativa",
      "Richieste, rifiuti, commenti e domande",
      "Modellamento e ambiente comunicativo",
      "Continuità tra casa, scuola e terapia",
    ],
    strumenti: [
      "Tavole di comunicazione a bassa tecnologia",
      "Esempi di frasi minime (io + verbo + oggetto)",
      "Checklist per l’adulto: come offrire due scelte",
      "Idee per personalizzare i pittogrammi con foto o simboli già in uso",
    ],
  },
];

export function getLibro(slug: string): Libro | undefined {
  return libri.find((libro) => libro.slug === slug);
}
