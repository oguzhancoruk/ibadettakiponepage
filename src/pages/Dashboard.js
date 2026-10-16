import { t } from "../context/Preferences";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiRefreshCw,
  FiMoon,
  FiUser,
  FiLogOut,
  FiGrid,
  FiUsers,
  FiAward,
  FiPlay,
  FiArrowUpRight,
  FiSearch,
  FiSettings,
} from "react-icons/fi";
import logo from "../components/assets/images/1.png";
import { LoadingProvider } from "../context/LoadingContext";
import { getSession, clearSession } from "../utils/session";
import "./Dashboard.css";
const links = [
  ["/dashboard", "Bugün", FiHome],
  ["/daily", "Namazlarım", FiCalendar],
  ["/kaza", "Kaza borcum", FiRefreshCw],
  ["/fasting", "Oruç takibi", FiMoon],
  ["/tools", "Keşfet", FiGrid],
  ["/family", "Ailem", FiUsers],
  ["/friends", "Arkadaşlarım", FiUsers],
  ["/achievements", "Rozetlerim", FiAward],
  ["/games", "Oyunlar", FiPlay],
  ["/account", "Hesabım", FiUser],
];
export default function Dashboard() {
  const user = getSession();
  const location = useLocation();
  const inTools = [
    "/reports",
    "/journal",
    "/challenges",
    "/activity",
    "/qibla",
    "/mosques",
    "/guide",
    "/settings",
    "/support",
    "/subscription",
    "/search",
    "/tools",
    "/tesbih",
    "/duas",
    "/hatim",
    "/family",
    "/friends",
    "/achievements",
    "/games",
  ].some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`)
  );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <LoadingProvider>
      <div className="pt-app">
        <a className="pt-skip" href="#main-content">
          {t("İçeriğe geç")}
        </a>
        <aside className="pt-sidebar">
          <NavLink to="/dashboard" className="pt-brand">
            <img src={logo} alt="" />
            <span>
              {t("İbadet Takip")}
              <small>{t("Her gün, küçük bir adım.")}</small>
            </span>
          </NavLink>
          <p className="pt-nav-label">{t("İBADET GÜNLÜĞÜM")}</p>
          <nav aria-label={t("Ana menü")} className="pt-side-links">
            {links.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Icon size={20} />
                <span>{t(label)}</span>
              </NavLink>
            ))}
          </nav>
          <div className="pt-sidebar-note">
            <FiMoon size={25} />
            <p>
              {t("Günün içinde")}
              <br />
              <strong>{t("kendine bir mola ver.")}</strong>
            </p>
            <span>{t("İbadetlerin her cihazda yanında.")}</span>
          </div>
          <a className="pt-public-link" href="/">
            {t("Tanıtım sayfası ")}
            <FiArrowUpRight />
          </a>
        </aside>
        <div className="pt-workspace">
          <header className="pt-topbar">
            <NavLink
              to="/search"
              className="pt-icon-button"
              aria-label={t("Uygulamada ara")}
            >
              <FiSearch />
            </NavLink>
            <NavLink
              to="/settings"
              className="pt-icon-button"
              aria-label={t("Uygulama ayarları")}
            >
              <FiSettings />
            </NavLink>
            <span className="pt-topbar-title">{t("İbadet günlüğün")}</span>
            <NavLink className="pt-user-pill" to="/account">
              <span className="pt-avatar">
                {t(
                  (user.name || user.username || "K")
                    .slice(0, 1)
                    .toLocaleUpperCase("tr")
                )}
              </span>
              <span>{user.name || user.username || t("Hesabım")}</span>
            </NavLink>
            <button
              className="pt-icon-button"
              aria-label={t("Çıkış yap")}
              onClick={async () => {
                await clearSession();
                window.location.assign("/login");
              }}
            >
              <FiLogOut />
            </button>
          </header>
          <main id="main-content" className="pt-main">
            <Outlet />
          </main>
          <footer className="pt-app-footer">
            {t("İbadet Takip ")}
            <span>{t("Biraz niyet, biraz istikrar.")}</span>
          </footer>
        </div>
        <nav className="pt-bottom-nav" aria-label={t("Mobil menü")}>
          {links
            .filter(([to]) =>
              ["/dashboard", "/daily", "/kaza", "/fasting", "/tools"].includes(
                to
              )
            )
            .map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive || (to === "/tools" && inTools) ? "active" : ""
                }
              >
                <Icon size={21} />
                <span>{t(label)}</span>
              </NavLink>
            ))}
        </nav>
      </div>
    </LoadingProvider>
  );
}
