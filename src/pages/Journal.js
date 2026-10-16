import { t } from "../context/Preferences";
import { useEffect, useState } from "react";
import { useRemote, useMutation } from "../hooks/useRemote";
import { request } from "../services/api";
import { dateKey } from "../utils/prayers";
import { PageHeading, Feedback, Empty } from "../components/community/Shared";
import "./Extended.css";
const MOODS = [
  ["very_happy", "Harika", "☀️"],
  ["happy", "İyi", "🌤️"],
  ["neutral", "Dengeli", "☁️"],
  ["sad", "Üzgün", "🌧️"],
  ["very_sad", "Çok üzgün", "🌧️"],
];
const blank = () => ({
  mood: "neutral",
  energyLevel: 3,
  gratitude: "",
  journalEntry: "",
  prayerImpact: "not_set",
});
export default function Journal() {
  const [date, setDate] = useState(dateKey(new Date()));
  const [form, setForm] = useState(blank);
  const [dirty, setDirty] = useState(false);
  const day = useRemote("/mood/list", {
    jwt: true,
    params: {
      startDate: `${date}T00:00:00`,
      endDate: `${date}T23:59:59.999`,
      limit: 1,
    },
  });
  const history = useRemote("/mood/list", {
    jwt: true,
    params: {
      limit: 30,
    },
  });
  const mutation = useMutation();
  useEffect(() => {
    if (day.loading || !day.data) return;
    const record = day.data.moods?.[0];
    setForm(
      record
        ? {
            ...record,
            gratitude: (record.gratitude || []).join("\n"),
          }
        : blank()
    );
    setDirty(false);
  }, [day.loading, day.data]);
  useEffect(() => {
    const prevent = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  const update = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
    setDirty(true);
  };
  const selectDate = (value) => {
    if (
      dirty &&
      !window.confirm(
        "Kaydedilmemiş notların var. Tarihi değiştirmek istiyor musun?"
      )
    )
      return;
    setDirty(false);
    setDate(value);
    mutation.setMessage("");
  };
  return (
    <>
      <PageHeading
        eyebrow={t("KENDİNİ DİNLE")}
        title={t("Ruh halim ve günlüğüm")}
        description={t(
          "Bugün nasıl hissediyorsun? Kendine küçük bir not bırak."
        )}
      />
      <Feedback
        error={day.error || mutation.error}
        message={mutation.message}
        retry={day.error ? day.refresh : undefined}
      />
      <form
        className="pt-panel pt-journal-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await mutation.run(
            "save",
            () =>
              request("/mood/save", {
                method: "post",
                jwt: true,
                data: {
                  ...form,
                  date,
                  gratitude: form.gratitude
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                  energyLevel: Number(form.energyLevel),
                },
              }),
            "Günlüğün kaydedildi."
          );
          if (result.ok) {
            setDirty(false);
            history.refresh();
          }
        }}
      >
        <label className="pt-field">
          {t("Tarih")}
          <input
            type="date"
            required
            max={dateKey(new Date())}
            value={date}
            disabled={Boolean(mutation.busy)}
            onChange={(e) => e.target.value && selectDate(e.target.value)}
          />
        </label>
        {day.loading && <p role="status">{t("Günlüğün yükleniyor…")}</p>}
        <fieldset
          disabled={day.loading || Boolean(day.error) || Boolean(mutation.busy)}
        >
          <legend>{t("Bugünkü ruh halin")}</legend>
          <div className="pt-mood-options">
            {MOODS.map(([key, label, emoji]) => (
              <button
                type="button"
                key={key}
                aria-pressed={form.mood === key}
                className={form.mood === key ? "active" : ""}
                onClick={() => update("mood", key)}
              >
                <span aria-hidden="true">{t(emoji)}</span>
                {t(label)}
              </button>
            ))}
          </div>
          <label className="pt-field">
            {t("Enerjin ")}
            <input
              type="range"
              min="1"
              max="5"
              value={form.energyLevel}
              onChange={(e) => update("energyLevel", e.target.value)}
            />
            <output>{t(form.energyLevel)} / 5</output>
          </label>
          <label className="pt-field">
            {t("Şükrettiğin şeyler")}
            <textarea
              rows="3"
              maxLength="2000"
              placeholder={t("Her satıra bir şey yaz…")}
              value={form.gratitude}
              onChange={(e) => update("gratitude", e.target.value)}
            />
          </label>
          <label className="pt-field">
            {t("Günlük notun")}
            <textarea
              rows="6"
              maxLength="10000"
              value={form.journalEntry}
              onChange={(e) => update("journalEntry", e.target.value)}
            />
          </label>
          <label className="pt-field">
            {t("İbadetin ruh haline etkisi")}
            <select
              value={form.prayerImpact}
              onChange={(e) => update("prayerImpact", e.target.value)}
            >
              <option value="not_set">{t("Belirtmek istemiyorum")}</option>
              <option value="positive">{t("Olumlu")}</option>
              <option value="neutral">{t("Nötr")}</option>
              <option value="negative">{t("Olumsuz")}</option>
            </select>
          </label>
          <button className="pt-button" type="submit">
            {t(mutation.busy ? "Kaydediliyor…" : "Günlüğümü kaydet")}
          </button>
        </fieldset>
      </form>
      <section className="pt-panel pt-section-gap">
        <h2>{t("Son 30 kaydın")}</h2>
        <Feedback error={history.error} retry={history.refresh} />
        {t(
          history.loading ? (
            <p role="status">{t("Yükleniyor…")}</p>
          ) : history.data?.moods?.length ? (
            history.data.moods.map((record) => (
              <button
                key={record._id}
                className="pt-history-row"
                disabled={Boolean(mutation.busy)}
                onClick={() => selectDate(dateKey(new Date(record.date)))}
              >
                <span>{t(dateKey(new Date(record.date)))}</span>
                <span>
                  {t(MOODS.find(([key]) => key === record.mood)?.[2])}
                </span>
                <span>{t(record.energyLevel)} / 5</span>
              </button>
            ))
          ) : (
            !history.error && <Empty>{t("Henüz bir günlük kaydın yok.")}</Empty>
          )
        )}
      </section>
    </>
  );
}
