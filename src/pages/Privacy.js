import { t } from "../context/Preferences";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import "./Policy.css";
function Privacy() {
  return (
    <div className="policy-page">
      <div className="policy-header">
        <div className="header-content">
          <div className="header-icon">
            <IoShieldCheckmarkOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>{t("Gizlilik Politikası")}</h2>
            <div className="header-subtitle">
              <span>{t("Gizliliğiniz bizim için önemlidir")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-content">
        <div className="policy-card">
          <section className="policy-section">
            <h3>{t("1. Toplanan Bilgiler")}</h3>
            <p>
              {t(
                "İbadet Takip uygulamasını kullanırken aşağıdaki bilgiler toplanmaktadır:"
              )}
            </p>
            <ul>
              <li>
                {t("E-posta adresi ve kullanıcı adı (hesap oluşturma için)")}
              </li>
              <li>{t("Namaz, oruç ve kaza borcu takip verileri")}</li>
              <li>{t("Uygulama kullanım istatistikleri")}</li>
              <li>
                {t("İzin verdiğinizde yaklaşık veya hassas konum bilgisi")}
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("2. Konum Verileri ve Konum Servisleri")}</h3>
            <p>
              {t(
                "İbadet Takip, konum izni verdiğinizde cihazınızın yaklaşık veya hassas konumuna erişir. Konumunuz namaz vakitlerini hesaplamak, kıble yönünü göstermek, yakınınızdaki camileri bulmak ve bulunduğunuz yere ait hava durumunu göstermek için kullanılır."
              )}
            </p>
            <p>
              {t(
                "Bu özellikler için konum koordinatlarınız İbadet Takip sunucusuna iletilir. Yer adını belirlemek için koordinatlar OpenStreetMap'in Nominatim hizmetine gönderilir. Hava durumu istendiğinde koordinatlar, sunucumuz aracılığıyla OpenWeather hizmetine iletilir."
              )}
            </p>
            <p>
              {t(
                "Yakındaki cami bildirimleri etkinleştirildiğinde ve gerekli konum iznini verdiğinizde, uygulama kapalıyken de yakındaki camileri algılayıp bildirim göndermek için konum kullanılabilir. Konum iznini cihazınızın ayarlarından dilediğiniz zaman kapatabilirsiniz; bu durumda konuma bağlı özellikler çalışmayabilir."
              )}
            </p>
          </section>

          <section className="policy-section">
            <h3>{t("3. Bilgilerin Kullanımı")}</h3>
            <p>
              {t("Toplanan bilgiler yalnızca aşağıdaki amaçlarla kullanılır:")}
            </p>
            <ul>
              <li>{t("Kullanıcı hesabı yönetimi")}</li>
              <li>
                {t("İbadet takibi ve istatistik hizmetlerinin sağlanması")}
              </li>
              <li>{t("Uygulama performansının iyileştirilmesi")}</li>
              <li>{t("Kullanıcı deneyiminin geliştirilmesi")}</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("4. Veri Güvenliği")}</h3>
            <p>
              {t("Kullanıcı verilerinin güvenliği bizim için önceliklidir:")}
            </p>
            <ul>
              <li>
                {t("Tüm veriler güvenli sunucularda şifrelenerek saklanır")}
              </li>
              <li>{t("Şifreler hashlenerek korunur")}</li>
              <li>{t("Düzenli güvenlik güncellemeleri yapılır")}</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("5. Çerezler (Cookies)")}</h3>
            <p>
              {t(
                "Uygulama deneyiminizi iyileştirmek için çerezler kullanılmaktadır:"
              )}
            </p>
            <ul>
              <li>{t("Oturum bilgilerinin saklanması")}</li>
              <li>{t("Kullanıcı tercihlerinin hatırlanması")}</li>
              <li>{t("Uygulama performansının izlenmesi")}</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("6. Kullanıcı Hakları")}</h3>
            <p>{t("Kullanıcılarımız aşağıdaki haklara sahiptir:")}</p>
            <ul>
              <li>{t("Kişisel verilerine erişim hakkı")}</li>
              <li>{t("Verilerin düzeltilmesini isteme hakkı")}</li>
              <li>{t("Verilerin silinmesini talep etme hakkı")}</li>
              <li>{t("Hesabı tamamen kapatma hakkı")}</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>{t("7. Veri Saklama Süresi")}</h3>
            <p>
              {t(
                "Kullanıcı verileri, hesap aktif olduğu sürece saklanır. Hesap silindiğinde tüm veriler kalıcı olarak sistemden kaldırılır."
              )}
            </p>
          </section>

          <section className="policy-section">
            <h3>{t("8. Değişiklikler")}</h3>
            <p>
              {t(
                "Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda kullanıcılar bilgilendirilecektir."
              )}
            </p>
          </section>

          <section className="policy-section">
            <h3>{t("9. İletişim")}</h3>
            <p>
              {t(
                "Gizlilik politikası hakkında sorularınız için bizimle iletişime geçebilirsiniz:"
              )}
            </p>
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
export default Privacy;
