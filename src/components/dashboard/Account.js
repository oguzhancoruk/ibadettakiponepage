import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiKey, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { IoPersonCircleOutline } from 'react-icons/io5';
import './Account.css';

function Account() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      // TODO: API call to delete account
      localStorage.removeItem('user');
      navigate('/login');
      alert('Hesabınız silindi!');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="account-container">
      {/* Header */}
      <div className="account-header">
        <div className="header-content">
          <div className="header-icon">
            <IoPersonCircleOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>Hesabım</h2>
            <div className="header-subtitle">
              <span>Profil ve hesap ayarları</span>
            </div>
          </div>
        </div>
      </div>

      <div className="account-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar">
            <FiUser size={60} />
          </div>
          <h2 className="user-name">{user.name || user.username || 'Kullanıcı'}</h2>
          <p className="user-email">{user.email}</p>
        </div>

        {/* Account Info Section */}
        <div className="account-section">
          <h3 className="section-title">Hesap Bilgileri</h3>

          <div className="info-card">
            <div className="info-row">
              <div className="info-icon">
                <FiUser size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">İsim</span>
                <span className="info-value">{user.name || user.username || 'Belirtilmemiş'}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="info-row">
              <div className="info-icon">
                <FiMail size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="info-row">
              <div className="info-icon">
                <FiKey size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Kullanıcı ID</span>
                <span className="info-value user-id">{user._id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="account-section">
          <h3 className="section-title">İşlemler</h3>

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={24} />
            <span>Çıkış Yap</span>
          </button>

          <button className="delete-btn" onClick={handleDeleteAccount}>
            <FiTrash2 size={24} />
            <span>Hesabımı Sil</span>
          </button>
        </div>

        {/* Version Info */}
        <div className="version-info">
          <p>İbadet Takip v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default Account;
