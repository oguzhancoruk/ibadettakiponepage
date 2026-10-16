import { t } from "../context/Preferences";
import { Link } from "react-router-dom";
import { useRemote } from "../hooks/useRemote";
import { getSession } from "../utils/session";
import { PageHeading, Feedback } from "../components/community/Shared";
import "./Extended.css";
export default function Subscription() {
  const remote = useRemote("/subscription/info", {
    params: {
      userId: getSession()._id,
    },
  });
  const data = remote.data;
  return (
    <>
      <PageHeading
        eyebrow={t("HESABIN VE SATIN ALMALARIN")}
        title={t("Satın alma durumum")}
        description={t(
          "Mobil uygulamadaki satın almanı ve hesap durumunu görüntüle."
        )}
      />
      <Feedback error={remote.error} retry={remote.refresh} />
      {t(
        remote.loading ? (
          <p role="status">{t("Satın alma bilgileri yükleniyor…")}</p>
        ) : (
          data && (
            <section className="pt-panel">
              <h2>
                {t(
                  data.isPremium ? "Reklamsız kullanım etkin" : "Ücretsiz hesap"
                )}
              </h2>
              <p className="pt-note">
                {t(
                  "Tüm ibadet takip özellikleri ücretsizdir. Reklamsız kullanım satın alımını mobil uygulamadan yapabilir veya geri yükleyebilirsin."
                )}
              </p>
              {data.subscriptionPlan === "lifetime" && (
                <p className="pt-note">
                  {t("Tek seferlik satın alma · Otomatik yenileme yok.")}
                </p>
              )}
              {data.subscriptionEndDate && (
                <p className="pt-note">
                  {new Date(data.subscriptionEndDate).toLocaleDateString()}
                </p>
              )}
              <div className="pt-actions">
                <a
                  className="pt-button secondary"
                  href="https://apps.apple.com/account/subscriptions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Apple satın almalarını yönet")}
                </a>
                <a
                  className="pt-button secondary"
                  href="https://play.google.com/store/account/subscriptions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Google Play satın almalarını yönet")}
                </a>
                <Link className="pt-button" to="/support">
                  {t("Satın alma desteği")}
                </Link>
              </div>
              <p className="pt-note">
                {t(
                  "Yenilenen bir aboneliğin varsa iptal işlemini satın aldığın mağazadan yapmalısın. Hesabı silmek mağaza aboneliğini iptal etmez."
                )}
              </p>
            </section>
          )
        )
      )}
    </>
  );
}
