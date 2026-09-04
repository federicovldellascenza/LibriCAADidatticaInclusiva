import { Link } from "react-router-dom";

export function NonTrovata() {
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
