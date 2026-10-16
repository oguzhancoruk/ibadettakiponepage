import { t } from "../context/Preferences";
import { useEffect, useState } from "react";
import { FiRotateCcw, FiSave, FiMinus } from "react-icons/fi";
import { getSession } from "../utils/session";
import { request, errorMessage } from "../services/api";
import { dateKey } from "../utils/prayers";
import "./Tools.css";
export default function Tesbih() {
  const user = getSession();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(0);
  const [day, setDay] = useState(() => dateKey(new Date()));
  useEffect(() => {
    const timer = setInterval(() => setDay(dateKey(new Date())), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoaded(false);
    setError("");
    setMessage("");
    request("/tesbih/stats", {
      params: {
        userId: user._id,
        period: "today",
      },
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) {
          setLoaded(true);
          setCount(data?.todayCount || 0);
          setTarget(data?.todayTarget || 33);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [user._id, revision, day]);
  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await request("/tesbih", {
        method: "post",
        data: {
          userId: user._id,
          count,
          target,
          completed: count >= target,
        },
      });
      setMessage("Bugünkü tesbih kaydın hesabına kaydedildi.");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const change = (next) => {
    setCount(Math.max(0, next));
    setMessage("");
  };
  return (
    <>
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t("BİR NEFES, BİR ZİKİR")}</p>
          <h1>{t("Dijital tesbih")}</h1>
          <p>{t("Saymak için dokun. Bitirdiğinde hesabına kaydet.")}</p>
        </div>
      </div>
      <section className="pt-panel pt-tesbih-panel">
        {error && (
          <div className="pt-error" role="alert">
            {t(error)}
            {t(" ")}
            <button onClick={() => setRevision((v) => v + 1)}>
              {t("Kaydı yeniden yükle")}
            </button>
          </div>
        )}
        <label className="pt-field pt-target-field">
          {t("Günlük hedef")}
          <select
            value={target}
            disabled={!loaded || loading || busy}
            onChange={(e) => {
              setTarget(Number(e.target.value));
              setMessage("");
            }}
          >
            {[...new Set([33, 99, 100, 500, 1000, target])]
              .sort((a, b) => a - b)
              .map((value) => (
                <option key={value}>{t(value)}</option>
              ))}
          </select>
        </label>
        <button
          className="pt-tesbih-counter"
          disabled={!loaded || loading || busy}
          aria-label={t("Tesbih sayacı {v0}, artır", {
            v0: count,
          })}
          onClick={() => change(count + 1)}
          style={{
            "--progress": `${Math.min(100, (count / target) * 100)}%`,
          }}
        >
          <span>{t(loading ? "…" : count)}</span>
          <small>
            {t(
              count >= target
                ? "Hedefine ulaştın"
                : t("{v0} hedefine doğru", {
                    v0: target,
                  })
            )}
          </small>
          <em>{t("Dokun ve devam et")}</em>
        </button>
        <div className="pt-actions">
          <button
            className="pt-icon-button"
            disabled={!loaded || loading || busy || count === 0}
            aria-label={t("Bir azalt")}
            onClick={() => change(count - 1)}
          >
            <FiMinus />
          </button>
          <button
            className="pt-button secondary"
            disabled={!loaded || loading || busy}
            onClick={() => {
              if (window.confirm("Bugünkü sayacı sıfırlamak istiyor musun?"))
                change(0);
            }}
          >
            <FiRotateCcw />
            {t(" Sıfırla")}
          </button>
          <button
            className="pt-button"
            disabled={!loaded || loading || busy}
            onClick={save}
          >
            <FiSave /> {t(busy ? "Kaydediliyor…" : "Hesabıma kaydet")}
          </button>
        </div>
        <p className="pt-note">
          {t(
            "Kaydet düğmesi bugünkü ortak tesbih kaydını günceller. Kaydetmediğin değişiklikler sayfadan ayrıldığında korunmaz."
          )}
        </p>
        <p className="pt-success" role="status">
          {t(message)}
        </p>
      </section>
    </>
  );
}
