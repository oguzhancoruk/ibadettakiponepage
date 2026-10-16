import { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { tools } from "./Tools";
import { usePreferences } from "../context/Preferences";
import { PageHeading, Empty } from "../components/community/Shared";
const normalize = (value) =>
  value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
export default function Search() {
  const [query, setQuery] = useState("");
  const { t } = usePreferences();
  const all = [
    ...tools,
    [
      "/dashboard",
      "Bugün",
      "Namaz vakitleri ve günlük özet",
      FiSearch,
      "ANA SAYFA",
    ],
    ["/account", "Hesabım", "Profil, çıkış ve hesap silme", FiSearch, "HESAP"],
  ].filter(([path]) => path !== "/search");
  const results = all.filter(([, title, description, , label]) =>
    normalize(
      `${title} ${description} ${label} ${t(title)} ${t(description)} ${t(
        label
      )}`
    ).includes(normalize(query.trim()))
  );
  return (
    <>
      <PageHeading
        eyebrow={t("ARADIĞINA ULAŞ")}
        title={t("Uygulamada ara")}
        description={t("Namaz, dua, Kur’an, rapor veya hesap araçlarını bul.")}
      />
      <label className="pt-search">
        <FiSearch />
        <input
          type="search"
          aria-label={t("Özellik ara")}
          placeholder={t("Hangi özelliği arıyorsun?")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="pt-note">
        {t(results.length)}
        {t(" sonuç")}
      </p>
      <div className="pt-tools-grid">
        {results.map(([path, title, description, Icon, label]) => (
          <Link to={path} key={path} className="pt-tool-card">
            <span className="pt-tool-icon">
              <Icon />
            </span>
            <span className="pt-eyebrow">{t(label)}</span>
            <h2>{t(title)}</h2>
            <p>{t(description)}</p>
          </Link>
        ))}
      </div>
      {!results.length && (
        <Empty>{t("Aramana uygun özellik bulunamadı.")}</Empty>
      )}
    </>
  );
}
