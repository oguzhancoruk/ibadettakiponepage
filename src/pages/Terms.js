import { IoDocumentTextOutline } from 'react-icons/io5';
import './Policy.css';

function Terms() {
  return (
    <div className="policy-page">
      <div className="policy-header">
        <div className="header-content">
          <div className="header-icon">
            <IoDocumentTextOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>Kullanım Şartları</h2>
            <div className="header-subtitle">
              <span>Uygulama kullanım koşulları</span>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-content">
        <div className="policy-card">
          <section className="policy-section">
            <h3>1. Hizmetin Kabülü</h3>
            <p>
              İbadet Takip uygulamasını kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız.
              Şartları kabul etmiyorsanız uygulamayı kullanmamalısınız.
            </p>
          </section>

          <section className="policy-section">
            <h3>2. Hesap Oluşturma</h3>
            <p>
              Uygulama özelliklerini kullanmak için bir hesap oluşturmanız gerekmektedir:
            </p>
            <ul>
              <li>Doğru ve güncel bilgiler sağlamalısınız</li>
              <li>Hesap güvenliğinden siz sorumlusunuz</li>
              <li>Şifrenizi kimseyle paylaşmamalısınız</li>
              <li>Hesabınızda gerçekleşen tüm faaliyetlerden siz sorumlusunuz</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>3. Kullanım Kuralları</h3>
            <p>
              Uygulamayı kullanırken aşağıdaki kurallara uymalısınız:
            </p>
            <ul>
              <li>Uygulamayı yalnızca kişisel ibadet takibi için kullanmalısınız</li>
              <li>Sisteme zarar verecek faaliyetlerde bulunmamalısınız</li>
              <li>Başkalarının hesaplarına yetkisiz erişim sağlamamalısınız</li>
              <li>Uygulamayı yasadışı amaçlarla kullanmamalısınız</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>4. Hizmet Kesintileri</h3>
            <p>
              İbadet Takip aşağıdaki durumlarda hizmet kesintisi yaşayabilir:
            </p>
            <ul>
              <li>Planlı bakım çalışmaları</li>
              <li>Teknik arızalar</li>
              <li>Güvenlik güncellemeleri</li>
              <li>Sunucu bakımları</li>
            </ul>
            <p>
              Bu tür kesintilerden dolayı sorumluluk kabul edilmez.
            </p>
          </section>

          <section className="policy-section">
            <h3>5. İçerik Sorumluluğu</h3>
            <p>
              Uygulamaya girdiğiniz tüm veriler (namaz, oruç kayıtları vb.) sizin sorumluluğunuzdadır.
              Yanlış veya eksik veri girişinden İbadet Takip sorumlu tutulamaz.
            </p>
          </section>

          <section className="policy-section">
            <h3>6. Fikri Mülkiyet</h3>
            <p>
              İbadet Takip uygulamasının tüm hakları saklıdır:
            </p>
            <ul>
              <li>Uygulama tasarımı ve kod yapısı</li>
              <li>Logo ve görseller</li>
              <li>İçerik ve metinler</li>
              <li>Algoritma ve özellikler</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>7. Hesap Sonlandırma</h3>
            <p>
              Aşağıdaki durumlarda hesabınız sonlandırılabilir:
            </p>
            <ul>
              <li>Kullanım şartlarının ihlali</li>
              <li>Sisteme zarar verici faaliyetler</li>
              <li>Sahte veya yanıltıcı bilgi sağlanması</li>
              <li>Uzun süre (6 ay+) hesap kullanılmaması</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>8. Sorumluluk Reddi</h3>
            <p>
              İbadet Takip uygulaması "olduğu gibi" sunulmaktadır.
              Uygulama kullanımından doğabilecek doğrudan veya dolaylı zararlardan
              sorumluluk kabul edilmez.
            </p>
          </section>

          <section className="policy-section">
            <h3>9. Değişiklikler</h3>
            <p>
              Bu kullanım şartları zaman zaman güncellenebilir.
              Önemli değişiklikler olduğunda kullanıcılar bilgilendirilecektir.
              Güncellemelerden sonra uygulamayı kullanmaya devam etmek,
              yeni şartları kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section className="policy-section">
            <h3>10. İletişim</h3>
            <p>
              Kullanım şartları hakkında sorularınız için:
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

export default Terms;
