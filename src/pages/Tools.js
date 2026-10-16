import { t } from "../context/Preferences";
import { Link } from "react-router-dom";
import {
  FiCircle,
  FiBookOpen,
  FiMoon,
  FiArrowUpRight,
  FiCalendar,
  FiRefreshCw,
  FiUsers,
  FiUserPlus,
  FiAward,
  FiPlay,
  FiBarChart2,
  FiEdit3,
  FiTarget,
  FiActivity,
  FiCompass,
  FiMapPin,
  FiSettings,
  FiHelpCircle,
  FiShoppingBag,
  FiSearch,
} from "react-icons/fi";
import "./Tools.css";
export const tools = [
  [
    "/reports",
    "İbadet raporlarım",
    "Aylık ve yıllık ilerlemeni gör, PDF raporunu yazdır.",
    FiBarChart2,
    "RAPORLAR",
  ],
  [
    "/journal",
    "Ruh halim ve günlüğüm",
    "Duygularını, şükrettiklerini ve günlük notlarını kaydet.",
    FiEdit3,
    "GÜNLÜK",
  ],
  [
    "/challenges",
    "Hedeflerim",
    "Kendine bir hedef seç ve adım adım ilerle.",
    FiTarget,
    "HEDEFLER",
  ],
  [
    "/activity",
    "Arkadaş akışı",
    "Arkadaşlarının son etkinliklerini ve başarılarını takip et.",
    FiActivity,
    "TOPLULUK",
  ],
  [
    "/qibla",
    "Kıble pusulası",
    "Konumuna göre Kâbe yönünü ve açısını bul.",
    FiCompass,
    "KIBLE",
  ],
  [
    "/mosques",
    "Camiler",
    "Yakındaki camileri haritada bul ve yol tarifi al.",
    FiMapPin,
    "YAKININDA",
  ],
  [
    "/guide",
    "Namaz rehberi",
    "Namazın kılınışını görseller ve adımlarla öğren.",
    FiBookOpen,
    "REHBER",
  ],
  [
    "/search",
    "Uygulamada ara",
    "İhtiyacın olan özelliğe tek aramayla ulaş.",
    FiSearch,
    "ARAMA",
  ],
  [
    "/settings",
    "Uygulama ayarları",
    "Tema, dil ve namaz bildirimlerini düzenle.",
    FiSettings,
    "TERCİHLER",
  ],
  [
    "/subscription",
    "Satın alma durumum",
    "Reklamsız kullanımını ve mağaza satın almalarını yönet.",
    FiShoppingBag,
    "HESAP",
  ],
  [
    "/support",
    "Destek merkezi",
    "Sorularını ve önerilerini ilet, yanıtları takip et.",
    FiHelpCircle,
    "DESTEK",
  ],
  [
    "/family",
    "Ailem",
    "Aile davetlerini yönet, paylaşılan namaz ve oruç istatistiklerini gör.",
    FiUsers,
    "BİRLİKTE",
  ],
  [
    "/friends",
    "Arkadaşlarım",
    "Arkadaşlarını bul, isteklerini yönet ve sıralamanı gör.",
    FiUserPlus,
    "ARKADAŞLAR",
  ],
  [
    "/achievements",
    "Rozetlerim",
    "Kazandığın rozetleri ve sıradaki hedeflerine ilerlemeni keşfet.",
    FiAward,
    "BAŞARILAR",
  ],
  [
    "/games",
    "Oyun merkezi",
    "Günlük bilgi, kelime bulmaca ve sıralama oyunlarıyla öğren.",
    FiPlay,
    FiBarChart2,
    FiEdit3,
    FiTarget,
    FiActivity,
    FiCompass,
    FiMapPin,
    FiSettings,
    FiHelpCircle,
    FiShoppingBag,
    FiSearch,
    "ÖĞREN",
  ],
  [
    "/tesbih",
    "Dijital tesbih",
    "Zikrine odaklan. Sayacını ve günlük hedefini takip et.",
    FiCircle,
    "ZİKİR",
  ],
  [
    "/duas",
    "Dua kütüphanesi",
    "Günün her anına eşlik eden duaları keşfet.",
    FiMoon,
    "DUA",
  ],
  [
    "/hatim",
    "Kur’an ve hatim",
    "Kur’an oku, hatmine kaldığın sayfadan devam et.",
    FiBookOpen,
    "OKU",
  ],
  [
    "/daily",
    "Namaz günlüğü",
    "Günlük namazlarını işaretle, haftalık ilerlemeni gör.",
    FiCalendar,
    "TAKİP",
  ],
  [
    "/kaza",
    "Kaza planım",
    "Kalan borcunu gör, küçük adımlarla ilerle.",
    FiRefreshCw,
    "PLANLA",
  ],
  [
    "/fasting",
    "Oruç takvimi",
    "Ramazan, kaza ve nafile oruçlarını bir arada tut.",
    FiMoon,
    "TAKVİM",
  ],
];
export default function Tools() {
  return (
    <>
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t("HER GÜNE BİR GÜZELLİK")}</p>
          <h1>{t("Kendine zaman ayır")}</h1>
          <p>{t("İbadet yolculuğunda ihtiyacın olan araçlar bir arada.")}</p>
        </div>
      </div>
      <div className="pt-tools-grid">
        {tools.map(([url, name, description, Icon, label]) => (
          <Link key={url} to={url} className="pt-tool-card">
            <span className="pt-tool-icon">
              <Icon />
            </span>
            <span className="pt-eyebrow">{t(label)}</span>
            <h2>{t(name)}</h2>
            <p>{t(description)}</p>
            <span className="pt-tool-arrow">
              <FiArrowUpRight />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
