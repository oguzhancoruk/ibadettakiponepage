import { t } from "../context/Preferences";
import { Link } from "react-router-dom";
import { FiCheck, FiArrowUpRight } from "react-icons/fi";
import "./Features.css";
const features = [
  [
    "Raporlar ve günlük",
    "Aylık ve yıllık istatistikler, PDF yazdırma, ruh hali ve kişisel günlük.",
  ],
  [
    "Hedefler ve arkadaş akışı",
    "Hedeflerini başlat, ilerlemeni kaydet ve arkadaşlarının başarılarını takip et.",
  ],
  ["Konum araçları", "Kıble yönü, yakındaki camiler, harita ve namaz rehberi."],
  [
    "Kişisel tercihler",
    "Koyu tema, İngilizce arayüz, dua favorileri ve Kur’an yer imleri.",
  ],
  [
    "Aile ve arkadaşlar",
    "Aile davetlerini ve arkadaşlık isteklerini yönet. İzin verilen aile istatistiklerini ve arkadaş sıralamasını gör.",
  ],
  [
    "Rozetler ve oyunlar",
    "İbadet rozetlerini keşfet; günlük bilgi, kelime ve sıralama oyunlarında mobil hesabındaki ilerlemene devam et.",
  ],
  ["Namaz günlüğü", "Günlük namazlarını işaretle, haftalık ilerlemeni gör."],
  [
    "Konumuna göre vakitler",
    "Konum izni verdiğinde namaz vakitlerini ve sonraki vakte kalan süreyi görüntüle.",
  ],
  [
    "Nafile namazlar",
    "İşrak, Duhâ, Evvabin ve Teheccüd kayıtlarını rekât seçimiyle tut.",
  ],
  [
    "Kaza ve oruç takibi",
    "Kaza borçlarını planla; Ramazan, kaza ve nafile oruçlarını takvimde izle.",
  ],
  ["Dijital tesbih", "Günlük hedefini belirle ve sayacını hesabına kaydet."],
  [
    "Dua kütüphanesi",
    "Duaları adları ve içerikleriyle ara, kategorilere göre keşfet.",
  ],
  [
    "Kur’an ve hatim",
    "Kur’an sayfalarını oku, hatim ilerlemeni mobil uygulamayla ortak takip et.",
  ],
];
export default function Features() {
  return (
    <div className="pt-feature-page">
      <header>
        <p className="pt-eyebrow">{t("SANA AİT BİR İBADET GÜNLÜĞÜ")}</p>
        <h1>
          {t("Niyetini günlük")}
          <br />
          <em>{t("bir alışkanlığa dönüştür.")}</em>
        </h1>
        <p>
          {t(
            "Web’de takip et, mobilde devam et. Aynı hesabınla ibadet kayıtların yanında."
          )}
        </p>
      </header>
      <div className="pt-feature-list">
        {features.map(([name, description]) => (
          <article key={name}>
            <FiCheck />
            <div>
              <h2>{t(name)}</h2>
              <p>{t(description)}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="pt-mobile-note">
        <h2>{t("Web bildirimleri ve ana ekran")}</h2>
        <p>
          {t(
            "Destekleyen tarayıcılarda namaz bildirimlerini ayarlardan açabilirsin. Bildirimler için sunucu yapılandırması gerekir. iPhone’da önce siteyi ana ekrana ekleyip oradan açmalısın."
          )}
        </p>
      </aside>
      <div className="pt-feature-cta">
        <Link className="pt-button" to="/register">
          {t("Hesabını oluştur ")}
          <FiArrowUpRight />
        </Link>
      </div>
    </div>
  );
}
