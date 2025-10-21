import { useNavigate } from 'react-router-dom';
import { IoCalendarOutline, IoRepeatOutline, IoMoonOutline, IoCheckmarkCircleOutline, IoPhonePortraitOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">İbadetlerinizi Takip Edin</h1>
          <p className="hero-subtitle">
            Namaz, oruç ve kaza borçlarınızı düzenli bir şekilde takip edin.
            İbadetlerinizi yerine getirmenize yardımcı oluyoruz.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Ücretsiz Başla
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Giriş Yap
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Özellikler</h2>
          <p>İbadet takibinizi kolaylaştıran güçlü araçlar</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <IoCalendarOutline size={40} color="#40A2E3" />
            </div>
            <h3>Günlük Namaz Takibi</h3>
            <p>
              Beş vakit namazlarınızı günlük olarak işaretleyin ve takip edin.
              Haftalık istatistiklerinizi görüntüleyin.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <IoRepeatOutline size={40} color="#40A2E3" />
            </div>
            <h3>Kaza Borcu Yönetimi</h3>
            <p>
              Kaza namazlarınızı kaydedin ve planlayın. İlerlemenizi takip edin
              ve borçlarınızı sistematik bir şekilde kapatın.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <IoMoonOutline size={40} color="#40A2E3" />
            </div>
            <h3>Oruç Takibi</h3>
            <p>
              Ramazan, kaza ve nafile oruçlarınızı takip edin.
              Takvim üzerinde tuttuğunuz oruçları görüntüleyin.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <IoCheckmarkCircleOutline size={40} color="#40A2E3" />
            </div>
            <h3>Kolay Kullanım</h3>
            <p>
              Sade ve kullanıcı dostu arayüz ile ibadetlerinizi
              hızlıca işaretleyin ve takip edin.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <IoPhonePortraitOutline size={40} color="#40A2E3" />
            </div>
            <h3>Mobil Uyumlu</h3>
            <p>
              Web ve mobil cihazlarınızdan erişim sağlayın.
              Her yerden ibadet takibinizi yapın.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <IoShieldCheckmarkOutline size={40} color="#40A2E3" />
            </div>
            <h3>Güvenli ve Özel</h3>
            <p>
              Verileriniz güvenli sunucularda saklanır.
              Sadece sizin erişiminize açık bilgiler.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Hemen Başlayın</h2>
          <p>Ücretsiz hesap oluşturun ve ibadetlerinizi takip etmeye başlayın</p>
          <button className="btn-cta" onClick={() => navigate('/register')}>
            Ücretsiz Kayıt Ol
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
