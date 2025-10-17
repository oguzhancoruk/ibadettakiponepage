import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FiCalendar, FiRefreshCw, FiMoon, FiUser, FiLogOut } from 'react-icons/fi';
import logo from '../components/assets/images/1.png';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kullanıcı bilgilerini localStorage'dan al
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <img className="dashboard-logo" src={logo} alt="Logo" />
            <h1>İbadet Takip</h1>
          </div>
          <div className="nav-user">
            <span className="user-name">{user.username || user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut size={20} />
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${location.pathname === '/daily' ? 'active' : ''}`}
              onClick={() => navigate('/daily')}
            >
              <FiCalendar size={20} />
              <span>Günlük Namaz</span>
            </button>
            <button
              className={`menu-item ${location.pathname === '/kaza' ? 'active' : ''}`}
              onClick={() => navigate('/kaza')}
            >
              <FiRefreshCw size={20} />
              <span>Kaza Borcu</span>
            </button>
            <button
              className={`menu-item ${location.pathname === '/fasting' ? 'active' : ''}`}
              onClick={() => navigate('/fasting')}
            >
              <FiMoon size={20} />
              <span>Oruç Takibi</span>
            </button>
            <button
              className={`menu-item ${location.pathname === '/account' ? 'active' : ''}`}
              onClick={() => navigate('/account')}
            >
              <FiUser size={20} />
              <span>Hesabım</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
