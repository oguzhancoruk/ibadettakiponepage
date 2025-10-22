import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config.json';
import { FiMail, FiLock, FiEye, FiEyeOff, FiMoon } from 'react-icons/fi';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${config.api_base}/api/login`, {
        email,
        password
      });

      if (response.data.statusCode === 200) {
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('user', JSON.stringify(response.data.data));
        // Ana sayfaya yönlendir
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Giriş başarısız');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-circle">
            <FiMoon size={50} color="#40A2E3" />
          </div>
          <h1 className="app-title">İbadet Takip</h1>
          <p className="app-subtitle">Hesabınıza giriş yapın</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="form-title">Giriş Yap</h2>
          <p className="form-subtitle">Hoş geldiniz</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="input-group">
            <div className="input-icon">
              <FiMail size={20} color="#6F7787" />
            </div>
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <div className="input-icon">
              <FiLock size={20} color="#6F7787" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff size={20} color="#6F7787" />
              ) : (
                <FiEye size={20} color="#6F7787" />
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password-link">
            <span onClick={() => navigate('/forgot-password')} className="link-text">
              Şifremi Unuttum
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>

          {/* Register Link */}
          <div className="register-link">
            Hesabınız yok mu?{' '}
            <span onClick={() => navigate('/register')} className="link-text">
              Kayıt Ol
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
