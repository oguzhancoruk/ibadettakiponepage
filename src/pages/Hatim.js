import { t } from "../context/Preferences";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiBookOpen } from "react-icons/fi";
import { request, errorMessage } from "../services/api";
import { getSession } from "../utils/session";
import "./Tools.css";
import { QuranTools, QuranAudio } from "../components/QuranTools";
import { useStoredState } from "../hooks/useStoredState";
import { normalizeReaderPreferences } from "../utils/quranReader";
import "./Extended.css";
const TOTAL_PAGES = 605;
export default function Hatim() {
  const user = getSession();
  const [hatim, setHatim] = useState(null);
  const [stored, setStored, storageError] = useStoredState("reader", {});
  const preferences = normalizeReaderPreferences(stored);
  const [page, setPage] = useState(preferences.lastPage || 1);
  const [audioVerse, setAudioVerse] = useState(null);
  const changePreferences = (update) =>
    setStored((previous) => update(normalizeReaderPreferences(previous)));
  useEffect(() => {
    setStored((previous) => ({
      ...normalizeReaderPreferences(previous),
      lastPage: page,
    }));
    setAudioVerse(null);
  }, [page, setStored]);
  const [pageInput, setPageInput] = useState("1");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    request(`/hatim/active/${user._id}`, {
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) {
          setHatim(data);
          if (data && !preferences.lastPage)
            setPage(Math.min(TOTAL_PAGES, (data.completedPages || 0) + 1));
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id, revision]);
  useEffect(() => {
    const controller = new AbortController();
    setPageInput(String(page));
    setContent(null);
    setPageError("");
    setPageLoading(true);
    request(`/quran/page/${page}`, {
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) setContent(data);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setPageError(errorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setPageLoading(false);
      });
    return () => controller.abort();
  }, [page, revision]);
  const start = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await request("/hatim/start", {
        method: "post",
        data: {
          userId: user._id,
        },
      });
      setHatim(data);
      setPage(Math.min(TOTAL_PAGES, (data.completedPages || 0) + 1));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const markRead = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await request(`/hatim/${hatim._id}/page/${page}`, {
        method: "put",
      });
      setHatim(data);
      if (data.status !== "completed")
        setPage(Math.min(TOTAL_PAGES, (data.completedPages || 0) + 1));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const jump = (e) => {
    e.preventDefault();
    if (
      !/^\d+$/.test(pageInput) ||
      Number(pageInput) < 1 ||
      Number(pageInput) > TOTAL_PAGES
    ) {
      setPageError(`1–${TOTAL_PAGES} arasında bir sayfa gir.`);
      return;
    }
    setPage(Number(pageInput));
  };
  return (
    <>
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t("SAYFA SAYFA, AYNI NİYETLE")}</p>
          <h1>{t("Kur’an ve hatim")}</h1>
          <p>{t("Mobildeki hatmine devam et veya yeni bir başlangıç yap.")}</p>
        </div>
        <FiBookOpen size={28} />
      </div>
      {error && (
        <div className="pt-error" role="alert">
          {t(error)}
          {t(" ")}
          <button onClick={() => setRevision((v) => v + 1)}>
            {t("Yeniden dene")}
          </button>
        </div>
      )}
      <section className="pt-panel pt-hatim-summary">
        {t(
          loading ? (
            <p role="status">{t("Hatim kaydın yükleniyor…")}</p>
          ) : hatim ? (
            <>
              <div>
                <p className="pt-eyebrow">
                  {t(
                    hatim.status === "completed"
                      ? "HATMİN TAMAMLANDI"
                      : "DEVAM EDEN HATMİN"
                  )}
                </p>
                <h2>
                  {t(hatim.completedPages || 0)}{" "}
                  <small>
                    / {t(TOTAL_PAGES)}
                    {t(" sayfa")}
                  </small>
                </h2>
              </div>
              <progress
                aria-label={t("Hatim ilerlemesi")}
                max={TOTAL_PAGES}
                value={hatim.completedPages || 0}
              />
              <span className="pt-tag">
                %
                {t(
                  Math.round(((hatim.completedPages || 0) / TOTAL_PAGES) * 100)
                )}
              </span>
            </>
          ) : (
            <>
              <div>
                <h2>{t("Bir hatme niyet et.")}</h2>
                <p className="pt-note">
                  {t(
                    "Aktif hatmin yok. Kur’an’ı takip başlatmadan da okuyabilirsin."
                  )}
                </p>
              </div>
              <button
                className="pt-button"
                disabled={busy || Boolean(error)}
                onClick={start}
              >
                {t("Hatim başlat")}
              </button>
            </>
          )
        )}
      </section>
      <p className="pt-note">{t("Mealler Türkçedir.")}</p>
      <QuranTools
        page={page}
        onPage={setPage}
        preferences={preferences}
        onPreferences={changePreferences}
        storageError={storageError}
      />
      {audioVerse && (
        <QuranAudio
          key={audioVerse.ayahKey}
          verse={audioVerse}
          onClose={() => setAudioVerse(null)}
        />
      )}
      <div className="pt-reader-toolbar">
        <button
          className="pt-icon-button"
          disabled={page <= 1 || busy}
          aria-label={t("Önceki sayfa")}
          onClick={() => setPage((p) => p - 1)}
        >
          <FiArrowLeft />
        </button>
        <form onSubmit={jump}>
          <label>
            {t("Sayfa")}
            {t(" ")}
            <input
              aria-label={t("Kur’an sayfa numarası")}
              type="number"
              min="1"
              max={TOTAL_PAGES}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
            />
          </label>
          <button className="pt-button secondary" type="submit" disabled={busy}>
            {t("Git")}
          </button>
        </form>
        <button
          className="pt-icon-button"
          disabled={page >= TOTAL_PAGES || busy}
          aria-label={t("Sonraki sayfa")}
          onClick={() => setPage((p) => p + 1)}
        >
          <FiArrowRight />
        </button>
      </div>
      {pageError && (
        <div className="pt-error" role="alert">
          {t(pageError)}
          {t(" ")}
          <button onClick={() => setRevision((v) => v + 1)}>
            {t("Yeniden dene")}
          </button>
        </div>
      )}
      <section
        className={t("pt-panel pt-quran-reader {v0}", {
          v0: preferences.largeText ? "pt-reader-large" : "",
        })}
      >
        {t(
          pageLoading ? (
            <p className="pt-empty" role="status">
              {t("Sayfa yükleniyor…")}
            </p>
          ) : (
            content && (
              <>
                <div className="pt-reader-heading">
                  <h2>{t(content.firstSurahName || "Kur’an-ı Kerim")}</h2>
                  <span className="pt-tag">
                    {t(
                      content.juzNumber
                        ? t("{v0}. cüz · ", {
                            v0: content.juzNumber,
                          })
                        : ""
                    )}
                    {t(page)}
                    {t(". sayfa")}
                  </span>
                </div>
                {t(
                  content.verses?.map((verse) => (
                    <article className="pt-verse" key={verse.ayahKey}>
                      <span className="pt-verse-reference">
                        {verse.surahName} · {verse.ayahNumber}
                        {t(". ayet")}
                      </span>
                      <p className="pt-arabic" dir="rtl" lang="ar">
                        {verse.arabic}
                      </p>
                      <p>{verse.translation}</p>
                      <button
                        className="pt-button secondary"
                        onClick={() => setAudioVerse(verse)}
                      >
                        {t("Ayet dinle")}
                      </button>
                    </article>
                  ))
                )}
                {hatim && hatim.status !== "completed" && (
                  <div className="pt-reader-finish">
                    <button
                      className="pt-button"
                      disabled={
                        busy ||
                        !content.verses?.length ||
                        page !== (hatim.completedPages || 0) + 1
                      }
                      onClick={markRead}
                    >
                      <FiCheck />
                      {t(busy ? "Kaydediliyor…" : "Bu sayfayı okudum")}
                    </button>
                    {page !== (hatim.completedPages || 0) + 1 && (
                      <p className="pt-note">
                        {t(
                          "Hatim ilerlemesi sırayla kaydedilir. Sıradaki sayfan:"
                        )}
                        {t(" ")}
                        {t((hatim.completedPages || 0) + 1)}.
                      </p>
                    )}
                  </div>
                )}
              </>
            )
          )
        )}
      </section>
    </>
  );
}
