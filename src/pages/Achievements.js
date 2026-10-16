import { getPreferences } from "../context/Preferences";
import { t } from "../context/Preferences";
import { useMemo, useState } from "react";
import { FiAward, FiLock, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { request } from "../services/api";
import { useRemote, useMutation } from "../hooks/useRemote";
import {
  PageHeading,
  Feedback,
  Empty,
  StatsStrip,
} from "../components/community/Shared";
import { getAchievementBadgeSource } from "../utils/badgeAssets";
const categories = {
  all: "Tüm kategoriler",
  prayer: "Namaz",
  tesbih: "Tesbih",
  nafile: "Nafile",
  quran: "Kur’an",
  fasting: "Oruç",
  general: "Genel",
};
const tiers = {
  bronze: "Bronz",
  silver: "Gümüş",
  gold: "Altın",
  platinum: "Platin",
  diamond: "Elmas",
};
export default function Achievements() {
  const badges = useRemote("/achievements", {
    jwt: true,
  });
  const mutation = useMutation();
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const all = useMemo(() => badges.data?.achievements || [], [badges.data]);
  const filtered = useMemo(
    () =>
      all.filter(
        (item) =>
          (category === "all" || item.achievement?.category === category) &&
          (status === "all" ||
            (status === "earned" ? item.unlocked : !item.unlocked))
      ),
    [all, category, status]
  );
  const earned = all.filter((item) => item.unlocked).length;
  const check = async () => {
    const result = await mutation.run("check", () =>
      request("/achievements/check", {
        method: "post",
        jwt: true,
        data: {},
      })
    );
    if (result.ok) {
      const count = result.value?.newAchievements?.length || 0;
      mutation.setMessage(
        count
          ? `${count} yeni rozet kazandın!`
          : "Rozetlerin güncel. İbadet yolculuğuna devam et."
      );
      badges.refresh();
    }
  };
  return (
    <>
      <PageHeading
        eyebrow={t("KÜÇÜK ADIMLARIN BİRİKİR")}
        title={t("Rozetlerim")}
        description={t(
          "İbadet alışkanlıklarınla kazandığın rozetleri ve ilerlemeni keşfet."
        )}
      />
      <Feedback error={badges.error} retry={badges.refresh} />
      <Feedback error={mutation.error} message={mutation.message} />
      <section className="pt-panel pt-achievement-overview">
        <div>
          <span className="pt-tool-icon">
            <FiAward />
          </span>
          <p className="pt-eyebrow">{t("HER ADIMIN BİR İZİ VAR")}</p>
          <h2>
            {t(
              badges.data
                ? t("{v0} rozet kazandın", {
                    v0: earned,
                  })
                : "Yolculuğundaki izler"
            )}
          </h2>
          <p className="pt-note">
            {t(
              "Mobil ve web’deki ibadetlerin aynı rozet koleksiyonuna yansır."
            )}
          </p>
          <button
            className="pt-button secondary"
            disabled={
              badges.loading || Boolean(mutation.busy) || Boolean(badges.error)
            }
            onClick={check}
          >
            <FiRefreshCw />
            {t(mutation.busy ? "Kontrol ediliyor…" : "İlerlememi kontrol et")}
          </button>
        </div>
        <StatsStrip
          items={[
            ["Kazanılan", badges.data ? earned : null],
            ["Seviye", badges.data?.level],
            ["Toplam XP", badges.data?.totalXP],
          ]}
        />
      </section>
      {badges.data && (
        <div className="pt-level-progress">
          <span>
            {t("Sonraki seviyeye: ")}
            {t(badges.data.currentXP ?? 0)} /{t(" ")}
            {t(badges.data.nextLevelXP ?? "—")}
            {t(" XP")}
          </span>
          <progress
            aria-label={t("Seviye ilerlemesi")}
            max={Math.max(1, badges.data.nextLevelXP || 1)}
            value={Math.min(
              badges.data.currentXP || 0,
              badges.data.nextLevelXP || 1
            )}
          />
        </div>
      )}
      <div className="pt-badge-filters">
        <label className="pt-field">
          {t("Kategori")}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {Object.entries(categories).map(([key, label]) => (
              <option value={key} key={key}>
                {t(label)}
              </option>
            ))}
          </select>
        </label>
        <label className="pt-field">
          {t("Durum")}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">{t("Tüm rozetler")}</option>
            <option value="earned">{t("Kazanılanlar")}</option>
            <option value="locked">{t("Henüz kazanılmayanlar")}</option>
          </select>
        </label>
      </div>
      {t(
        badges.loading ? (
          <p className="pt-empty" role="status">
            {t("Rozetlerin yükleniyor…")}
          </p>
        ) : (
          !badges.error && (
            <>
              <div className="pt-badge-grid">
                {filtered.map((item) => {
                  const a = item.achievement;
                  const percent = Math.max(
                    0,
                    Math.min(100, Number(item.progress) || 0)
                  );
                  return (
                    <article
                      className={`pt-badge-card ${
                        item.unlocked ? "is-earned" : ""
                      }`}
                      key={a._id || a.key}
                    >
                      <span
                        className={`pt-badge-state ${
                          item.unlocked ? "earned" : ""
                        }`}
                      >
                        {t(item.unlocked ? <FiCheckCircle /> : <FiLock />)}
                        {t(item.unlocked ? "Kazanıldı" : "Kilitli")}
                      </span>
                      <img
                        src={getAchievementBadgeSource(a, !item.unlocked)}
                        alt=""
                        loading="lazy"
                      />
                      <span className="pt-eyebrow">
                        {t(tiers[a.tier] || a.tier)} ·{t(" ")}
                        {t(categories[a.category] || "Genel")}
                      </span>
                      <h2>{t(a.title)}</h2>
                      <p>{t(a.description)}</p>
                      <div className="pt-badge-bottom">
                        <span>
                          {t(a.xp || 0)}
                          {t(" XP")}
                        </span>
                        {t(
                          item.unlocked ? (
                            <small>
                              {t(
                                item.unlockedAt
                                  ? new Date(
                                      item.unlockedAt
                                    ).toLocaleDateString(
                                      getPreferences().language
                                    )
                                  : ""
                              )}
                            </small>
                          ) : (
                            <span>%{t(percent)}</span>
                          )
                        )}
                      </div>
                      {!item.unlocked && (
                        <progress
                          max={100}
                          value={percent}
                          aria-label={`${a.title} ilerlemesi`}
                        />
                      )}
                    </article>
                  );
                })}
              </div>
              {!filtered.length && (
                <Empty>{t("Bu filtreye uygun rozet bulunmuyor.")}</Empty>
              )}
            </>
          )
        )
      )}
    </>
  );
}
