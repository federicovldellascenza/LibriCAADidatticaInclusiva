import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

export function NonTrovata() {
  usePageMeta({
    title: "Pagina non trovata | Didattica inclusiva",
    description: "Questa pagina non esiste. Torna ai libri in CAA per la didattica inclusiva.",
    path: "/404",
  });
  return (
    <div className="empty">
      <h1>Pagina non trovata</h1>
      <p>Il percorso che hai aperto non esiste.</p>
      <Link className="btn" to="/">
        Torna alla home
      </Link>
    </div>
  );
}
