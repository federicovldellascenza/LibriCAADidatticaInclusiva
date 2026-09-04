import { handleBookBySlugGet, handleBooksGet, booksPathSlug } from "./books";
import { handleContactPost } from "./contact";
import type { Env } from "./env";
import { json } from "./json";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContactPost(request, env);
    }

    if (url.pathname === "/api/books" && request.method === "GET") {
      return handleBooksGet(env);
    }

    const slug = booksPathSlug(url.pathname);
    if (slug !== null && request.method === "GET") {
      return handleBookBySlugGet(env, slug);
    }

    return json({ ok: false, error: "Not found." }, 404);
  },
};
