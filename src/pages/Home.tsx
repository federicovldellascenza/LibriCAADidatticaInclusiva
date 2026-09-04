import { Link } from "react-router-dom";
import { CoverPlaceholder } from "../components/CoverPlaceholder";
import { libri } from "../data/libri";

const inEvidenza = libri.slice(0, 2);

export function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="titolo-sito">
        <span className="hero-kicker">Didattica inclusiva</span>
        <h1 id="titolo-sito">Libri in CAA per la Didattica Inclusiva</h1>
        <p>
          Un’iniziativa piccola e concreta: albi e materiali in Comunicazione
          Aumentativa Alternativa per la scuola e per casa. Linguaggio chiaro,
          pittogrammi, routine e storie che aiutano ogni bambino a capire,
          scegliere e partecipare — senza isolare nessuno dal gruppo.
        </p>
        <span className="blob blob-a" aria-hidden="true" />
        <span className="blob blob-b" aria-hidden="true" />
        <span className="blob blob-c" aria-hidden="true" />
      </section>

      <section className="overview-grid" aria-label="Di che si tratta">
        <article className="panel overview-card">
          <h2>CAA, in pratica</h2>
          <p>
            Pittogrammi e frasi brevi per nominare emozioni, fare richieste e
            seguire una sequenza. Strumenti da usare in classe, a casa o in
            terapia, insieme all’adulto.
          </p>
        </article>
        <article className="panel overview-card">
          <h2>Per la classe e per casa</h2>
          <p>
            Materiali pensati per insegnanti, famiglie e compagni di banco:
            stesso linguaggio, stessi simboli, meno interruzioni tra i
            contesti.
          </p>
        </article>
        <article className="panel overview-card">
          <h2>Rispetto prima di tutto</h2>
          <p>
            Ogni bambino comunica a modo suo. I libri vogliono essere un ponte,
            non una ricetta unica né un protocollo da applicare a tutti.
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
            {inEvidenza.map((libro, index) => (
              <Link
                key={libro.slug}
                className={`featured-cover featured-cover-${index}`}
                to={`/libri/${libro.slug}`}
              >
                <CoverPlaceholder libro={libro} />
              </Link>
            ))}
          </div>
          <div className="featured-copy panel">
            <p>
              In evidenza, due copertine. Il catalogo completo — con temi,
              strumenti e link Amazon — sta nella pagina Libri, da scorrere
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
