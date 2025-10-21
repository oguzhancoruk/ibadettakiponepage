import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FiCalendar, FiRefreshCw, FiMoon, FiUser, FiLogOut } from 'react-icons/fi';
import logo from '../components/assets/images/1.png';
import Footer from '../components/Footer';
import { LoadingProvider, useLoading } from '../context/LoadingContext';
import './Dashboard.css';

function DashboardContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { isLoading } = useLoading();

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
    return (
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-content">
            <div className="nav-brand">
              <img className="dashboard-logo loading-spin" src={logo} alt="Logo" />
              <h1>İbadet Takip</h1>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <img
              className={`dashboard-logo ${isLoading ? 'loading-spin' : ''}`}
              src={logo}
              alt="Logo"
            />
            <h1>İbadet Takip</h1>
          </div>

          {/* Menu Items in Header */}
          <div className="nav-menu">
            <button
              className={`nav-menu-item ${location.pathname === '/daily' ? 'active' : ''}`}
              onClick={() => navigate('/daily')}
            >
              <FiCalendar size={18} />
              <span>Günlük Namaz</span>
            </button>
            <button
              className={`nav-menu-item ${location.pathname.startsWith('/kaza') ? 'active' : ''}`}
              onClick={() => navigate('/kaza')}
            >
              <FiRefreshCw size={18} />
              <span>Kaza Borcu</span>
            </button>
            <button
              className={`nav-menu-item ${location.pathname === '/fasting' ? 'active' : ''}`}
              onClick={() => navigate('/fasting')}
            >
              <FiMoon size={18} />
              <span>Oruç Takibi</span>
            </button>
            <button
              className={`nav-menu-item ${location.pathname === '/account' ? 'active' : ''}`}
              onClick={() => navigate('/account')}
            >
              <FiUser size={18} />
              <span>Hesabım</span>
            </button>
          </div>

          <div className="nav-user">
            <span className="user-name">{user.username || user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut size={18} />
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Content Area */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

function Dashboard() {
  return (
    <LoadingProvider>
      <DashboardContent />
    </LoadingProvider>
  );
}

export default Dashboard;
