import { useEffect, useState } from "react";
import { usePreferences, t } from "../context/Preferences";
import { useStoredState } from "../hooks/useStoredState";
import { useInstall } from "../hooks/useInstall";
import { useRemote, useMutation } from "../hooks/useRemote";
import { supportsPush, enablePush, disablePush } from "../services/push";
import { PRAYERS } from "../utils/prayers";
import { getLocation } from "../utils/location";
import { PageHeading, Feedback } from "../components/community/Shared";
import "./Extended.css";
export default function Settings() {
  const { theme, language, setPreferences } = usePreferences();
  const install = useInstall();
  const [notification, setNotification, storageError] = useStoredState(
    "notifications",
    {
      prayers: PRAYERS.map((item) => item.key),
      before: true,
      atTime: true,
    }
  );
  const [enabled, setEnabled] = useState(false);
  const mutation = useMutation();
  const remote = useRemote(supportsPush() ? "/web-push/config" : null, {
    jwt: true,
  });
  useEffect(() => {
    let active = true;
    navigator.serviceWorker
      ?.getRegistration()
      .then((registration) => registration?.pushManager?.getSubscription())
      .then((subscription) => {
        if (active) setEnabled(Boolean(subscription));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return (
    <>
      <PageHeading
        eyebrow={t("SANA GÖRE")}
        title={t("Uygulama ayarları")}
        description={t("Görünümü, dili ve bildirim tercihlerini düzenle.")}
      />
      <div className="pt-extended-grid">
        <section className="pt-panel">
          <h2>{t("Görünüm ve dil")}</h2>
          <div className="pt-form-stack pt-section-gap">
            <label className="pt-field">
              {t("Tema")}
              <select
                value={theme}
                onChange={(e) =>
                  setPreferences({
                    theme: e.target.value,
                  })
                }
              >
                <option value="system">{t("Cihazla aynı")}</option>
                <option value="light">{t("Açık")}</option>
                <option value="dark">{t("Koyu")}</option>
              </select>
            </label>
            <label className="pt-field">
              {t("Dil")}
              <select
                value={language}
                onChange={(e) =>
                  setPreferences({
                    language: e.target.value,
                  })
                }
              >
                <option value="tr">{t("Türkçe")}</option>
                <option value="en">{t("English")}</option>
              </select>
            </label>
          </div>
        </section>
        <section className="pt-panel">
          <h2>{t("Ana ekrana ekle")}</h2>
          <p className="pt-note">
            {t(
              "Siteyi uygulama gibi açabilir, bağlantın kesildiğinde daha önce açtığın arayüze ulaşabilirsin. İbadet kayıtlarını görüntülemek ve kaydetmek için internet gerekir."
            )}
          </p>
          {t(
            install.available ? (
              <button className="pt-button" onClick={install.install}>
                {t("Uygulamayı yükle")}
              </button>
            ) : (
              <p className="pt-note">
                {t(
                  "Tarayıcı menüsünden “Ana ekrana ekle” seçeneğini kullanabilirsin."
                )}
              </p>
            )
          )}
        </section>
      </div>
      <section className="pt-panel pt-section-gap">
        <h2>{t("Namaz bildirimleri")}</h2>
        <p className="pt-note">
          {t(
            "10 dakika önce ve vakit girdiğinde, her namaz için farklı bir hatırlatma al. Bildirimler bu tarayıcıda etkinleşir. iPhone’da önce siteyi ana ekrana ekleyip oradan aç."
          )}
        </p>
        <Feedback
          error={storageError || mutation.error || remote.error}
          message={mutation.message}
          retry={remote.error ? remote.refresh : undefined}
        />
        {t(
          !supportsPush() ? (
            <p className="pt-note">
              {t("Bu tarayıcıda web bildirimleri kullanılamıyor.")}
            </p>
          ) : remote.loading ? (
            <p role="status">{t("Bildirim ayarları yükleniyor…")}</p>
          ) : !remote.data?.available && !remote.error ? (
            <p className="pt-note">
              {t("Sunucuda web bildirimleri henüz etkinleştirilmemiş.")}
            </p>
          ) : null
        )}
        <fieldset
          className="pt-notification-options"
          disabled={Boolean(mutation.busy)}
        >
          <legend>{t("Hatırlatılacak vakitler")}</legend>
          {PRAYERS.map((item) => (
            <label key={item.key}>
              <input
                type="checkbox"
                checked={notification.prayers.includes(item.key)}
                onChange={(e) =>
                  setNotification((previous) => ({
                    ...previous,
                    prayers: e.target.checked
                      ? [...previous.prayers, item.key]
                      : previous.prayers.filter((key) => key !== item.key),
                  }))
                }
              />
              {t(item.name)}
            </label>
          ))}
          <label>
            <input
              type="checkbox"
              checked={notification.before}
              onChange={(e) =>
                setNotification((previous) => ({
                  ...previous,
                  before: e.target.checked,
                }))
              }
            />
            {t("10 dakika önce")}
          </label>
          <label>
            <input
              type="checkbox"
              checked={notification.atTime}
              onChange={(e) =>
                setNotification((previous) => ({
                  ...previous,
                  atTime: e.target.checked,
                }))
              }
            />
            {t("Vakit girdiğinde")}
          </label>
        </fieldset>
        <div className="pt-actions">
          <button
            className="pt-button"
            disabled={
              !remote.data?.available ||
              Boolean(mutation.busy) ||
              !notification.prayers.length ||
              (!notification.before && !notification.atTime)
            }
            onClick={async () => {
              // Request notification permission while the click gesture is still active.
              if (!supportsPush()) return;
              const permission = Notification.requestPermission();
              const result = await mutation.run(
                "enable",
                async () => {
                  if ((await permission) !== "granted")
                    throw new Error("Bildirim izni verilmedi.");
                  const location = await getLocation();
                  await enablePush(
                    remote.data.publicKey,
                    notification,
                    location,
                    language
                  );
                },
                "Bildirim tercihlerin bu tarayıcı için kaydedildi."
              );
              if (result.ok) setEnabled(true);
            }}
          >
            {t(
              enabled
                ? "Tercihleri ve konumu güncelle"
                : "Bildirimleri etkinleştir"
            )}
          </button>
          {enabled && (
            <button
              className="pt-button secondary"
              disabled={Boolean(mutation.busy)}
              onClick={async () => {
                const result = await mutation.run(
                  "disable",
                  disablePush,
                  "Bildirimler kapatıldı."
                );
                if (result.ok) setEnabled(false);
              }}
            >
              {t("Bildirimleri kapat")}
            </button>
          )}
        </div>
      </section>
    </>
  );
}
