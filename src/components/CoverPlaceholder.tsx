import type { Libro } from "../data/libri";

type Props = {
  libro: Libro;
  large?: boolean;
};

export function CoverPlaceholder({ libro, large = false }: Props) {
  if (libro.copertina) {
    return (
      <div className="cover cover-photo">
        <img
          src={libro.copertina}
          alt={`Copertina di ${libro.titolo}`}
          width={large ? 400 : 240}
          height={large ? 600 : 360}
        />
      </div>
    );
  }

  return (
    <div className={`cover cover-${libro.colore}`}>
      <p className="cover-title">{libro.titolo}</p>
    </div>
  );
}
