import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiBookOpen } from "react-icons/fi";
import { request, errorMessage } from "../services/api";
import "./Tools.css";
import "./Extended.css";
import { useStoredState } from "../hooks/useStoredState";
import { usePreferences, t } from "../context/Preferences";
export default function Duas() {
  const { language } = usePreferences();
  const [storedFavorites, setFavorites, storageError] = useStoredState(
    "dua-favorites",
    []
  );
  const favorites = useMemo(
    () => (Array.isArray(storedFavorites) ? storedFavorites : []),
    [storedFavorites]
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [duas, setDuas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    request("/duas", {
      jwt: true,
      params: {
        lang: language,
      },
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) setDuas(data?.duas || []);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision, language]);
  const categories = [...new Set(duas.map((d) => d.category).filter(Boolean))];
  const filtered = useMemo(
    () =>
      duas.filter(
        (dua) =>
          (category === "all" || dua.category === category) &&
          (!favoritesOnly || favorites.includes(dua._id)) &&
          `${dua.title} ${dua.content} ${dua.transliteration || ""}`
            .toLocaleLowerCase("tr")
            .includes(search.toLocaleLowerCase("tr"))
      ),
    [duas, category, search, favoritesOnly, favorites]
  );
  return (
    <>
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t("KELİMELERE SIĞAN HUZUR")}</p>
          <h1>{t("Dua kütüphanesi")}</h1>
          <p>{t("Oku, düşün, günün içinde duaya bir yer aç.")}</p>
        </div>
        <FiBookOpen size={28} />
      </div>
      <div className="pt-library-controls">
        <label className="pt-search">
          <FiSearch />
          <input
            aria-label={t("Dua ara")}
            placeholder={t("Dua adı veya içeriğinde ara…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="pt-field">
          <span className="pt-visually-hidden">{t("Kategori")}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">{t("Tüm kategoriler")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {t(c)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pt-actions">
        <label className="pt-checkbox">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />
          {t("Sadece favorilerim")}
        </label>
      </div>
      <p className="pt-note">
        {t("Favorilerin bu tarayıcıda hesabına özel saklanır.")}
      </p>
      {storageError && (
        <p className="pt-error" role="alert">
          {t(storageError)}
        </p>
      )}
      {error && (
        <div className="pt-error" role="alert">
          {t(error)}
          {t(" ")}
          <button onClick={() => setRevision((v) => v + 1)}>
            {t("Yeniden dene")}
          </button>
        </div>
      )}
      {t(
        loading ? (
          <p className="pt-empty" role="status">
            {t("Dualar yükleniyor…")}
          </p>
        ) : (
          !error && (
            <>
              <p className="pt-note">
                {t(filtered.length)}
                {t(" dua")}
              </p>
              <div className="pt-dua-list">
                {filtered.map((dua) => (
                  <details key={dua._id} className="pt-panel pt-dua-card">
                    <summary>
                      <span className="pt-tag">{t(dua.category)}</span>
                      <h2>{t(dua.title)}</h2>
                      <span className="pt-dua-open">
                        {t("Oku ")}
                        <span>+</span>
                      </span>
                    </summary>
                    <div className="pt-dua-content">
                      <button
                        className="pt-button secondary"
                        aria-pressed={favorites.includes(dua._id)}
                        onClick={() =>
                          setFavorites(
                            favorites.includes(dua._id)
                              ? favorites.filter((id) => id !== dua._id)
                              : [...favorites, dua._id]
                          )
                        }
                      >
                        {t(
                          favorites.includes(dua._id)
                            ? "Favorilerimden çıkar"
                            : "Favorilerime ekle"
                        )}
                      </button>
                      {dua.contentArabic && (
                        <p className="pt-arabic" dir="rtl" lang="ar">
                          {dua.contentArabic}
                        </p>
                      )}
                      {dua.transliteration && (
                        <>
                          <h3>{t("Okunuşu")}</h3>
                          <p>{dua.transliteration}</p>
                        </>
                      )}
                      <h3>{t("Anlamı")}</h3>
                      <p>{dua.content}</p>
                      {dua.source && (
                        <p className="pt-note">
                          {t("Kaynak: ")}
                          {t(dua.source)}
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
              {!filtered.length && (
                <p className="pt-empty">
                  {t("Bu aramaya uygun dua bulunamadı.")}
                </p>
              )}
            </>
          )
        )
      )}
    </>
  );
}
