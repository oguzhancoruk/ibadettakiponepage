import { t } from "../../context/Preferences";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiUser,
  FiUsers,
  FiAward,
  FiPlay,
} from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import "./Community.css";
export function CommunityNav() {
  return (
    <nav className="pt-community-nav" aria-label={t("Topluluk ve oyunlar")}>
      {[
        ["/family", "Ailem", FiUsers],
        ["/friends", "Arkadaşlarım", FiUser],
        ["/achievements", "Rozetlerim", FiAward],
        ["/games", "Oyunlar", FiPlay],
      ].map(([to, label, Icon]) => (
        <NavLink to={to} key={to}>
          <Icon />
          {t(label)}
        </NavLink>
      ))}
    </nav>
  );
}
export function PageHeading({ eyebrow, title, description }) {
  return (
    <>
      <Link className="pt-back-link" to="/tools">
        <FiArrowLeft />
        {t("Keşfet")}
      </Link>
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t(eyebrow)}</p>
          <h1>{t(title)}</h1>
          <p>{t(description)}</p>
        </div>
      </div>
      <CommunityNav />
    </>
  );
}
export function Feedback({ error, message, retry }) {
  return (
    <>
      {error && (
        <div className="pt-error" role="alert">
          {t(error)}
          {retry && (
            <button onClick={retry}>
              <FiRefreshCw />
              {t(" Yeniden dene")}
            </button>
          )}
        </div>
      )}
      {message && (
        <p className="pt-success" role="status">
          {t(message)}
        </p>
      )}
    </>
  );
}
export function Person({ name, detail, children }) {
  return (
    <div className="pt-person">
      <span className="pt-person-avatar">
        {t((name || "K").slice(0, 1).toLocaleUpperCase("tr"))}
      </span>
      <div>
        <h3>{name || t("Kullanıcı")}</h3>
        {detail && <p>{t(detail)}</p>}
      </div>
      {t(children)}
    </div>
  );
}
export function StatsStrip({ items }) {
  return (
    <div className="pt-community-stats">
      {items.map(([label, value]) => (
        <div key={label}>
          <strong>{t(value ?? "—")}</strong>
          <span>{t(label)}</span>
        </div>
      ))}
    </div>
  );
}
export function Empty({ children }) {
  return <p className="pt-empty">{t(children)}</p>;
}
