import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/images/1.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="landing-header">
      <div className="landing-header-content">
        <div className="landing-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img className="landing-logo" src={logo} alt="Logo" />
          <h1>İbadet Takip</h1>
        </div>

        <nav className="landing-nav">
          <Link to="/" className="nav-link">Ana Sayfa</Link>
          <Link to="/features" className="nav-link">Özellikler</Link>
          <Link to="/contact" className="nav-link">İletişim</Link>
          <Link to="/privacy" className="nav-link">Gizlilik</Link>
        </nav>

        <div className="landing-auth-buttons">
          <button className="header-btn-login" onClick={() => navigate('/login')}>
            Giriş Yap
          </button>
          <button className="header-btn-register" onClick={() => navigate('/register')}>
            Kayıt Ol
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
