import { useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { useRemote } from "../hooks/useRemote";
import { getSession } from "../utils/session";
import { PRAYERS } from "../utils/prayers";
import {
  PageHeading,
  Feedback,
  StatsStrip,
} from "../components/community/Shared";
import { usePreferences, t } from "../context/Preferences";
import "./Extended.css";
export default function Reports() {
  const { language } = usePreferences();
  const today = new Date();
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const report = useRemote(
    `/stats/${period}`,
    period === "yearly"
      ? {
          jwt: true,
          params: {
            year,
          },
        }
      : {
          params: {
            userId: getSession()._id,
            year,
            month,
          },
        }
  );
  const data = report.data;
  const prayers = data?.prayers || data?.prayer;
  const months = Array.from(
    {
      length: 12,
    },
    (_, i) =>
      new Date(year, i, 1).toLocaleDateString(language, {
        month: "long",
      })
  );
  const trend =
    period === "yearly"
      ? Object.entries(prayers?.byMonth || {}).map(([key, value]) => ({
          label: months[Number(key)],
          completed: value.completed,
          total: value.total,
        }))
      : (prayers?.trend || []).map((row) => ({
          label: `${months[row.month - 1]} ${row.year}`,
          completed: row.completed,
          percentage: row.percentage,
        }));
  return (
    <>
      <PageHeading
        eyebrow={t("İLERLEMENİ GÖR")}
        title={t("İbadet raporlarım")}
        description={t(
          "Aylık ve yıllık kayıtlarını incele, raporunu PDF olarak sakla."
        )}
      />
      <div className="pt-actions pt-report-controls">
        <label className="pt-field">
          {t("Dönem")}
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="monthly">{t("Aylık")}</option>
            <option value="yearly">{t("Yıllık")}</option>
          </select>
        </label>
        <label className="pt-field">
          {t("Yıl")}
          <input
            type="number"
            min="1900"
            max={today.getFullYear()}
            value={year}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1900 && value <= today.getFullYear()) setYear(value);
            }}
          />
        </label>
        {period === "monthly" && (
          <label className="pt-field">
            {t("Ay")}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {months.map((name, i) => (
                <option value={i + 1} key={name}>
                  {t(name)}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          className="pt-button"
          disabled={!data || report.loading || Boolean(report.error)}
          onClick={() => window.print()}
        >
          <FiPrinter />
          {t(" PDF / Yazdır")}
        </button>
      </div>
      <Feedback error={report.error} retry={report.refresh} />
      {report.loading && <p role="status">{t("Rapor yükleniyor…")}</p>}
      {data && (
        <section className="pt-report" aria-label={t("İbadet raporu")}>
          <div className="pt-panel pt-report-title">
            <p className="pt-eyebrow">{t("İBADET TAKİP")}</p>
            <h2>
              {t(period === "monthly" ? `${months[month - 1]} ${year}` : year)}
            </h2>
            <p>{t(getSession().name)}</p>
            <p className="pt-note">
              {t(
                "Namaz oranları seçilen dönemdeki toplam beş vakte göre hesaplanır. Kaydedilmeyen vakitler tamamlanmış sayılmaz."
              )}
            </p>
          </div>
          <StatsStrip
            items={[
              ["Namaz", `${prayers.completed} / ${prayers.total}`],
              [
                "Tamamlama",
                `%${prayers.percentage ?? data.completionPercentage}`,
              ],
              ["Oruç", data.fasting?.total ?? "—"],
              ["Zikir", data.tesbih?.total ?? data.tesbih?.totalCount ?? 0],
            ]}
          />
          <div className="pt-extended-grid">
            <section className="pt-panel">
              <h2>{t("Vakitlere göre")}</h2>
              {PRAYERS.map(({ key, label, name }) => {
                const value = prayers.byPrayer?.[key];
                return (
                  <div className="pt-metric-row" key={key}>
                    <span>{t(label || name)}</span>
                    <strong>
                      {t(
                        typeof value === "number"
                          ? value
                          : value?.completed || 0
                      )}
                    </strong>
                  </div>
                );
              })}
            </section>
            <section className="pt-panel">
              <h2>{t("Dönem karşılaştırması")}</h2>
              {trend.map((row) => (
                <div className="pt-trend-row" key={row.label}>
                  <span>{t(row.label)}</span>
                  <progress
                    aria-label={row.label}
                    max="100"
                    value={
                      row.percentage ??
                      (row.total
                        ? Math.round((row.completed / row.total) * 100)
                        : 0)
                    }
                  />
                  <strong>{t(row.completed)}</strong>
                </div>
              ))}
            </section>
          </div>
          {data.streaks && (
            <StatsStrip
              items={[
                ["Devam eden seri", data.streaks.current],
                ["En uzun seri", data.streaks.longest],
                ["Nafile namaz", data.nafile?.total || 0],
              ]}
            />
          )}
          <p className="pt-print-only">
            {t("Oluşturulma tarihi")}: {today.toLocaleDateString(language)}
          </p>
        </section>
      )}
    </>
  );
}
