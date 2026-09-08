import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Dog,
  Menu,
  PawPrint,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { API_URL } from "../services/api";

const links = [
  { label: "Visão geral", to: "/", icon: BarChart3 },
  { label: "Tutores", to: "/tutores", icon: Users },
  { label: "Cães", to: "/caes", icon: Dog },
  { label: "Treinos", to: "/treinos", icon: Activity },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const current =
    links.find((link) => link.to === location.pathname)?.label || "Visão geral";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <PawPrint size={21} />
          </span>
          <span>
            Adestra<span className="brand-accent">SaaS</span>
          </span>
        </div>
        <button
          className="mobile-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
        <div className="sidebar-label">Workspace</div>
        <nav className="nav-list" aria-label="Navegação principal">
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />
            <div>
              <strong>API operacional</strong>
              <small>{API_URL.replace("http://", "")}</small>
            </div>
          </div>
          <div className="profile-mini">
            <div className="avatar">MC</div>
            <div>
              <strong>Marina Costa</strong>
              <small>Adestradora</small>
            </div>
            <span className="profile-more">•••</span>
          </div>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="scrim"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={21} />
          </button>
          <div>
            <p className="eyebrow">QUINTA-FEIRA, 27 DE AGOSTO</p>
            <h1>{current}</h1>
          </div>
          <div className="topbar-actions">
            <span className="connection">
              <span className="status-dot" /> Conectado à API
            </span>
            <button className="icon-button" aria-label="Notificações">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="avatar avatar-large">MC</div>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
