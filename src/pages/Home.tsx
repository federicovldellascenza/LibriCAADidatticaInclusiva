import { BookCard } from "../components/BookCard";
import { libri } from "../data/libri";

export function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="titolo-sito">
        <span className="hero-kicker">Didattica inclusiva</span>
        <h1 id="titolo-sito">Libri in CAA per la Didattica Inclusiva</h1>
        <p>
          Albi e materiali in Comunicazione Aumentativa Alternativa, pensati
          per la scuola e per casa: linguaggio chiaro, pittogrammi, routine e
          storie che aiutano ogni bambino a capire, scegliere e partecipare.
        </p>
        <span className="blob blob-a" aria-hidden="true" />
        <span className="blob blob-b" aria-hidden="true" />
        <span className="blob blob-c" aria-hidden="true" />
      </section>

      <div className="section-head">
        <h2>I libri</h2>
      </div>
      <section className="book-grid" aria-label="Elenco dei libri">
        {libri.map((libro) => (
          <BookCard key={libro.slug} libro={libro} />
        ))}
      </section>
    </>
  );
}
