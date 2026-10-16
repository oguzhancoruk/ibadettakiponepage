import { t } from "../context/Preferences";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import { FiMail, FiLock, FiEye, FiEyeOff, FiMoon } from "react-icons/fi";
import "./Login.css";
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${config.api_base}/api/login`, {
        email,
        password,
      });
      if (response.data.statusCode === 200) {
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem("user", JSON.stringify(response.data.data));
        // Ana sayfaya yönlendir
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Giriş başarısız");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Giriş yapılırken bir hata oluştu");
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
            <FiMoon size={50} color="#0D7548" />
          </div>
          <h1 className="app-title">{t("İbadet Takip")}</h1>
          <p className="app-subtitle">{t("Hesabınıza giriş yapın")}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="form-title">{t("Giriş Yap")}</h2>
          <p className="form-subtitle">{t("Hoş geldiniz")}</p>

          {location.state?.accountDeleted && (
            <p className="pt-success" role="status">
              {t("Hesabın ve kişisel kayıtların silindi.")}
            </p>
          )}
          {error && <div className="error-message">{t(error)}</div>}

          {/* Email Input */}
          <div className="input-group">
            <div className="input-icon">
              <FiMail size={20} color="#6F7787" />
            </div>
            <input
              type="email"
              placeholder={t("E-posta")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              aria-label={t("E-posta")}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <div className="input-icon">
              <FiLock size={20} color="#6F7787" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("Şifre")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              aria-label={t("Şifre")}
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {t(
                showPassword ? (
                  <FiEyeOff size={20} color="#6F7787" />
                ) : (
                  <FiEye size={20} color="#6F7787" />
                )
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password-link">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="link-text"
            >
              {t("Şifremi Unuttum")}
            </button>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {t(loading ? "Giriş Yapılıyor..." : "Giriş Yap")}
          </button>

          {/* Register Link */}
          <div className="register-link">
            {t("Hesabınız yok mu?")}
            {t(" ")}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="link-text"
            >
              {t("Kayıt Ol")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
