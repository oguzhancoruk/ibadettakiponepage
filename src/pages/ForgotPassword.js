import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config.json';
import './ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${config.api_base}/api/forgot-password`, { email });

      if (response.data.statusCode === 200) {
        setMessage({
          type: 'success',
          text: 'Şifre sıfırlama bağlantısı email adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.'
        });
        setTimeout(() => navigate('/login'), 3000);
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

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2>Şifremi Unuttum</h2>
          <p>Email adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Adresi</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email adresinizi girin"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <button onClick={() => navigate('/login')} className="back-link">
            ← Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
