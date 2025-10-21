import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import './Policy.css';

function Privacy() {
  return (
    <div className="policy-page">
      <div className="policy-header">
        <div className="header-content">
          <div className="header-icon">
            <IoShieldCheckmarkOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>Gizlilik Politikası</h2>
            <div className="header-subtitle">
              <span>Gizliliğiniz bizim için önemlidir</span>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-content">
        <div className="policy-card">
          <section className="policy-section">
            <h3>1. Toplanan Bilgiler</h3>
            <p>
              İbadet Takip uygulamasını kullanırken aşağıdaki bilgiler toplanmaktadır:
            </p>
            <ul>
              <li>E-posta adresi ve kullanıcı adı (hesap oluşturma için)</li>
              <li>Namaz, oruç ve kaza borcu takip verileri</li>
              <li>Uygulama kullanım istatistikleri</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>2. Bilgilerin Kullanımı</h3>
            <p>
              Toplanan bilgiler yalnızca aşağıdaki amaçlarla kullanılır:
            </p>
            <ul>
              <li>Kullanıcı hesabı yönetimi</li>
              <li>İbadet takibi ve istatistik hizmetlerinin sağlanması</li>
              <li>Uygulama performansının iyileştirilmesi</li>
              <li>Kullanıcı deneyiminin geliştirilmesi</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>3. Veri Güvenliği</h3>
            <p>
              Kullanıcı verilerinin güvenliği bizim için önceliklidir:
            </p>
            <ul>
              <li>Tüm veriler güvenli sunucularda şifrelenerek saklanır</li>
              <li>Şifreler hashlenerek korunur</li>
              <li>Üçüncü taraflarla veri paylaşımı yapılmaz</li>
              <li>Düzenli güvenlik güncellemeleri yapılır</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>4. Çerezler (Cookies)</h3>
            <p>
              Uygulama deneyiminizi iyileştirmek için çerezler kullanılmaktadır:
            </p>
            <ul>
              <li>Oturum bilgilerinin saklanması</li>
              <li>Kullanıcı tercihlerinin hatırlanması</li>
              <li>Uygulama performansının izlenmesi</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>5. Kullanıcı Hakları</h3>
            <p>
              Kullanıcılarımız aşağıdaki haklara sahiptir:
            </p>
            <ul>
              <li>Kişisel verilerine erişim hakkı</li>
              <li>Verilerin düzeltilmesini isteme hakkı</li>
              <li>Verilerin silinmesini talep etme hakkı</li>
              <li>Hesabı tamamen kapatma hakkı</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>6. Veri Saklama Süresi</h3>
            <p>
              Kullanıcı verileri, hesap aktif olduğu sürece saklanır.
              Hesap silindiğinde tüm veriler kalıcı olarak sistemden kaldırılır.
            </p>
          </section>

          <section className="policy-section">
            <h3>7. Değişiklikler</h3>
            <p>
              Bu gizlilik politikası zaman zaman güncellenebilir.
              Önemli değişiklikler olduğunda kullanıcılar bilgilendirilecektir.
            </p>
          </section>

          <section className="policy-section">
            <h3>8. İletişim</h3>
            <p>
              Gizlilik politikası hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <p className="contact-email">
              <strong>E-posta:</strong> <a href="mailto:oguzcoruk6161@gmail.com">oguzcoruk6161@gmail.com</a>
            </p>
          </section>

          <div className="policy-footer">
            <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
