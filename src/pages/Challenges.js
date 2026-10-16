import { t } from "../context/Preferences";
import { useRemote, useMutation } from "../hooks/useRemote";
import { request } from "../services/api";
import { PageHeading, Feedback, Empty } from "../components/community/Shared";
import "./Extended.css";
export default function Challenges() {
  const remote = useRemote("/challenges");
  const mutation = useMutation();
  const act = async (challenge, action) => {
    if (
      action === "abandon" &&
      !window.confirm("Bu hedefi bırakmak istiyor musun?")
    )
      return;
    const progress = challenge.userProgress;
    const result = await mutation.run(
      challenge.key,
      () =>
        request(
          action === "start"
            ? `/challenges/${encodeURIComponent(challenge.key)}/start`
            : `/challenges/${progress.userChallengeId}/${
                action === "advance" ? "progress" : "abandon"
              }`,
          {
            method: action === "advance" ? "put" : "post",
            data:
              action === "advance"
                ? {
                    amount: 1,
                  }
                : {},
          }
        ),
      action === "start"
        ? "Hedefin başladı."
        : action === "advance"
        ? "İlerlemen kaydedildi."
        : "Hedef bırakıldı."
    );
    if (result.ok) remote.refresh();
  };
  return (
    <>
      <PageHeading
        eyebrow={t("KÜÇÜK ADIMLAR")}
        title={t("Hedeflerim")}
        description={t(
          "Kendine bir hedef seç, tamamladığın adımları takip et."
        )}
      />
      <Feedback
        error={remote.error || mutation.error}
        message={mutation.message}
        retry={remote.error ? remote.refresh : undefined}
      />
      {t(
        remote.loading ? (
          <p role="status">{t("Hedefler yükleniyor…")}</p>
        ) : (
          <div className="pt-extended-grid">
            {t(
              remote.data?.map((challenge) => {
                const progress = challenge.userProgress;
                const target = challenge.requirement?.value || 1;
                return (
                  <article className="pt-panel" key={challenge.key}>
                    <span className="pt-tag">
                      {t(challenge.xpReward)}
                      {t(" XP")}
                    </span>
                    <h2>{t(challenge.title)}</h2>
                    <p className="pt-note">{t(challenge.description)}</p>
                    <p>
                      {t(progress?.progress || 0)} / {t(target)}
                    </p>
                    <progress
                      aria-label={challenge.title}
                      value={progress?.progress || 0}
                      max={target}
                    />
                    <div className="pt-actions pt-section-gap">
                      {t(
                        !progress ? (
                          <button
                            className="pt-button"
                            disabled={Boolean(mutation.busy)}
                            onClick={() => act(challenge, "start")}
                          >
                            {t("Hedefi başlat")}
                          </button>
                        ) : progress.status === "active" ? (
                          <>
                            <button
                              className="pt-button"
                              disabled={Boolean(mutation.busy)}
                              onClick={() => act(challenge, "advance")}
                            >
                              {t("Bir adım tamamladım")}
                            </button>
                            <button
                              className="pt-button secondary"
                              disabled={Boolean(mutation.busy)}
                              onClick={() => act(challenge, "abandon")}
                            >
                              {t("Hedefi bırak")}
                            </button>
                          </>
                        ) : (
                          <span className="pt-tag">
                            {t(
                              {
                                completed: "Tamamlandı",
                                abandoned: "Bırakıldı",
                                failed: "Süresi doldu",
                              }[progress.status] || progress.status
                            )}
                          </span>
                        )
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )
      )}
      {!remote.loading && !remote.error && !remote.data?.length && (
        <Empty>{t("Şu anda yeni bir hedef bulunmuyor.")}</Empty>
      )}
      <p className="pt-note">
        {t("İlerlemeni tamamladığın her adım için kendin kaydedersin.")}
      </p>
    </>
  );
}
