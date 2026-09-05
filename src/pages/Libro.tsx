import { Link, useParams } from "react-router-dom";
import { HtmlContent } from "../components/HtmlContent";
import { CoverPlaceholder } from "../components/CoverPlaceholder";
import { formatDataPubblicazione } from "../data/libri";
import { useLibro } from "../hooks/useLibri";

export function Libro() {
  const { slug } = useParams();
  const { libro, error, loading } = useLibro(slug);

  if (loading) {
    return (
      <div className="empty">
        <h1>Caricamento…</h1>
        <p>Stiamo aprendo la scheda del libro.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty">
        <h1>Catalogo non disponibile</h1>
        <p>{error}</p>
        <Link className="btn" to="/libri">
          Torna ai libri
        </Link>
      </div>
    );
  }

  if (!libro) {
    return (
      <div className="empty">
        <h1>Libro non trovato</h1>
        <p>Questo titolo non è in catalogo, oppure il link non è corretto.</p>
        <Link className="btn" to="/libri">
          Torna ai libri
        </Link>
      </div>
    );
  }

  return (
    <article>
      <div className="book-layout">
        <div className="cover-frame">
          <CoverPlaceholder libro={libro} large />
        </div>
        <div>
          <p className="hero-kicker">In CAA</p>
          <h1>{libro.titolo}</h1>
          <p className="lede">{libro.sottotitolo}</p>
          {libro.dataPubblicazione ? (
            <p className="publish-date">
              Pubblicato il {formatDataPubblicazione(libro.dataPubblicazione)}
            </p>
          ) : null}
          <HtmlContent html={libro.descrizione} />
          {libro.amazonUrl ? (
            <p>
              <a
                className="btn btn-amazon"
                href={libro.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acquista su Amazon
              </a>
            </p>
          ) : null}
        </div>
      </div>

      {libro.temi.length > 0 || libro.strumenti.length > 0 ? (
        <section className="panel panel-spaced">
          {libro.temi.length > 0 ? (
            <>
              <h2>Temi affrontati</h2>
              <ul className="tag-list">
                {libro.temi.map((tema) => (
                  <li key={tema}>{tema}</li>
                ))}
              </ul>
            </>
          ) : null}
          {libro.strumenti.length > 0 ? (
            <>
              <h2>Strumenti presenti</h2>
              <ul className="tool-list">
                {libro.strumenti.map((strumento) => (
                  <li key={strumento}>{strumento}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
