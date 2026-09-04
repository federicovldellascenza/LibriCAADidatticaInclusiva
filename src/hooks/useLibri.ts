import { useEffect, useState } from "react";
import { fetchLibri, fetchLibro, type Libro } from "../data/libri";

const DEV_HINT =
  "In locale il catalogo funziona con npm run dev:cf, oppure sul sito pubblicato.";

export function useLibri() {
  const [libri, setLibri] = useState<Libro[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchLibri()
      .then((data) => {
        if (!cancelled) setLibri(data);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        const message = cause instanceof Error ? cause.message : "";
        setError(
          message && message !== "Catalogo non disponibile."
            ? message
            : DEV_HINT,
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    libri,
    error,
    loading: libri === null && error === null,
  };
}

export function useLibro(slug: string | undefined) {
  const [libro, setLibro] = useState<Libro | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLibro(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLibro(undefined);
    setError(null);

    fetchLibro(slug)
      .then((data) => {
        if (!cancelled) setLibro(data);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        const message = cause instanceof Error ? cause.message : "";
        setError(
          message && message !== "Catalogo non disponibile."
            ? message
            : DEV_HINT,
        );
        setLibro(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return {
    libro,
    error,
    loading: Boolean(slug) && libro === undefined && error === null,
  };
}
