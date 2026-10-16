import { t } from "../context/Preferences";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiPlay,
  FiHelpCircle,
  FiType,
  FiList,
  FiLock,
  FiCheck,
} from "react-icons/fi";
import { useRemote } from "../hooks/useRemote";
import {
  PageHeading,
  Feedback,
  StatsStrip,
} from "../components/community/Shared";
import { GAME_TYPES, GAME_BADGES } from "../utils/games";
const icons = {
  dailyQuiz: FiHelpCircle,
  wordPuzzle: FiType,
  ordering: FiList,
};
export default function Games() {
  const progress = useRemote("/games/progress", {
    jwt: true,
    raw: true,
  });
  const data = progress.data;
  const todayResult = data?.history?.[data?.dateKey];
  return (
    <>
      <PageHeading
        eyebrow={t("BİRAZ MERAK, BİRAZ KEŞİF")}
        title={t("Oyun merkezi")}
        description={t(
          "Günlük bilgi, kelime ve sıralama oyunlarıyla öğrenmeye küçük bir mola ver."
        )}
      />
      <Feedback error={progress.error} retry={progress.refresh} />
      <section className="pt-games-hero">
        <div>
          <span className="pt-eyebrow">{t("BUGÜNÜN BİLGİ MOLASI")}</span>
          <h2>
            {t(
              todayResult
                ? "Bugünkü bilgi oyununu tamamladın."
                : "Bugün yeni bir şey öğren."
            )}
          </h2>
          <p>
            {t(
              todayResult
                ? t("{v0}/{v1} doğru · {v2} puan", {
                    v0: todayResult.correctCount,
                    v1: todayResult.questionCount,
                    v2: todayResult.earnedPoints,
                  })
                : "Beş soru, birkaç dakika. Öğrendiklerin her gün biriksin."
            )}
          </p>
          <Link className="pt-button" to="/games/dailyQuiz">
            {t(todayResult ? "Sonucumu gör" : "Günlük bilgiye başla")}
            <FiPlay />
          </Link>
        </div>
        <FiHelpCircle className="pt-games-hero-icon" />
      </section>
      <StatsStrip
        items={[
          ["Toplam oyun puanı", data?.totalPoints],
          [
            "Günlük bilgi serisi",
            data
              ? t("{v0} gün", {
                  v0: data.currentStreak || 0,
                })
              : null,
          ],
          ["Oyun rozeti", data?.unlockedBadges?.length],
        ]}
      />
      {progress.loading && (
        <p className="pt-empty" role="status">
          {t("Oyun ilerlemen yükleniyor…")}
        </p>
      )}
      <div className="pt-game-grid">
        {Object.entries(GAME_TYPES).map(([key, game]) => {
          const Icon = icons[key];
          return (
            <Link className="pt-game-card" to={`/games/${key}`} key={key}>
              <span className={`pt-game-icon ${key}`}>
                <Icon />
              </span>
              <p className="pt-eyebrow">{t(game.label)}</p>
              <h2>{t(game.title)}</h2>
              <p>{t(game.description)}</p>
              <span className="pt-game-cta">
                {t("Oyna ")}
                <FiPlay />
              </span>
            </Link>
          );
        })}
      </div>
      <section className="pt-panel">
        <div className="pt-section-heading">
          <h2>{t("Oyun rozetleri")}</h2>
          <FiAward />
        </div>
        <p className="pt-note">
          {t(
            "Oyun puanları ve rozetleri mobil uygulamadaki oyun hesabınla ortaktır. Her oyun türü günde bir kez puan kazandırır."
          )}
        </p>
        <div className="pt-game-badges">
          {Object.entries(GAME_BADGES).map(([key, badge]) => {
            const unlocked = data?.unlockedBadges?.includes(key);
            return (
              <article key={key} className={unlocked ? "is-unlocked" : ""}>
                <span>{t(unlocked ? <FiAward /> : <FiLock />)}</span>
                <div>
                  <h3>{t(badge.name)}</h3>
                  <p>{t(badge.description)}</p>
                  <small>
                    {t(
                      !data ? (
                        "Durum yüklenmedi"
                      ) : unlocked ? (
                        <>
                          <FiCheck />
                          {t("Kazanıldı")}
                        </>
                      ) : (
                        "Henüz kazanılmadı"
                      )
                    )}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
