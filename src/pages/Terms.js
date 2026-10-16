import { t } from "../context/Preferences";
import { IoDocumentTextOutline } from "react-icons/io5";
import "./Policy.css";
function Terms() {
  return (
    <div className="policy-page">
      <div className="policy-header">
        <div className="header-content">
          <div className="header-icon">
            <IoDocumentTextOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>{t("Kullanım Şartları")}</h2>
            <div className="header-subtitle">
              <span>{t("Uygulama kullanım koşulları")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-content">
        <div className="policy-card">
          <section className="policy-section">
            <h3>{t("1. Hizmetin Kabülü")}</h3>
            <p>
              {t(
                "İbadet Takip uygulamasını kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız uygulamayı kullanmamalısınız."
              )}
            </p>
          </section>

          <section className="policy-section">
            <h3>{t("2. Hesap Oluşturma")}</h3>
            <p>
              {t(
                "Uygulama özelliklerini kullanmak için bir hesap oluşturmanız gerekmektedir:"
              )}
            </p>
            <ul>
              <li>{t("Doğru ve güncel bilgiler sağlamalısınız")}</li>
              <li>{t("Hesap güvenliğinden siz sorumlusunuz")}</li>
              <li>{t("Şifrenizi kimseyle paylaşmamalısınız")}</li>
              <li>
                {t(
                  "Hesabınızda gerçekleşen tüm faaliyetlerden siz sorumlusunuz"
                )}
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("3. Kullanım Kuralları")}</h3>
            <p>
              {t("Uygulamayı kullanırken aşağıdaki kurallara uymalısınız:")}
            </p>
            <ul>
              <li>
                {t(
                  "Uygulamayı yalnızca kişisel ibadet takibi için kullanmalısınız"
                )}
              </li>
              <li>
                {t("Sisteme zarar verecek faaliyetlerde bulunmamalısınız")}
              </li>
              <li>
                {t("Başkalarının hesaplarına yetkisiz erişim sağlamamalısınız")}
              </li>
              <li>{t("Uygulamayı yasadışı amaçlarla kullanmamalısınız")}</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("4. Hizmet Kesintileri")}</h3>
            <p>
              {t(
                "İbadet Takip aşağıdaki durumlarda hizmet kesintisi yaşayabilir:"
              )}
            </p>
            <ul>
              <li>{t("Planlı bakım çalışmaları")}</li>
              <li>{t("Teknik arızalar")}</li>
              <li>{t("Güvenlik güncellemeleri")}</li>
              <li>{t("Sunucu bakımları")}</li>
            </ul>
            <p>{t("Bu tür kesintilerden dolayı sorumluluk kabul edilmez.")}</p>
          </section>

          <section className="policy-section">
            <h3>{t("5. İçerik Sorumluluğu")}</h3>
            <p>
              {t(
                "Uygulamaya girdiğiniz tüm veriler (namaz, oruç kayıtları vb.) sizin sorumluluğunuzdadır. Yanlış veya eksik veri girişinden İbadet Takip sorumlu tutulamaz."
              )}
            </p>
          </section>

          <section className="policy-section">
            <h3>{t("6. Fikri Mülkiyet")}</h3>
            <p>{t("İbadet Takip uygulamasının tüm hakları saklıdır:")}</p>
            <ul>
              <li>{t("Uygulama tasarımı ve kod yapısı")}</li>
              <li>{t("Logo ve görseller")}</li>
              <li>{t("İçerik ve metinler")}</li>
              <li>{t("Algoritma ve özellikler")}</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("7. Hesap Sonlandırma")}</h3>
            <p>{t("Aşağıdaki durumlarda hesabınız sonlandırılabilir:")}</p>
            <ul>
              <li>{t("Kullanım şartlarının ihlali")}</li>
              <li>{t("Sisteme zarar verici faaliyetler")}</li>
              <li>{t("Sahte veya yanıltıcı bilgi sağlanması")}</li>
              <li>{t("Uzun süre (6 ay+) hesap kullanılmaması")}</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("8. Sorumluluk Reddi")}</h3>
            <p>
              {t(
                'İbadet Takip uygulaması "olduğu gibi" sunulmaktadır. Uygulama kullanımından doğabilecek doğrudan veya dolaylı zararlardan sorumluluk kabul edilmez.'
              )}
            </p>
          </section>

          <section className="policy-section">
            <h3>{t("9. Değişiklikler")}</h3>
            <p>
              {t(
                "Bu kullanım şartları zaman zaman güncellenebilir. Önemli değişiklikler olduğunda kullanıcılar bilgilendirilecektir. Güncellemelerden sonra uygulamayı kullanmaya devam etmek, yeni şartları kabul ettiğiniz anlamına gelir."
              )}
            </p>
          </section>

          <section className="policy-section">
            <h3>{t("10. İletişim")}</h3>
            <p>{t("Kullanım şartları hakkında sorularınız için:")}</p>
            <p className="contact-email">
              <strong>{t("E-posta:")}</strong>{" "}
              <a href="mailto:info@prayertrack.app">
                {t("info@prayertrack.app")}
              </a>
            </p>
          </section>

          <div className="policy-footer">
            <p>
              {t("Son Güncelleme: ")}
              {new Date().toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Terms;
