import { t } from "../context/Preferences";
import { IoMailOutline } from "react-icons/io5";
import "./Contact.css";
function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="header-content">
          <div className="header-icon">
            <IoMailOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>{t("İletişim")}</h2>
            <div className="header-subtitle">
              <span>{t("Bizimle iletişime geçin")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-card">
          <h3>{t("Bize Ulaşın")}</h3>
          <p>
            {t(
              "İbadet Takip uygulaması hakkında sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz."
            )}
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">
                <IoMailOutline size={28} color="#40A2E3" />
              </div>
              <div className="method-info">
                <h4>{t("E-posta")}</h4>
                <a href="mailto:info@prayertrack.app">
                  {t("info@prayertrack.app")}
                </a>
                <p>{t("7/24 e-posta ile ulaşabilirsiniz.")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-info-card">
          <h3>{t("Sıkça Sorulan Sorular")}</h3>
          <div className="faq-list">
            <div className="faq-item">
              <h4>{t("Verilerim güvende mi?")}</h4>
              <p>
                {t(
                  "Evet, tüm verileriniz güvenli sunucularda saklanmaktadır ve sadece sizin erişiminize açıktır."
                )}
              </p>
            </div>

            <div className="faq-item">
              <h4>{t("Uygulamayı offline kullanabilir miyim?")}</h4>
              <p>
                {t(
                  "Daha önce açtığın arayüze çevrimdışı ulaşabilirsin. İbadet kayıtlarını görüntülemek ve kaydetmek için internet bağlantısı gerekir."
                )}
              </p>
            </div>

            <div className="faq-item">
              <h4>{t("Hesabımı nasıl silebilirim?")}</h4>
              <p>
                {t(
                  'Hesabım sayfasından "Hesabımı Sil" butonuna tıklayarak hesabınızı kalıcı olarak silebilirsiniz.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contact;
