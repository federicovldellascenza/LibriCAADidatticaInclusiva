import { Outlet, useLocation } from "react-router-dom";
import { SITE_NAME, SITE_URL } from "../seo";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { JsonLd } from "./JsonLd";

export function Layout() {
  const location = useLocation();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              founder: { "@type": "Person", name: "Roberta Panaccione" },
            },
            {
              "@type": "WebSite",
              name: "Libri in CAA per la Didattica Inclusiva",
              url: SITE_URL,
              inLanguage: "it-IT",
              description:
                "Libri in CAA, storie CAA e libri facilitati per bambini, insegnanti e famiglie.",
            },
          ],
        }}
      />
      <a className="skip-link" href="#contenuto">
        Vai al contenuto
      </a>
      <Header />
      <main id="contenuto">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
