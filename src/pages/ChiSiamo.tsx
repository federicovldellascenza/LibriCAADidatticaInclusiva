import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "ok" | "err";

export function ChiSiamo() {
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
          response.status === 404
            ? "Il form si attiva dopo il deploy su Cloudflare, oppure in locale con npm run pages."
            : (payload?.error ??
                "Non è stato possibile inviare il messaggio. Riprova più tardi."),
        );
        return;
      }

      setStatus("ok");
      setMessage("Messaggio inviato. Ti risponderemo il prima possibile.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage(
        "Connessione non riuscita. Se stai usando npm run dev, il form funziona con npm run pages oppure dopo il deploy su Cloudflare.",
      );
    }
  }

  return (
    <>
      <h1>Chi siamo</h1>
      <div className="about-grid">
        <article className="panel">
          <h2>Il progetto</h2>
          <p>
            Placeholder. Questo spazio racconta chi scrive e pubblica i libri:
            un progetto piccolo, pensato per insegnanti, famiglie e operatori
            che cercano materiali in CAA già pronti, rispettosi e facili da
            usare in classe o a casa.
          </p>
          <p>
            Placeholder. L’idea è semplice: testi brevi, pittogrammi chiari,
            strumenti da fotocopiare o plastificare, senza promettere ricette
            magiche. Ogni bambino comunica a modo suo; i libri vogliono essere
            un ponte, non un protocollo unico.
          </p>
          <p>
            Placeholder. Qui potrai inserire la presentazione dell’autrice o
            del gruppo di lavoro, eventuali collaborazioni con scuole e
            servizi, e come vengono scelti i simboli.
          </p>
        </article>

        <section className="panel" aria-labelledby="contatti-titolo">
          <h2 id="contatti-titolo">Scrivici</h2>
          <p>
            Domande sui materiali, adozioni in classe, o una collaborazione:
            compila il modulo. L’indirizzo di destinazione verrà configurato in
            seguito su Cloudflare.
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
