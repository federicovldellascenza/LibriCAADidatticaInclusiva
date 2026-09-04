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

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand">
          <BrandMark />
          <span>
            <p className="logo-title">Libri in CAA</p>
            <p className="logo-sub">per la Didattica Inclusiva</p>
          </span>
        </NavLink>
        <nav className="nav" aria-label="Principale">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/chi-siamo">Chi siamo</NavLink>
        </nav>
      </div>
    </header>
  );
}
