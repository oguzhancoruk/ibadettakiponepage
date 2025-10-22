import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config.json';
import './ResetPassword.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Şifreler eşleşmiyor'
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'Şifre en az 6 karakter olmalıdır'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${config.api_base}/api/reset-password`, {
        token,
        newPassword: formData.newPassword
      });

      if (response.data.statusCode === 200) {
        setMessage({
          type: 'success',
          text: 'Şifreniz başarıyla değiştirildi! Giriş sayfasına yönlendiriliyorsunuz...'
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || 'Bir hata oluştu'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-state">
            <h2>❌ Geçersiz Bağlantı</h2>
            <p>Şifre sıfırlama bağlantısı geçersiz.</p>
            <button onClick={() => navigate('/login')} className="back-btn">
              Giriş Sayfasına Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h2>Yeni Şifre Belirle</h2>
          <p>Lütfen yeni şifrenizi girin</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">Yeni Şifre</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Yeni şifrenizi girin"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrar</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Şifrenizi tekrar girin"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
          </button>
        </form>

        <div className="reset-password-footer">
          <button onClick={() => navigate('/login')} className="back-link">
            ← Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
