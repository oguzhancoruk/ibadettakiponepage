import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/images/1.png';
import logo1 from './assets/images/image.png';


function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo" />
        <img className="logo1" src={logo1} alt="Logo" />
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Ana Sayfa</Link></li>
          <li><Link to="/features">Özellikler</Link></li>
          <li><Link to="/contact">İletişim</Link></li>
          <li><Link to="/privacy-policy">Gizlilik Politikası</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
