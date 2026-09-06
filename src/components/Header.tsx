import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#1e88e5" stroke="#1b2a6b" strokeWidth="3" />
      <rect x="11" y="9" width="26" height="30" rx="4" fill="#ffc107" stroke="#1b2a6b" strokeWidth="3" />
      <path d="M24 9v30" stroke="#1b2a6b" strokeWidth="3" />
    </svg>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <NavLink to="/" end onClick={onNavigate}>
        Home
      </NavLink>
      <NavLink to="/libri" onClick={onNavigate}>
        Libri
      </NavLink>
      <NavLink to="/chi-siamo" onClick={onNavigate}>
        Chi siamo
      </NavLink>
    </>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const goingDown = y > lastY && y > 48;
      setHidden(goingDown);
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const headerHidden = hidden && !menuOpen;

  return (
    <header className={`site-header${headerHidden ? " site-header-hidden" : ""}`}>
      <div className="header-inner">
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <BrandMark />
          <span>
            <p className="logo-title">Libri in CAA</p>
            <p className="logo-sub">per la Didattica Inclusiva</p>
          </span>
        </NavLink>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="menu-principale"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Chiudi" : "Menu"}
        </button>
        <nav id="menu-principale" className={`nav${menuOpen ? " nav-open" : ""}`} aria-label="Principale">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
