import { useEffect, useId, useState } from "react";

type Props = {
  paths: string[];
  titolo: string;
};

export function BookPreview({ paths, titolo }: Props) {
  const titleId = useId();
  const [aperto, setAperto] = useState<number | null>(null);

  useEffect(() => {
    if (aperto === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setAperto(null);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [aperto]);

  if (paths.length === 0) return null;

  const aperta = aperto !== null ? paths[aperto] : undefined;

  return (
    <div className="book-preview">
      <h2 id={titleId}>Anteprima</h2>
      <ul className="preview-strip" aria-labelledby={titleId}>
        {paths.map((path, index) => (
          <li key={`${path}-${index}`}>
            <button
              type="button"
              className="preview-thumb"
              onClick={() => setAperto(index)}
            >
              <img
                src={path}
                alt={`Anteprima ${index + 1} di ${titolo}`}
                width={120}
                height={170}
              />
            </button>
          </li>
        ))}
      </ul>

      {aperta ? (
        <div
          className="preview-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Pagina di anteprima di ${titolo}`}
          onClick={() => setAperto(null)}
        >
          <button type="button" className="preview-lightbox-close btn">
            Chiudi
          </button>
          <img
            src={aperta}
            alt={`Pagina di anteprima di ${titolo}`}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
