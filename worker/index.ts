import {
  booksPathSlug,
  getBookBySlug,
  handleBookBySlugGet,
  handleBooksGet,
  pageBookSlug,
} from "./books";
import { handleContactPost } from "./contact";
import type { Env } from "./env";
import { json } from "./json";
import { injectBookMeta } from "./seoHtml";

function wantsHtml(request: Request): boolean {
  const accept = request.headers.get("Accept") ?? "";
  return accept.includes("text/html");
}

async function serveBookPage(request: Request, env: Env, slug: string): Promise<Response> {
  const asset = await env.ASSETS.fetch(request);
  try {
    const book = await getBookBySlug(env, slug);
    if (!book) return asset;
    const html = injectBookMeta(await asset.text(), book);
    const headers = new Headers(asset.headers);
    headers.set("Content-Type", "text/html; charset=utf-8");
    return new Response(html, { status: asset.status, headers });
  } catch {
    return asset;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContactPost(request, env);
    }

    if (url.pathname === "/api/books" && request.method === "GET") {
      return handleBooksGet(env);
    }

    const apiSlug = booksPathSlug(url.pathname);
    if (apiSlug !== null && request.method === "GET") {
      return handleBookBySlugGet(env, apiSlug);
    }

    const pageSlug = pageBookSlug(url.pathname);
    if (url.pathname.startsWith("/libri/")) {
      if (pageSlug !== null && request.method === "GET" && wantsHtml(request)) {
        return serveBookPage(request, env, pageSlug);
      }
      return env.ASSETS.fetch(request);
    }

    return json({ ok: false, error: "Not found." }, 404);
  },
};
