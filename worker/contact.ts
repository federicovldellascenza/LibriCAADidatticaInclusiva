import type { Env } from "./env";
import { json } from "./json";

type Body = {
  nome?: unknown;
  email?: unknown;
  messaggio?: unknown;
  website?: unknown;
};

const MAX_NOME = 120;
const MAX_EMAIL = 120;
const MAX_MESSAGGIO = 4000;

function asText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function asHeaderSafe(value: unknown, max: number): string {
  return asText(value, max)
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isEmail(value: string): boolean {
  if (value.length === 0 || value.length > MAX_EMAIL) return false;
  if (/[\s"<>/?&\\,;:()[\]{}]/.test(value)) return false;
  if (value.includes("..")) return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,63})+$/.test(
    value,
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildEmailBody(nome: string, email: string, messaggio: string): {
  text: string;
  html: string;
} {
  const text = [
    "Nuovo messaggio dal form del sito",
    "",
    `Nome: ${nome}`,
    `Email di chi scrive: ${email}`,
    "",
    "Messaggio:",
    messaggio,
  ].join("\n");

  const html = `
    <p><strong>Nuovo messaggio dal form del sito</strong></p>
    <p>
      <strong>Nome:</strong> ${escapeHtml(nome)}<br />
      <strong>Email di chi scrive:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
    </p>
    <p><strong>Messaggio:</strong></p>
    <p>${escapeHtml(messaggio).replaceAll("\n", "<br />")}</p>
  `.trim();

  return { text, html };
}

export async function handleContactPost(
  request: Request,
  env: Env,
): Promise<Response> {
  const { CONTACT_TO_EMAIL, RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_MAIL } =
    env;

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return json({ ok: false, error: "Richiesta non valida." }, 400);
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return json({ ok: false, error: "Richiesta non valida." }, 400);
  }

  const body = parsed as Body;

  if (asText(body.website, 200)) {
    return json({ ok: true });
  }

  const nome = asHeaderSafe(body.nome, MAX_NOME);
  const email = asHeaderSafe(body.email, MAX_EMAIL);
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
        error: `Errore nell'invio dell'email lato sito. Riprova più tardi.`,
      },
      503,
    );
  }

  const from =
    RESEND_FROM_EMAIL || RESEND_FROM_MAIL || "Libri CAA <onboarding@resend.dev>";
  const { text, html } = buildEmailBody(nome, email, messaggio);

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
      subject: `Messaggio dal sito — ${nome} <${email}>`,
      text,
      html,
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
