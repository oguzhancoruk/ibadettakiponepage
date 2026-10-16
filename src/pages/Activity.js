import { useState } from "react";
import { useRemote } from "../hooks/useRemote";
import {
  PageHeading,
  Feedback,
  Person,
  Empty,
} from "../components/community/Shared";
import { usePreferences, t } from "../context/Preferences";
const labels = {
  login: "Giriş yaptı",
  prayer_logged: "Namaz kaydını güncelledi",
  fasting_logged: "Oruç kaydını güncelledi",
  kaza_updated: "Kaza planında ilerledi",
  achievement_unlocked: "Yeni bir rozet kazandı",
  hatim_completed: "Hatmini tamamladı",
  level_up: "Seviye atladı",
  friend_added: "Yeni bir arkadaş ekledi",
  challenge_completed: "Hedefini tamamladı",
};
export default function Activity() {
  const [limit, setLimit] = useState(20);
  const { language } = usePreferences();
  const remote = useRemote("/activities/friends", {
    params: {
      limit,
      skip: 0,
    },
  });
  return (
    <>
      <PageHeading
        eyebrow={t("BİRLİKTE İLERLEYİN")}
        title={t("Arkadaş akışı")}
        description={t(
          "Arkadaşlarının son etkinliklerini ve başarılarını gör."
        )}
      />
      <Feedback error={remote.error} retry={remote.refresh} />
      <section className="pt-panel">
        {t(
          remote.loading ? (
            <p role="status">{t("Etkinlikler yükleniyor…")}</p>
          ) : remote.data?.length ? (
            remote.data.map((item) => (
              <Person
                key={item._id}
                name={item.userId?.name}
                detail={`${t(
                  labels[item.activityType] || "Yeni etkinlik"
                )} · ${new Date(item.createdAt).toLocaleString(language)}`}
              />
            ))
          ) : (
            !remote.error && (
              <Empty>
                {t(
                  "Henüz bir etkinlik yok. Arkadaş ekleyerek birlikte ilerleyebilirsin."
                )}
              </Empty>
            )
          )
        )}
      </section>
      {!remote.loading && remote.data?.length >= limit && limit < 100 && (
        <button
          className="pt-button secondary pt-section-gap"
          onClick={() => setLimit((previous) => previous + 20)}
        >
          {t("Daha fazla göster")}
        </button>
      )}
    </>
  );
}
