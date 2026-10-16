import { getPreferences } from "../../context/Preferences";
import { t } from "../../context/Preferences";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCheck,
  FiMapPin,
  FiRefreshCw,
  FiSun,
  FiMoon,
  FiBookOpen,
  FiCircle,
  FiCalendar,
} from "react-icons/fi";
import { request, errorMessage } from "../../services/api";
import { getSession } from "../../utils/session";
import {
  PRAYERS,
  NAFILE,
  emptyNafile,
  dateKey,
  countdown,
  getNextPrayer,
} from "../../utils/prayers";
import "./DashboardHome.css";
export default function DashboardHome() {
  const user = getSession();
  const [now, setNow] = useState(() => new Date());
  const today = dateKey(now);
  const [prayers, setPrayers] = useState({});
  const [nafile, setNafile] = useState(emptyNafile);
  const [stats, setStats] = useState({});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState("");
  const [loading, setLoading] = useState(true);
  const [times, setTimes] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [locationBusy, setLocationBusy] = useState(false);
  const currentDay = useRef(today);
  currentDay.current = today;
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const setError = useCallback(
    (key, value) =>
      setErrors((old) => ({
        ...old,
        [key]: value,
      })),
    []
  );
  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setErrors({});
      setPrayers({});
      setNafile(emptyNafile());
      setStats({});
      const monthStart = `${today.slice(0, 7)}-01`;
      const end = new Date(`${today}T12:00:00`);
      end.setMonth(end.getMonth() + 1, 0);
      const tasks = [
        [
          "prayers",
          request("/daily/prayer", {
            params: {
              date: today,
            },
            signal,
          }),
          (data) => setPrayers(data || {}),
        ],
        [
          "nafile",
          request("/nafile/get", {
            params: {
              userId: user._id,
              date: today,
            },
            signal,
          }),
          (data) =>
            setNafile({
              ...emptyNafile(),
              ...data,
            }),
        ],
        [
          "week",
          request("/daily/prayer/stats", {
            params: {
              period: "week",
            },
            signal,
          }),
          (data) =>
            setStats((old) => ({
              ...old,
              week: data?.prayed ?? 0,
            })),
        ],
        [
          "kaza",
          request("/kaza/list", {
            signal,
          }),
          (data) =>
            setStats((old) => ({
              ...old,
              kaza: (data || []).reduce(
                (sum, debt) => sum + (debt.totalDebtRakats || 0),
                0
              ),
            })),
        ],
        [
          "fasting",
          request("/fasting/range", {
            params: {
              startDate: monthStart,
              endDate: dateKey(end),
            },
            signal,
          }),
          (data) =>
            setStats((old) => ({
              ...old,
              fasting: (data || []).filter((item) => item.fasted).length,
            })),
        ],
      ];
      await Promise.all(
        tasks.map(async ([key, task, apply]) => {
          try {
            const data = await task;
            if (!signal?.aborted && currentDay.current === today) apply(data);
          } catch (error) {
            if (!signal?.aborted && currentDay.current === today)
              setError(key, errorMessage(error));
          }
        })
      );
      if (!signal?.aborted && currentDay.current === today) setLoading(false);
    },
    [today, user._id, setError]
  );
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);
  useEffect(() => {
    if (!coordinates) return;
    const controller = new AbortController();
    setTimes([]);
    setLocationBusy(true);
    setError("location", "");
    request("/prayer-times/calculate", {
      method: "post",
      jwt: true,
      signal: controller.signal,
      data: {
        ...coordinates,
        date: today,
        days: 2,
      },
    })
      .then((data) => {
        if (!controller.signal.aborted)
          setTimes(
            Array.isArray(data?.times)
              ? data.times.map((day) => ({
                  date: day.date,
                  times: day.times || day,
                }))
              : []
          );
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setError("location", errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLocationBusy(false);
      });
    return () => controller.abort();
  }, [coordinates, today, setError]);
  const locate = () => {
    if (!navigator.geolocation) {
      setError("location", "Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }
    setLocationBusy(true);
    setError("location", "");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      () => {
        setLocationBusy(false);
        setError(
          "location",
          "Konum alınamadı. Tarayıcı ayarlarından konum iznini açıp yeniden deneyin."
        );
      },
      {
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };
  const next = useMemo(() => getNextPrayer(times, now), [times, now]);
  const todayTimes = times.find((day) => day.date === today)?.times;
  const completed = PRAYERS.filter(({ key }) => prayers[key]).length;
  const nafileCompleted = NAFILE.filter(
    ({ key }) => nafile[key]?.completed
  ).length;
  const savePrayer = async (key) => {
    if (busy || errors.prayers || loading) return;
    const day = today;
    setBusy(key);
    setError("save", "");
    try {
      await request("/daily/prayer", {
        method: "post",
        data: {
          date: day,
          prayerType: key,
          status: !prayers[key],
        },
      });
      if (currentDay.current === day) {
        setPrayers((old) => ({
          ...old,
          [key]: !prayers[key],
        }));
        const week = await request("/daily/prayer/stats", {
          params: {
            period: "week",
          },
        });
        if (currentDay.current === day)
          setStats((old) => ({
            ...old,
            week: week?.prayed ?? 0,
          }));
      }
    } catch (error) {
      if (currentDay.current === day) setError("save", errorMessage(error));
    } finally {
      setBusy("");
    }
  };
  const saveNafile = async (key, update) => {
    if (busy || errors.nafile || loading) return;
    const day = today;
    setBusy(key);
    setError("save", "");
    const entry = {
      ...nafile[key],
      ...update,
    };
    try {
      await request("/nafile", {
        method: "post",
        data: {
          userId: user._id,
          date: day,
          [key]: entry,
        },
      });
      if (currentDay.current === day)
        setNafile((old) => ({
          ...old,
          [key]: entry,
        }));
    } catch (error) {
      if (currentDay.current === day) setError("save", errorMessage(error));
    } finally {
      setBusy("");
    }
  };
  return (
    <div className="pt-home">
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t("HAYIRLI BİR GÜNE")}</p>
          <h1>
            {t("Selam, ")}
            {t((user.name || user.username || "hoş geldin").split(" ")[0])}
            {t(" ")}
            <span className="pt-greeting-sun">
              <FiSun />
            </span>
          </h1>
          <p>
            {now.toLocaleDateString(getPreferences().language, {
              day: "numeric",
              month: "long",
              year: "numeric",
              weekday: "long",
            })}
          </p>
        </div>
        <button
          className="pt-icon-button"
          aria-label={t("Kayıtları yenile")}
          disabled={loading || Boolean(busy)}
          onClick={() => load()}
        >
          <FiRefreshCw />
        </button>
      </div>
      {Object.entries(errors).filter(
        ([key, value]) => value && key !== "location"
      ).length > 0 && (
        <div className="pt-error" role="alert">
          {t(
            errors.save ||
              "Bazı kayıtlar yüklenemedi. Kayıtları yenileyerek yeniden deneyebilirsin."
          )}
        </div>
      )}
      <section className="pt-time-hero" aria-label={t("Sıradaki namaz vakti")}>
        <div className="pt-time-hero-copy">
          <span className="pt-light-label">
            <FiMapPin />
            {t(" ")}
            {t(
              coordinates ? "Bulunduğun konum" : "Vakitler senin konumuna göre"
            )}
          </span>
          <p className="pt-eyebrow">
            {t(next ? "SIRADAKİ VAKİT" : "GÜNÜN İÇİNDE BİR HUZUR MOLASI")}
          </p>
          <h2>
            {t(
              next
                ? t("{v0} namazı", {
                    v0: next.name,
                  })
                : "Vaktine yer aç."
            )}
          </h2>
          <p>
            {t(
              next
                ? t("Vakit {v0} · Hazırlanmak için güzel bir an.", {
                    v0: next.time,
                  })
                : "Konumunu paylaş, namaz vakitlerin ve sonraki vakte kalan süre burada görünsün."
            )}
          </p>
          <button
            className="pt-location-button"
            onClick={locate}
            disabled={locationBusy}
          >
            <FiMapPin />
            {t(
              locationBusy
                ? "Konum ve vakitler alınıyor…"
                : coordinates
                ? "Konumu güncelle"
                : "Vakitlerimi göster"
            )}
          </button>
        </div>
        <div className="pt-countdown-ring">
          <FiMoon />
          <strong>
            {t(next ? countdown((next.at - now) / 1000) : "— : —")}
          </strong>
          <span>{t(next ? "vaktin girmesine" : "konumunu seçerek başla")}</span>
        </div>
      </section>
      {errors.location && (
        <div className="pt-error" role="alert">
          {t(errors.location)}
        </div>
      )}
      <div className="pt-home-columns">
        <div className="pt-home-primary">
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Bugünkü namazlarım")}</h2>
              <span className="pt-tag">
                {t(
                  loading || errors.prayers
                    ? "—"
                    : t("{v0}/5 tamamlandı", {
                        v0: completed,
                      })
                )}
              </span>
            </div>
            <div className="pt-prayer-grid">
              {PRAYERS.map((prayer) => (
                <button
                  key={prayer.key}
                  disabled={Boolean(busy) || loading || Boolean(errors.prayers)}
                  aria-pressed={Boolean(prayers[prayer.key])}
                  aria-label={t("{v0} namazı {v1}", {
                    v0: prayer.name,
                    v1: prayers[prayer.key] ? "kılındı" : "kılınmadı",
                  })}
                  className={`pt-prayer-tile ${
                    prayers[prayer.key] ? "is-done" : ""
                  }`}
                  onClick={() => savePrayer(prayer.key)}
                  style={{
                    backgroundImage: `url(${prayer.image})`,
                  }}
                >
                  <span className="pt-prayer-tick">
                    {prayers[prayer.key] && <FiCheck />}
                  </span>
                  <strong>{t(prayer.name)}</strong>
                  <span>{t(todayTimes?.[prayer.key] || "— : —")}</span>
                </button>
              ))}
            </div>
            <div className="pt-daily-progress">
              <span>{t("Her vakit, yeni bir başlangıç.")}</span>
              <div
                role="progressbar"
                aria-label={t("Günlük namaz ilerlemesi")}
                aria-valuenow={completed}
                aria-valuemin={0}
                aria-valuemax={5}
              >
                <i
                  style={{
                    width: `${completed * 20}%`,
                  }}
                />
              </div>
            </div>
          </section>
          <section className="pt-panel">
            <div className="pt-section-heading">
              <div>
                <h2>{t("Nafile namazlar")}</h2>
                <p className="pt-section-description">
                  {t("Gününe küçük bir güzellik daha ekle.")}
                </p>
              </div>
              <span className="pt-tag">
                {t(loading || errors.nafile ? "—" : `${nafileCompleted}/4`)}
              </span>
            </div>
            <div className="pt-nafile-grid">
              {NAFILE.map((prayer) => (
                <article
                  key={prayer.key}
                  className="pt-nafile-tile"
                  style={{
                    backgroundImage: `url(${prayer.image})`,
                  }}
                >
                  <div>
                    <h3>{t(prayer.name)}</h3>
                    <p>{t(prayer.time)}</p>
                  </div>
                  <div className="pt-nafile-bottom">
                    <div
                      className="pt-rakats"
                      role="group"
                      aria-label={t("{v0} rekât seçimi", {
                        v0: prayer.name,
                      })}
                    >
                      {prayer.rakats.map((rakat) => (
                        <button
                          key={rakat}
                          title={`${rakat} rekât`}
                          aria-label={`${prayer.name} ${rakat} rekât`}
                          aria-pressed={nafile[prayer.key]?.rakats === rakat}
                          disabled={
                            Boolean(busy) || loading || Boolean(errors.nafile)
                          }
                          onClick={() =>
                            saveNafile(prayer.key, {
                              rakats: rakat,
                              completed: true,
                            })
                          }
                        >
                          {t(rakat)}
                        </button>
                      ))}
                    </div>
                    <button
                      className="pt-nafile-check"
                      aria-label={t("{v0} tamamlandı", {
                        v0: prayer.name,
                      })}
                      aria-pressed={Boolean(nafile[prayer.key]?.completed)}
                      disabled={
                        Boolean(busy) || loading || Boolean(errors.nafile)
                      }
                      onClick={() =>
                        saveNafile(prayer.key, {
                          completed: !nafile[prayer.key]?.completed,
                        })
                      }
                    >
                      {nafile[prayer.key]?.completed && <FiCheck />}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside className="pt-home-secondary">
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Küçük adımların")}</h2>
              <FiCalendar />
            </div>
            <div className="pt-week-stat">
              <strong>
                {t(stats.week ?? "—")}
                <small>/ 35</small>
              </strong>
              <span>{t("bu hafta kılınan namaz")}</span>
            </div>
            <div className="pt-mini-stats">
              <Link to="/kaza">
                <FiRefreshCw />
                <span>
                  {t("Kaza borcum")}
                  <strong>
                    {t(
                      stats.kaza === undefined
                        ? "—"
                        : stats.kaza.toLocaleString("tr-TR")
                    )}
                    {t(" ")}
                    <small>{t("rekât")}</small>
                  </strong>
                </span>
                <FiArrowUpRight />
              </Link>
              <Link to="/fasting">
                <FiMoon />
                <span>
                  {t("Bu ay oruç")}
                  <strong>
                    {t(stats.fasting ?? "—")} <small>{t("gün")}</small>
                  </strong>
                </span>
                <FiArrowUpRight />
              </Link>
            </div>
          </section>
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Kendine zaman ayır")}</h2>
              <Link to="/tools">
                {t("Tümü ")}
                <FiArrowUpRight />
              </Link>
            </div>
            <div className="pt-quick-links">
              <Link to="/tesbih">
                <span>
                  <FiCircle />
                </span>
                <div>
                  <strong>{t("Dijital tesbih")}</strong>
                  <small>{t("Zikrine kaldığın yerden devam et.")}</small>
                </div>
                <FiArrowUpRight />
              </Link>
              <Link to="/duas">
                <span>
                  <FiBookOpen />
                </span>
                <div>
                  <strong>{t("Dua kütüphanesi")}</strong>
                  <small>{t("Günün her anına bir dua.")}</small>
                </div>
                <FiArrowUpRight />
              </Link>
              <Link to="/hatim">
                <span>
                  <FiBookOpen />
                </span>
                <div>
                  <strong>{t("Hatim takibi")}</strong>
                  <small>{t("Sayfa sayfa, aynı niyetle.")}</small>
                </div>
                <FiArrowUpRight />
              </Link>
            </div>
          </section>
          <div className="pt-intention">
            <FiSun />
            <p>
              {t("Bugün, güzel bir niyetle")}
              <br />
              <strong>{t("yeniden başlamak için var.")}</strong>
            </p>
            <span>{t("Her gün aynı özenle.")}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
