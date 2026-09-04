export type ContactEnv = {
  CONTACT_TO_EMAIL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_FROM_MAIL?: string;
};

type Body = {
  nome?: unknown;
  email?: unknown;
  messaggio?: unknown;
  website?: unknown;
};

const MAX_NOME = 120;
const MAX_EMAIL = 120;
const MAX_MESSAGGIO = 4000;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function asText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function handleContactPost(
  request: Request,
  env: ContactEnv,
): Promise<Response> {
  const { CONTACT_TO_EMAIL, RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_MAIL } =
    env;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, error: "Richiesta non valida." }, 400);
  }

  if (asText(body.website, 200)) {
    return json({ ok: true });
  }

  const nome = asText(body.nome, MAX_NOME);
  const email = asText(body.email, MAX_EMAIL);
  const messaggio = asText(body.messaggio, MAX_MESSAGGIO);

  if (!nome || !email || !messaggio) {
    return json({ ok: false, error: "Compila nome, email e messaggio." }, 400);
  }

  if (!isEmail(email)) {
    return json({ ok: false, error: "Inserisci un indirizzo email valido." }, 400);
  }

  if (!CONTACT_TO_EMAIL || !RESEND_API_KEY) {
    return json(
      {
        ok: false,
        error:
          "Invio email non configurato. Imposta CONTACT_TO_EMAIL e RESEND_API_KEY su Cloudflare (Variables and Secrets).",
      },
      503,
    );
  }

  const from =
    RESEND_FROM_EMAIL || RESEND_FROM_MAIL || "Libri CAA <onboarding@resend.dev>";
  const text = [`Nome: ${nome}`, `Email: ${email}`, "", messaggio].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Messaggio dal sito — ${nome}`,
      text,
    }),
  });

  if (!resendResponse.ok) {
    return json(
      {
        ok: false,
        error: "Il servizio di posta ha rifiutato l'invio. Riprova più tardi.",
      },
      502,
    );
  }

  return json({ ok: true });
}
