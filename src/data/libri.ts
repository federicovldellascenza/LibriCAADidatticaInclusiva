export type ColoreLibro = "blu" | "giallo" | "verde" | "rosso";

export type Libro = {
  slug: string;
  titolo: string;
  sottotitolo: string;
  descrizione: string;
  temi: string[];
  strumenti: string[];
  amazonUrl: string;
  colore: ColoreLibro;
  /** Percorso in /public o URL, es. "/covers/cover1.jpg". Se assente, si usa il placeholder. */
  copertina?: string;
  /** ISO date da D1 (`data_publishing`), es. "2026-09-04". */
  dataPubblicazione?: string;
  /** Path delle pagine di anteprima (`preview_books_images.path_img`). */
  anteprime: string[];
};

const COLORI: ColoreLibro[] = ["blu", "giallo", "verde", "rosso"];

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asColore(value: unknown): ColoreLibro {
  if (value === "blu" || value === "giallo" || value === "verde" || value === "rosso") {
    return value;
  }
  return COLORI[0];
}

export function mapApiLibro(raw: unknown): Libro | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const slug = asText(row.slug);
  const titolo = asText(row.titolo);
  if (!slug || !titolo) return null;

  const copertina = asText(row.copertina) || undefined;
  const dataPubblicazione = asText(row.dataPubblicazione) || undefined;

  return {
    slug,
    titolo,
    sottotitolo: asText(row.sottotitolo),
    descrizione: asText(row.descrizione),
    temi: asStringArray(row.temi),
    strumenti: asStringArray(row.strumenti),
    amazonUrl: asText(row.amazonUrl),
    colore: asColore(row.colore),
    copertina,
    dataPubblicazione,
    anteprime: asStringArray(row.anteprime),
  };
}

export function formatDataPubblicazione(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function fetchLibri(): Promise<Libro[]> {
  const response = await fetch("/api/books");
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; books?: unknown; error?: string }
    | null;

  if (!response.ok || !payload?.ok || !Array.isArray(payload.books)) {
    throw new Error(payload?.error ?? "Catalogo non disponibile.");
  }

  return payload.books
    .map(mapApiLibro)
    .filter((libro): libro is Libro => libro !== null);
}

export async function fetchLibro(slug: string): Promise<Libro | null> {
  const response = await fetch(`/api/books/${encodeURIComponent(slug)}`);
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; book?: unknown; error?: string }
    | null;

  if (response.status === 404) return null;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error ?? "Catalogo non disponibile.");
  }

  return mapApiLibro(payload.book);
}
