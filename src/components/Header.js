import { t } from "../context/Preferences";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiArrowUpRight } from "react-icons/fi";
import logo from "./assets/images/1.png";
import { getSession } from "../utils/session";
import "./Header.css";
export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const expanded = open === location.pathname;
  return (
    <header className="landing-header">
      <div className="landing-header-content">
        <Link to="/" className="landing-brand">
          <img className="landing-logo" src={logo} alt="" />
          <span>{t("İbadet Takip")}</span>
        </Link>
        <nav
          className={`landing-nav ${expanded ? "is-open" : ""}`}
          id="landing-menu"
          aria-label={t("Site menüsü")}
        >
          <NavLink to="/" onClick={() => setOpen(false)}>
            {t("Ana sayfa")}
          </NavLink>
          <NavLink to="/features" onClick={() => setOpen(false)}>
            {t("Özellikler")}
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            {t("İletişim")}
          </NavLink>
          <NavLink to="/privacy" onClick={() => setOpen(false)}>
            {t("Gizlilik")}
          </NavLink>
        </nav>
        <div className="landing-auth-buttons">
          {t(
            getSession() ? (
              <Link className="header-btn-register" to="/dashboard">
                {t("Panelime git ")}
                <FiArrowUpRight />
              </Link>
            ) : (
              <>
                <Link className="header-btn-login" to="/login">
                  {t("Giriş yap")}
                </Link>
                <Link className="header-btn-register" to="/register">
                  {t("Hemen başla ")}
                  <FiArrowUpRight />
                </Link>
              </>
            )
          )}
          <button
            className="landing-menu-button"
            aria-label={expanded ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={expanded}
            aria-controls="landing-menu"
            onClick={() => setOpen(expanded ? false : location.pathname)}
          >
            {t(expanded ? <FiX /> : <FiMenu />)}
          </button>
        </div>
      </div>
    </header>
  );
}
