import { t } from "../context/Preferences";
import { Link } from "react-router-dom";
import logo from "./assets/images/1.png";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="pt-footer">
      <div className="pt-footer-main">
        <div>
          <Link className="landing-brand" to="/">
            <img src={logo} alt="" width="35" height="35" />
            {t("İbadet Takip")}
          </Link>
          <p>
            {t("Günün içinde, niyetine bir yer aç.")}
            <br />
            {t("İbadetlerin her cihazda yanında.")}
          </p>
        </div>
        <nav aria-label={t("Alt menü")}>
          <Link to="/features">{t("Özellikler")}</Link>
          <Link to="/contact">{t("İletişim")}</Link>
          <Link to="/login">{t("Hesabım")}</Link>
        </nav>
        <nav aria-label={t("Yasal bilgiler")}>
          <Link to="/privacy">{t("Gizlilik politikası")}</Link>
          <Link to="/terms">{t("Kullanım şartları")}</Link>
          <a href="mailto:info@prayertrack.app">{t("info@prayertrack.app")}</a>
        </nav>
      </div>
      <div className="pt-footer-bottom">
        <span>
          © {t(new Date().getFullYear())}
          {t(" İbadet Takip")}
        </span>
        <span>{t("Biraz niyet, biraz istikrar.")}</span>
      </div>
    </footer>
  );
}
