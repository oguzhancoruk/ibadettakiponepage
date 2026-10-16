import { t } from "../context/Preferences";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCheck,
  FiCalendar,
  FiBookOpen,
  FiCircle,
  FiMoon,
  FiArrowRight,
} from "react-icons/fi";
import { PRAYERS } from "../utils/prayers";
import "./Home.css";
const highlights = [
  [
    FiCalendar,
    "Her vakit, yeni bir başlangıç.",
    "Namazlarını işaretle, nafilelerini kaydet ve haftalık ilerlemeni takip et.",
  ],
  [
    FiBookOpen,
    "Okumaya kaldığın yerden.",
    "Duaları keşfet. Kur’an oku ve mobilde başladığın hatme web’den devam et.",
  ],
  [
    FiCircle,
    "Küçük adımlar, düzenli bir gün.",
    "Tesbih hedefini belirle, kaza borcunu planla, oruç takvimini yanında tut.",
  ],
];
export default function Home() {
  return (
    <div className="pt-landing">
      <section className="pt-landing-hero">
        <div className="pt-landing-copy">
          <span className="pt-landing-pill">
            <span />
            {t(" İbadetlerin, her zaman yanında.")}
          </span>
          <h1>
            {t("Gününe bir")}
            <br />
            <em>{t("huzur molası.")}</em>
          </h1>
          <p>
            {t("Vaktini hatırla. İbadetlerini takip et.")}
            <br />
            {t("Küçük, düzenli adımlarla kendi yolculuğunu kur.")}
          </p>
          <div className="pt-landing-actions">
            <Link className="pt-button" to="/register">
              {t("Yolculuğuna başla ")}
              <FiArrowUpRight />
            </Link>
            <Link className="pt-landing-text-link" to="/features">
              {t("Neler yapabilirim? ")}
              <FiArrowRight />
            </Link>
          </div>
          <div className="pt-landing-benefits">
            <span>
              <FiCheck />
              {t(" Web ve mobil birlikte")}
            </span>
            <span>
              <FiCheck />
              {t(" Aynı hesap, aynı kayıtlar")}
            </span>
          </div>
        </div>
        <div className="pt-preview-wrap">
          <span className="pt-preview-label">
            {t("Günlüğüne küçük bir bakış · örnek görünüm")}
          </span>
          <div className="pt-product-preview">
            <div className="pt-preview-top">
              <span>{t("İbadet Takip")}</span>
              <span className="pt-preview-avatar">{t("İ")}</span>
            </div>
            <p className="pt-eyebrow">{t("BUGÜN KENDİNE ZAMAN AYIR")}</p>
            <h2>
              {t("Hayırlı bir gün olsun ")}
              <FiSunIcon />
            </h2>
            <div className="pt-preview-banner">
              <FiMoon />
              <div>
                <small>{t("BİR SONRAKİ VAKTE HAZIRLAN")}</small>
                <strong>{t("Vaktine yer aç.")}</strong>
                <span>{t("Namaz vakitlerin, bulunduğun konuma göre.")}</span>
              </div>
            </div>
            <div className="pt-preview-section">
              <h3>{t("Bugünkü namazlarım")}</h3>
              <span>{t("Her vakit bir adım.")}</span>
            </div>
            <div className="pt-preview-prayers">
              {PRAYERS.map((p) => (
                <div
                  key={p.key}
                  style={{
                    backgroundImage: `url(${p.image})`,
                  }}
                >
                  <span className="pt-preview-check" />
                  <strong>{t(p.name)}</strong>
                </div>
              ))}
            </div>
            <div className="pt-preview-bottom">
              <span>
                <FiCircle />
                {t(" Tesbih")}
              </span>
              <span>
                <FiBookOpen />
                {t(" Dua kütüphanesi")}
              </span>
              <span>
                <FiMoon />
                {t(" Hatim")}
              </span>
            </div>
          </div>
          <span className="pt-preview-caption">
            {t("Günün telaşında, niyetine bir yer aç.")}
          </span>
        </div>
      </section>
      <section className="pt-landing-features">
        <div className="pt-landing-section-heading">
          <p className="pt-eyebrow">{t("TEK HESAP. SANA AİT BİR GÜNLÜK.")}</p>
          <h2>
            {t("İbadet yolculuğunda")}
            <br />
            {t("ihtiyacın olanlar bir arada.")}
          </h2>
          <Link to="/features">
            {t("Tüm özellikleri keşfet ")}
            <FiArrowUpRight />
          </Link>
        </div>
        <div className="pt-landing-feature-grid">
          {highlights.map(([Icon, title, body]) => (
            <article key={title}>
              <span className="pt-tool-icon">
                <Icon />
              </span>
              <h3>{t(title)}</h3>
              <p>{t(body)}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pt-app-invitation">
        <div>
          <p className="pt-eyebrow">{t("DIŞARIDAYKEN DE YANINDA")}</p>
          <h2>{t("Günün nerede geçerse geçsin.")}</h2>
          <p>
            {t(
              "Web ve mobilde aynı hesabınla devam et. Namazlarını, günlüğünü ve hedeflerini her iki cihazdan takip et."
            )}
          </p>
        </div>
        <div className="pt-store-links">
          <a
            href="https://apps.apple.com/app/id6504155838"
            target="_blank"
            rel="noreferrer"
          >
            <small>{t("iPhone ve iPad için")}</small>
            {t("App Store ")}
            <FiArrowUpRight />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.ibadet.takip"
            target="_blank"
            rel="noreferrer"
          >
            <small>{t("Android için")}</small>
            {t("Google Play ")}
            <FiArrowUpRight />
          </a>
        </div>
      </section>
      <section className="pt-landing-end">
        <p className="pt-eyebrow">{t("BUGÜN BİR BAŞLANGIÇ OLSUN")}</p>
        <h2>
          {t("Biraz niyet.")}
          <br />
          {t("Biraz istikrar.")}
        </h2>
        <Link className="pt-button" to="/register">
          {t("Hesabını oluştur ")}
          <FiArrowUpRight />
        </Link>
        <p>
          {t("Zaten hesabın var mı? ")}
          <Link to="/login">{t("Giriş yap")}</Link>
        </p>
      </section>
    </div>
  );
}
function FiSunIcon() {
  return <span className="pt-preview-sun">✧</span>;
}
