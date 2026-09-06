import type { LibroDto } from "./books";

const SITE_URL = "https://didatticainclusiva.it";

function escapeAttr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function stripHtmlToText(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function upsertMeta(
  html: string,
  kind: "name" | "property",
  key: string,
  content: string,
): string {
  const tag = `<meta ${kind}="${key}" content="${escapeAttr(content)}" />`;
  const pattern = new RegExp(
    `<meta[^>]*${kind}=["']${key}["'][^>]*>`,
    "i",
  );
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

function upsertTitle(html: string, title: string): string {
  const safe = escapeAttr(title);
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safe}</title>`);
  }
  return html.replace(/<\/head>/i, `    <title>${safe}</title>\n  </head>`);
}

function upsertCanonical(html: string, href: string): string {
  const tag = `<link rel="canonical" href="${escapeAttr(href)}" />`;
  if (/<link[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, tag);
  }
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

export function injectBookMeta(html: string, book: LibroDto): string {
  const title = `${book.titolo} | Libro in CAA`;
  const description =
    stripHtmlToText(book.sottotitolo || book.descrizione) ||
    `${book.titolo}: libro in CAA e materiale CAA per la didattica inclusiva.`;
  const url = `${SITE_URL}/libri/${book.slug}`;
  const image = book.copertina
    ? book.copertina.startsWith("http")
      ? book.copertina
      : `${SITE_URL}${book.copertina}`
    : `${SITE_URL}/copertine/cover_storia_geografia_3.png`;

  let next = upsertTitle(html, title);
  next = upsertCanonical(next, url);
  next = upsertMeta(next, "name", "description", description);
  next = upsertMeta(next, "property", "og:title", title);
  next = upsertMeta(next, "property", "og:description", description);
  next = upsertMeta(next, "property", "og:url", url);
  next = upsertMeta(next, "property", "og:image", image);
  next = upsertMeta(next, "name", "twitter:title", title);
  next = upsertMeta(next, "name", "twitter:description", description);
  next = upsertMeta(next, "name", "twitter:image", image);
  return next;
}
