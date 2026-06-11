import {
  Boxes,
  CalendarDays,
  Car,
  ChevronRight,
  CircleUserRound,
  Gauge,
  LifeBuoy,
  LogOut,
  MapPinned,
  Menu,
  MessageSquareText,
  PackageSearch,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Loading } from "../shared/components/Loading";

const userNav = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/masina-mea", label: "Mașina mea", icon: Car },
  { to: "/model-3d", label: "Model 3D", icon: Boxes },
  { to: "/piese", label: "Piese", icon: PackageSearch },
  { to: "/service-uri", label: "Service-uri", icon: MapPinned },
  { to: "/programari", label: "Programări", icon: CalendarDays },
  { to: "/asistenta", label: "Asistență rutieră", icon: LifeBuoy },
  { to: "/chat", label: "Chat", icon: MessageSquareText },
  { to: "/profil", label: "Profil", icon: CircleUserRound },
];

const mechanicNav = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/mecanic/piese", label: "Piese service", icon: PackageSearch },
  { to: "/mecanic/programari", label: "Programări", icon: CalendarDays },
  { to: "/mecanic/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/mecanic/asistenta", label: "Cereri asistență", icon: LifeBuoy },
  { to: "/chat", label: "Chat", icon: MessageSquareText },
  { to: "/profil", label: "Profil service", icon: Wrench },
];

export function MainLayout() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  if (!auth.ready) return <Loading />;
  if (!auth.authenticated) return <Navigate to="/" replace />;

  const mechanic = auth.roles.includes("MECHANIC") || auth.roles.includes("ADMIN");
  const nav = mechanic ? mechanicNav : userNav;

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Car size={22} /></div>
          <div>
            <strong>AutoAssist</strong>
            <span>3D PLATFORM</span>
          </div>
          <button className="icon-button sidebar-close" onClick={() => setOpen(false)}><X /></button>
        </div>
        <div className="role-chip">
          <span className="status-dot" />
          Mod {mechanic ? "mecanic" : "utilizator"}
        </div>
        <nav className="sidebar-nav">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              <Icon size={19} />
              <span>{label}</span>
              <ChevronRight className="nav-chevron" size={16} />
            </NavLink>
          ))}
        </nav>
        <button className="logout-button" onClick={auth.logout}>
          <LogOut size={18} /> Deconectare
        </button>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setOpen(true)}><Menu /></button>
          <div className="system-status">
            <span className="status-dot" />
            Toate sistemele operaționale
          </div>
          <div className="user-pill">
            <div className="avatar">{auth.username.slice(0, 1).toUpperCase()}</div>
            <div><strong>{auth.username}</strong><span>{mechanic ? "Mecanic autorizat" : "Șofer"}</span></div>
          </div>
        </header>
        <section className="page-content"><Outlet /></section>
      </main>
      {open && <button className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}

