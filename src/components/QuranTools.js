import { useState } from "react";
import { useRemote } from "../hooks/useRemote";
import { Feedback, Empty } from "./community/Shared";
import { usePreferences, t } from "../context/Preferences";
export function QuranTools({
  page,
  onPage,
  preferences,
  onPreferences,
  storageError,
}) {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const remote = useRemote(search ? "/quran/search" : null, {
    params: {
      q: search,
    },
  });
  const saved = preferences.bookmarks.includes(page);
  return (
    <section className="pt-panel pt-section-gap">
      <h2>{t("Okuma araçları")}</h2>
      <Feedback error={storageError} />
      <div className="pt-actions pt-section-gap">
        <button
          className="pt-button secondary"
          aria-pressed={saved}
          onClick={() =>
            onPreferences((previous) => ({
              ...previous,
              bookmarks: saved
                ? previous.bookmarks.filter((value) => value !== page)
                : [...previous.bookmarks, page].sort((a, b) => a - b),
            }))
          }
        >
          {t(saved ? "Yer imini kaldır" : "Sayfaya yer imi ekle")}
        </button>
        <label className="pt-checkbox">
          <input
            type="checkbox"
            checked={preferences.largeText}
            onChange={(e) =>
              onPreferences((previous) => ({
                ...previous,
                largeText: e.target.checked,
              }))
            }
          />
          {t("Büyük yazı")}
        </label>
      </div>
      <p className="pt-note">
        {t(
          "Yer imlerin ve okuma tercihlerin bu tarayıcıda hesabına özel saklanır."
        )}
      </p>
      <div className="pt-actions">
        {preferences.bookmarks.map((bookmark) => (
          <button
            className="pt-button secondary"
            key={bookmark}
            onClick={() => onPage(bookmark)}
          >
            {t(bookmark)}
          </button>
        ))}
      </div>
      <form
        className="pt-actions pt-section-gap"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(query.trim());
        }}
      >
        <label className="pt-field pt-grow">
          {t("Ayet veya sure ara")}
          <input
            minLength="2"
            maxLength="120"
            required
            placeholder={t("Türkçe meal, sure adı veya 2:255")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button className="pt-button">{t("Ara")}</button>
        {search && (
          <button
            type="button"
            className="pt-button secondary"
            onClick={() => {
              setQuery("");
              setSearch("");
            }}
          >
            {t("Aramayı kapat")}
          </button>
        )}
      </form>
      <Feedback error={remote.error} retry={remote.refresh} />
      {t(
        remote.loading ? (
          <p role="status">{t("Ayetler aranıyor…")}</p>
        ) : (
          remote.data && (
            <div className="pt-quran-results">
              {t(
                remote.data.verses?.length ? (
                  remote.data.verses.map((verse) => (
                    <article key={`${verse.pageNumber}-${verse.ayahKey}`}>
                      <h3>
                        {verse.surahName} · {verse.ayahNumber}
                      </h3>
                      <p className="pt-note">{verse.translation}</p>
                      <button
                        className="pt-button secondary"
                        onClick={() => {
                          onPage(verse.pageNumber);
                          setSearch("");
                        }}
                      >
                        {t("Sayfayı aç")}
                      </button>
                    </article>
                  ))
                ) : (
                  <Empty>{t("Bu aramaya uygun ayet bulunamadı.")}</Empty>
                )
              )}
              {remote.data.hasMore && (
                <p className="pt-note">
                  {t(
                    "İlk 40 sonuç gösteriliyor. Daha belirgin bir arama yapabilirsin."
                  )}
                </p>
              )}
            </div>
          )
        )
      )}
    </section>
  );
}
export function QuranAudio({ verse, onClose }) {
  const [error, setError] = useState("");
  const { t } = usePreferences();
  let source;
  try {
    const url = new URL(verse.audioUrl);
    if (url.protocol === "https:") source = url.href;
  } catch {
    /* Use the same Diyanet reciter as mobile. */
  }
  if (
    !source &&
    Number.isInteger(verse.surahNumber) &&
    Number.isInteger(verse.ayahNumber)
  )
    source = `https://webdosya.diyanet.gov.tr/kuran/kuranikerim/Sound/ar_OsmanSahin/${verse.surahNumber}_${verse.ayahNumber}.mp3`;
  return (
    <section className="pt-panel pt-audio-player">
      <div className="pt-actions">
        <h3>
          {verse.surahName} · {verse.ayahNumber}
        </h3>
        <button className="pt-button secondary" onClick={onClose}>
          {t("Dinlemeyi kapat")}
        </button>
      </div>
      {t(
        source ? (
          <audio
            controls
            preload="none"
            src={source}
            aria-label={t("Ayet dinle")}
            onError={() =>
              setError(
                "Ses kaydı yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin."
              )
            }
          />
        ) : (
          <p className="pt-note">{t("Bu ayet için ses kaydı bulunamadı.")}</p>
        )
      )}
      <Feedback error={error} />
    </section>
  );
}
