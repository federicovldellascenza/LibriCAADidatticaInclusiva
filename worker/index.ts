import { handleContactPost, type ContactEnv } from "./contact";

export default {
  async fetch(request: Request, env: ContactEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContactPost(request, env);
    }

    return new Response(JSON.stringify({ ok: false, error: "Not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  },
};
