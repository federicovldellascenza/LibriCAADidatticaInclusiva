import { BookCard } from "../components/BookCard";
import { useLibri } from "../hooks/useLibri";
import { usePageMeta } from "../hooks/usePageMeta";

export function Catalogo() {
  const { libri, error, loading } = useLibri();
  usePageMeta({
    title: "Libri facilitati e storie CAA | Didattica inclusiva",
    description:
      "Scaffale di libri in CAA, storie CAA e libri facilitati per bambini: materiale CAA per la classe e per casa.",
    path: "/libri",
  });

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
        {loading ? (
          <p className="catalog-status">Caricamento scaffale…</p>
        ) : error ? (
          <div className="empty">
            <h2>Catalogo non disponibile</h2>
            <p>{error}</p>
          </div>
        ) : !libri || libri.length === 0 ? (
          <div className="empty">
            <h2>Nessun titolo in catalogo</h2>
            <p>Al momento non ci sono libri da mostrare. Riprova più tardi.</p>
          </div>
        ) : (
          <div className="catalog-scroller">
            {libri.map((libro) => (
              <BookCard key={libro.slug} libro={libro} variant="shelf" />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
