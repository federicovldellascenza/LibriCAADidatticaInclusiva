import { useState, type FormEvent } from "react";
import { usePageMeta } from "../hooks/usePageMeta";

type Status = "idle" | "sending" | "ok" | "err";

export function ChiSiamo() {
  usePageMeta({
    title: "Chi siamo | Libri in CAA — Roberta Panaccione",
    description:
      "Il progetto di libri in CAA e materiale CAA di Roberta Panaccione: didattica inclusiva, pittogrammi e libri facilitati per la scuola e per casa.",
    path: "/chi-siamo",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: String(data.get("nome") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          messaggio: String(data.get("messaggio") ?? "").trim(),
          website: String(data.get("website") ?? ""),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        setStatus("err");
        setMessage(
          payload?.error ??
            "Non è stato possibile inviare il messaggio. Riprova più tardi.",
        );
        return;
      }

      setStatus("ok");
      setMessage("Messaggio inviato. Ti risponderemo il prima possibile.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage(
        "Connessione non riuscita. In locale il form funziona con npm run dev:cf, oppure sul sito pubblicato.",
      );
    }
  }

  return (
    <>
      <h1>Chi siamo</h1>
      <div className="about-grid">
        <article className="panel">
          <h2>Progetto di Didattica Inclusiva in CAA</h2>
          <p>
          Questo progetto nasce per rispondere ai bisogni educativi speciali nella scuola primaria, realizzando libri didattici illustrati in Comunicazione Aumentativa e Alternativa (CAA). L'obiettivo principale è facilitare l'accesso all'apprendimento di tutte le discipline scolastiche, trasformando i concetti complessi in contenuti chiari, visivi e accessibili. Ogni volume è progettato per supportare la comprensione e l'autonomia di ogni alunno, garantendo a tutti la possibilità di studiare insieme.
          </p>

          <h2>Un Supporto Concreto per l'Apprendimento</h2>
          <p>
          Attraverso l'uso mirato di simboli visivi e testi semplificati, il progetto offre materiali operativi per le materie della scuola primaria, riducendo le difficoltà di decodifica e favorendo la partecipazione attiva in classe. Strumenti inclusivi pensati per valorizzare le capacità di ciascuno, abbattere le barriere cognitive e rendere lo studio quotidiano un'esperienza accessibile a tutti gli studenti.
          </p>
        </article>

        <section className="panel" aria-labelledby="contatti-titolo">
          <h2 id="contatti-titolo">Scrivici</h2>
          <p>
            Domande sui materiali, adozioni in classe o una collaborazione:
            compila il modulo. Ti risponderemo all’indirizzo che indichi.
          </p>
          <form className="form" onSubmit={onSubmit}>
            <label>
              Nome
              <input name="nome" type="text" autoComplete="name" required maxLength={120} />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required maxLength={120} />
            </label>
            <label>
              Messaggio
              <textarea name="messaggio" required maxLength={4000} />
            </label>
            <input
              className="honeypot"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Invio in corso…" : "Invia il messaggio"}
            </button>
            {message ? (
              <p className={`form-status ${status === "ok" ? "ok" : "err"}`} role="status">
                {message}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </>
  );
}
