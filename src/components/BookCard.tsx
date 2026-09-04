import { Link } from "react-router-dom";
import type { Libro } from "../data/libri";
import { CoverPlaceholder } from "./CoverPlaceholder";

export function BookCard({ libro }: { libro: Libro }) {
  return (
    <Link className="book-card" to={`/libri/${libro.slug}`}>
      <CoverPlaceholder libro={libro} />
      <div className="book-card-body">
        <h3>{libro.titolo}</h3>
        <p>{libro.sottotitolo}</p>
        <span className="chip">Scopri il libro</span>
      </div>
    </Link>
  );
}
