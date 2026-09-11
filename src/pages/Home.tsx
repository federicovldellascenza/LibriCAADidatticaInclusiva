import { Link } from "react-router-dom";
import { CoverPlaceholder } from "../components/CoverPlaceholder";
import { useLibri } from "../hooks/useLibri";
import { usePageMeta } from "../hooks/usePageMeta";

export function Home() {
  const { libri, error, loading } = useLibri();
  const inEvidenza = (libri ?? []).slice(0, 2);
  usePageMeta({
    title: "Libri in CAA per bambini | Didattica inclusiva",
    description:
      "Libri in CAA per bambini, storie CAA e libri facilitati: materiale CAA in Comunicazione Aumentativa Alternativa per la didattica inclusiva a scuola e a casa.",
    path: "/",
  });

  return (
    <>
      <section className="hero" aria-labelledby="titolo-sito">
        <span className="hero-kicker">Didattica inclusiva</span>
        <h1 id="titolo-sito">Libri in CAA per la Didattica Inclusiva</h1>
        <p>
        Strumenti editoriali pensati per rendere i Saperi disciplinari accessibili a tutti. 
        Grazie all'integrazione di simboli e testi fluidi, 
        trasformano la lettura in un'esperienza inclusiva che azzera le barriere 
        e restituisce a ogni alunno il piacere e l'autonomia dell'apprendimento.
        </p>
        <span className="blob blob-a" aria-hidden="true" />
        <span className="blob blob-b" aria-hidden="true" />
        <span className="blob blob-c" aria-hidden="true" />
      </section>

      <section className="overview-grid" aria-label="Di che si tratta">
        <article className="panel overview-card">
          <h2>CAA</h2>
          <p>
          I libri con la CAA affiancano al testo scritto dei simboli visivi immediati.
          Sono strumenti fondamentali per superare le barriere di decodifica, 
          trasformare i concetti astratti in immagini accessibili e garantire a ogni 
          alunno autonomia e inclusione reale nella lettura.
          </p>
        </article>
        <article className="panel overview-card">
          <h2>Oltre ogni ostacolo per un sapere accessibile</h2>
          <p>
          Un progetto didattico che rimuove gli ostacoli alla comprensione 
          attraverso testi semplificati, font ad alta leggibilità e simboli CAA. 
          Ogni pagina è pensata per azzerare la frustrazione, valorizzare 
          i punti di forza di ciascuno e garantire a ogni alunno un accesso equo, 
          autonomo e gratificante alla conoscenza.
          </p>
        </article>
        <article className="panel overview-card">
          <h2>Rispetto prima di tutto</h2>
          <p>
            Ogni bambino comunica a modo suo. I libri vogliono essere un ponte,
            non una ricetta unica né un protocollo da applicare a tutti. 
            Materiali pensati per insegnanti, famiglie e compagni di banco: 
            stesso linguaggio, stessi simboli, meno interruzioni tra i contesti.
          </p>
        </article>
      </section>

      <section className="featured" aria-labelledby="copertine-titolo">
        <div className="section-head">
          <h2 id="copertine-titolo">Due titoli per iniziare</h2>
          <Link className="text-link" to="/libri">
            Vedi tutti
          </Link>
        </div>
        <div className="featured-row">
          <div className="featured-covers">
            {loading ? (
              <p className="catalog-status">Caricamento titoli…</p>
            ) : error ? (
              <p className="catalog-status">{error}</p>
            ) : inEvidenza.length === 0 ? (
              <p className="catalog-status">
                Nessun titolo in evidenza al momento.
              </p>
            ) : (
              inEvidenza.map((libro, index) => (
                <Link
                  key={libro.slug}
                  className={`featured-cover featured-cover-${index}`}
                  to={`/libri/${libro.slug}`}
                >
                  <CoverPlaceholder libro={libro} />
                </Link>
              ))
            )}
          </div>
          <div className="featured-copy panel">
            <p>
              In evidenza, due copertine. Il catalogo completo — con temi,
              strumenti e link Amazon — si trova nella pagina Libri, da scorrere
              in orizzontale come uno scaffale.
            </p>
            <Link className="btn btn-amazon" to="/libri">
              Vai allo scaffale
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
