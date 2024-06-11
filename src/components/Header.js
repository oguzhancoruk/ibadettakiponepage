import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">Ibadet Takip</div>
      <nav>
        <ul>
          <li><Link to="/">Ana Sayfa</Link></li>
          <li><Link to="/features">Özellikler</Link></li>
          <li><Link to="/contact">İletişim</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
