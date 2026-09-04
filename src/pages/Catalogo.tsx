import { BookCard } from "../components/BookCard";
import { libri } from "../data/libri";

export function Catalogo() {
  return (
    <>
      <header className="catalog-intro">
        <h1>Libri</h1>
        <p>
          Scorri lo scaffale: ogni titolo ha una pagina con i temi, gli
          strumenti e il link per l’acquisto.
        </p>
      </header>

      <section className="catalog-shelf" aria-label="Scaffale dei libri">
        <div className="catalog-scroller">
          {libri.map((libro) => (
            <BookCard key={libro.slug} libro={libro} variant="shelf" />
          ))}
        </div>
      </section>
    </>
  );
}
