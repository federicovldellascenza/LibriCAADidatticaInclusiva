import { Link } from "react-router-dom";
import type { Libro } from "../data/libri";
import { CoverPlaceholder } from "./CoverPlaceholder";

type Props = {
  libro: Libro;
  variant?: "grid" | "shelf";
};

export function BookCard({ libro, variant = "grid" }: Props) {
  return (
    <Link className={`book-card book-card-${variant}`} to={`/libri/${libro.slug}`}>
      <CoverPlaceholder libro={libro} />
      <div className="book-card-body">
        <h3>{libro.titolo}</h3>
        <p>{libro.sottotitolo}</p>
        <span className="chip">Scopri il libro</span>
      </div>
    </Link>
  );
}
