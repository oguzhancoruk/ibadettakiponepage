import { t } from "../context/Preferences";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeading } from "../components/community/Shared";
import guide from "../data/prayerGuide.json";
import "./Extended.css";
const images = Object.fromEntries(
  [
    "niyet",
    "tekbir",
    "kiyam",
    "ruku",
    "dogrulma",
    "secde",
    "oturus",
    "tahiyyat",
    "selam",
  ].map((key) => [key, require(`../assets/guide/step-${key}.png`)])
);
export default function PrayerGuide() {
  const [selected, setSelected] = useState("sabah");
  const prayer = guide.PRAYERS.find((item) => item.key === selected);
  return (
    <>
      <PageHeading
        eyebrow={t("ADIM ADIM ÖĞREN")}
        title={t("Namaz rehberi")}
        description={t("Mobil uygulamadaki namaz rehberini webde de takip et.")}
      />
      <p className="pt-note">
        {t(
          "Hanefî uygulamasına göre hazırlanmıştır. Diğer mezheplerin uygulamalarında farklılıklar olabilir."
        )}
      </p>
      <div className="pt-actions">
        {guide.PRAYERS.map((item) => (
          <button
            key={item.key}
            className={`pt-button ${selected === item.key ? "" : "secondary"}`}
            onClick={() => setSelected(item.key)}
            aria-pressed={selected === item.key}
          >
            {t(item.title)}
          </button>
        ))}
      </div>
      <section className="pt-panel pt-section-gap">
        <h2>{t(prayer.fullTitle)}</h2>
        <p className="pt-note">{t(prayer.summary)}</p>
        <ol className="pt-guide-sequence">
          {prayer.sequence.map((step) => (
            <li key={step.title}>
              {t(step.label)}: {t(step.title)}
            </li>
          ))}
        </ol>
        {prayer.recitationDetails.map((detail) => (
          <details className="pt-guide-detail" key={detail.title}>
            <summary>{t(detail.title)}</summary>
            {detail.lines.map((line) => (
              <p className="pt-note" key={line}>
                {t(line)}
              </p>
            ))}
          </details>
        ))}
      </section>
      <h2 className="pt-section-gap">{t("Namazın adımları")}</h2>
      <div className="pt-guide-grid pt-section-gap">
        {guide.DETAIL_STEPS.map((step, index) => (
          <article className="pt-panel" key={step.imageKey}>
            <img src={images[step.imageKey]} alt={step.title} loading="lazy" />
            <h3>
              {t(index + 1)}. {t(step.title)}
            </h3>
            <p className="pt-note">{t(step.text)}</p>
          </article>
        ))}
      </div>
      <section className="pt-panel pt-section-gap">
        <h2>{t("Namaza hazırlık")}</h2>
        <ul className="pt-guide-sequence">
          {guide.CONDITIONS.map(([title]) => (
            <li key={title}>{t(title)}</li>
          ))}
        </ul>
        <Link className="pt-button secondary" to="/qibla">
          {t("Kıble yönünü bul")}
        </Link>
        <p className="pt-note">
          {t("Kaynak: ")}
          <a
            href="https://namaz.diyanet.gov.tr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Diyanet İşleri Başkanlığı")}
          </a>
        </p>
      </section>
    </>
  );
}
