import type { Env } from "./env";
import { json } from "./json";

const TABLE = "books";

const COLUMNS = [
  "id",
  "slug",
  "title",
  "small_desc",
  "long_desc",
  "tags_json",
  "tools_json",
  "path_cover",
  "link_buy",
  "data_publishing",
] as const;

const COLUMNS_WITHOUT_SLUG = COLUMNS.filter((column) => column !== "slug");

const COLORI = ["blu", "giallo", "verde", "rosso"] as const;

export type LibroDto = {
  slug: string;
  titolo: string;
  sottotitolo: string;
  descrizione: string;
  temi: string[];
  strumenti: string[];
  amazonUrl: string;
  colore: (typeof COLORI)[number];
  copertina?: string;
  dataPubblicazione?: string;
};

type BookRow = {
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  small_desc?: unknown;
  long_desc?: unknown;
  tags_json?: unknown;
  tools_json?: unknown;
  path_cover?: unknown;
  link_buy?: unknown;
  data_publishing?: unknown;
};

function asText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function asId(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return 0;
}

function parseStringArray(value: unknown): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function rowSlug(row: BookRow): string {
  const stored = slugify(asText(row.slug));
  if (stored) return stored;
  const fromTitle = slugify(asText(row.title));
  if (fromTitle) return fromTitle;
  const id = asId(row.id);
  return id ? `libro-${id}` : "";
}

function mapRow(row: BookRow): LibroDto | null {
  const slug = rowSlug(row);
  const titolo = asText(row.title);
  if (!slug || !titolo) return null;

  const copertina = asText(row.path_cover) || undefined;
  const dataPubblicazione = asText(row.data_publishing) || undefined;
  const id = asId(row.id);

  return {
    slug,
    titolo,
    sottotitolo: asText(row.small_desc),
    descrizione: asText(row.long_desc),
    temi: parseStringArray(row.tags_json),
    strumenti: parseStringArray(row.tools_json),
    amazonUrl: asText(row.link_buy),
    colore: COLORI[Math.abs(id - 1) % COLORI.length],
    copertina,
    dataPubblicazione,
  };
}

function isMissingSlugColumn(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /no such column:\s*slug/i.test(message);
}

async function selectBooks(db: D1Database, withSlug: boolean): Promise<BookRow[]> {
  const columns = (withSlug ? COLUMNS : COLUMNS_WITHOUT_SLUG).join(", ");
  const sql = `SELECT ${columns} FROM ${TABLE} ORDER BY data_publishing DESC, id DESC`;
  const result = await db.prepare(sql).all<BookRow>();
  return result.results ?? [];
}

async function selectBookBySlug(db: D1Database, slug: string): Promise<BookRow | null> {
  const sql = `SELECT ${COLUMNS.join(", ")} FROM ${TABLE} WHERE slug = ?`;
  const row = await db.prepare(sql).bind(slug).first<BookRow>();
  return row ?? null;
}

async function listRows(db: D1Database): Promise<BookRow[]> {
  try {
    return await selectBooks(db, true);
  } catch (error) {
    if (!isMissingSlugColumn(error)) throw error;
    return await selectBooks(db, false);
  }
}

export async function handleBooksGet(env: Env): Promise<Response> {
  try {
    const rows = await listRows(env.DB);
    const books = rows.map(mapRow).filter((book): book is LibroDto => book !== null);
    return json({ ok: true, books });
  } catch {
    return json({ ok: false, error: "Catalogo non disponibile." }, 503);
  }
}

export async function getBookBySlug(
  env: Env,
  slugParam: string,
): Promise<LibroDto | null> {
  const slug = slugify(decodeURIComponent(slugParam));
  if (!slug) return null;

  let row: BookRow | null = null;
  try {
    row = await selectBookBySlug(env.DB, slug);
  } catch (error) {
    if (!isMissingSlugColumn(error)) throw error;
  }

  if (!row) {
    const rows = await listRows(env.DB);
    row = rows.find((candidate) => rowSlug(candidate) === slug) ?? null;
  }

  const book = row ? mapRow(row) : null;
  if (!book || book.slug !== slug) return null;
  return book;
}

export async function handleBookBySlugGet(env: Env, slugParam: string): Promise<Response> {
  try {
    const book = await getBookBySlug(env, slugParam);
    if (!book) {
      return json({ ok: false, error: "Libro non trovato." }, 404);
    }

    return json({ ok: true, book });
  } catch {
    return json({ ok: false, error: "Catalogo non disponibile." }, 503);
  }
}

export function booksPathSlug(pathname: string): string | null {
  const match = pathname.match(/^\/api\/books\/([^/]+)$/);
  return match ? match[1] : null;
}

export function pageBookSlug(pathname: string): string | null {
  const match = pathname.match(/^\/libri\/([^/]+)$/);
  return match ? match[1] : null;
}
