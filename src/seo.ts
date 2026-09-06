export const SITE_URL = "https://didatticainclusiva.it";
export const SITE_NAME = "Didattica Inclusiva";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/copertine/cover_storia_geografia_3.png`;

export const DEFAULT_DESCRIPTION =
  "Libri in CAA per bambini, storie CAA e libri facilitati: materiale CAA in Comunicazione Aumentativa Alternativa per la didattica inclusiva a scuola e a casa.";

export function stripHtmlToText(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
