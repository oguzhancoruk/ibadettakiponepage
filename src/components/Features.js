import { useNavigate } from 'react-router-dom';
import { IoCalendarOutline, IoRepeatOutline, IoMoonOutline, IoStatsChartOutline, IoNotificationsOutline, IoCloudUploadOutline } from 'react-icons/io5';
import './Features.css';

function Features() {
  const navigate = useNavigate();

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="features-hero-content">
          <h1>Güçlü Özellikler</h1>
          <p>İbadet takibinizi kolaylaştıran tüm araçlar bir arada</p>
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features-section">
        <div className="features-container">
          <div className="feature-detail-card">
            <div className="feature-detail-icon">
              <IoCalendarOutline size={48} color="#40A2E3" />
            </div>
            <div className="feature-detail-content">
              <h3>Günlük Namaz Takibi</h3>
              <p>
                Beş vakit namazlarınızı günlük olarak işaretleyin ve takip edin.
                Kılınan namazları işaretleyerek düzenli ibadet alışkanlığı kazanın.
              </p>
              <ul className="feature-list">
                <li>Beş vakit namaz işaretleme</li>
                <li>Haftalık istatistikler</li>
                <li>Geçmiş kayıtları görüntüleme</li>
                <li>Günlük ve haftalık raporlar</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail-card">
            <div className="feature-detail-icon">
              <IoRepeatOutline size={48} color="#40A2E3" />
            </div>
            <div className="feature-detail-content">
              <h3>Kaza Borcu Yönetimi</h3>
              <p>
                Kaza namazlarınızı sistematik bir şekilde planlayın ve takip edin.
                Borçlarınızı kaydedin ve düzenli olarak kapatın.
              </p>
              <ul className="feature-list">
                <li>Namaz türüne göre borç kaydı</li>
                <li>Günlük kaza planlama</li>
                <li>İlerleme takibi</li>
                <li>Kalan borç hesaplama</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail-card">
            <div className="feature-detail-icon">
              <IoMoonOutline size={48} color="#40A2E3" />
            </div>
            <div className="feature-detail-content">
              <h3>Oruç Takibi</h3>
              <p>
                Ramazan, kaza ve nafile oruçlarınızı takip edin.
                Takvim üzerinde tuttuğunuz oruçları kolayca görüntüleyin.
              </p>
              <ul className="feature-list">
                <li>Ramazan orucu takibi</li>
                <li>Kaza orucu kayıtları</li>
                <li>Nafile oruç işaretleme</li>
                <li>Aylık takvim görünümü</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail-card">
            <div className="feature-detail-icon">
              <IoStatsChartOutline size={48} color="#40A2E3" />
            </div>
            <div className="feature-detail-content">
              <h3>İstatistik ve Raporlar</h3>
              <p>
                İbadet performansınızı detaylı istatistiklerle takip edin.
                Haftalık ve aylık raporlarınızı görüntüleyin.
              </p>
              <ul className="feature-list">
                <li>Haftalık ibadet istatistikleri</li>
                <li>Aylık performans grafikleri</li>
                <li>Kaza borcu durumu</li>
                <li>İlerleme yüzdeleri</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail-card">
            <div className="feature-detail-icon">
              <IoNotificationsOutline size={48} color="#40A2E3" />
            </div>
            <div className="feature-detail-content">
              <h3>Hatırlatıcılar</h3>
              <p>
                Namaz vakitlerini kaçırmayın. Özelleştirilebilir bildirimlerle
                ibadetlerinizi düzenli olarak yerine getirin.
              </p>
              <ul className="feature-list">
                <li>Namaz vakti bildirimleri</li>
                <li>Kaza hatırlatıcıları</li>
                <li>Özel bildirim ayarları</li>
                <li>Esnek zamanlama</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail-card">
            <div className="feature-detail-icon">
              <IoCloudUploadOutline size={48} color="#40A2E3" />
            </div>
            <div className="feature-detail-content">
              <h3>Güvenli Veri Saklama</h3>
              <p>
                Tüm verileriniz güvenli bulut sunucularda saklanır.
                Cihaz değiştirseniz bile verilerinize erişebilirsiniz.
              </p>
              <ul className="feature-list">
                <li>Otomatik yedekleme</li>
                <li>Bulut senkronizasyon</li>
                <li>Güvenli veri şifreleme</li>
                <li>Çoklu cihaz desteği</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="features-cta-content">
          <h2>Hemen Başlayın</h2>
          <p>Tüm özelliklere ücretsiz erişim sağlayın</p>
          <button className="features-cta-btn" onClick={() => navigate('/register')}>
            Ücretsiz Kayıt Ol
          </button>
        </div>
      </section>
    </div>
  );
}

export default Features;
