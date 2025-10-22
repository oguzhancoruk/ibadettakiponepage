import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>İbadet Takip</h3>
            <p>
              Namaz, oruç ve kaza borçlarınızı takip edin.
              İbadetlerinizi düzenli bir şekilde yerine getirmenize yardımcı oluyoruz.
            </p>
          </div>

          <div className="footer-section">
            <h4>Hızlı Linkler</h4>
            <ul className="footer-links">
              <li><Link to="/daily">Günlük Namaz</Link></li>
              <li><Link to="/kaza">Kaza Borcu</Link></li>
              <li><Link to="/fasting">Oruç Takibi</Link></li>
              <li><Link to="/account">Hesabım</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Bilgi</h4>
            <ul className="footer-links">
              <li><Link to="/contact">İletişim</Link></li>
              <li><Link to="/privacy">Gizlilik Politikası</Link></li>
              <li><Link to="/terms">Kullanım Şartları</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>İletişim</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">E-posta:</span>
                <a href="mailto:info@prayertrack.app">info@prayertrack.app</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} İbadet Takip. Tüm hakları saklıdır.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Gizlilik Politikası</Link>
              <Link to="/terms">Kullanım Şartları</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
