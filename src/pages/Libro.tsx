import { Link, useParams } from "react-router-dom";
import { CoverPlaceholder } from "../components/CoverPlaceholder";
import { getLibro } from "../data/libri";

export function Libro() {
  const { slug } = useParams();
  const libro = slug ? getLibro(slug) : undefined;

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
          <p>{libro.descrizione}</p>
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
        </div>
      </div>

      <section className="panel panel-spaced">
        <h2>Temi affrontati</h2>
        <ul className="tag-list">
          {libro.temi.map((tema) => (
            <li key={tema}>{tema}</li>
          ))}
        </ul>
        <h2>Strumenti presenti</h2>
        <ul className="tool-list">
          {libro.strumenti.map((strumento) => (
            <li key={strumento}>{strumento}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
