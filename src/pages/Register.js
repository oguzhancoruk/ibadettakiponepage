import { t } from "../context/Preferences";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMoon,
  FiUser,
} from "react-icons/fi";
import "./Login.css";
function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${config.api_base}/api/register`, {
        username,
        email,
        password,
      });
      if (response.data.statusCode === 200) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        navigate("/login");
      } else {
        setError(response.data.message || "Kayıt başarısız");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Kayıt olurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-circle">
            <FiMoon size={50} color="#0D7548" />
          </div>
          <h1 className="app-title">{t("İbadet Takip")}</h1>
          <p className="app-subtitle">{t("Yeni hesap oluşturun")}</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          <h2 className="form-title">{t("Kayıt Ol")}</h2>
          <p className="form-subtitle">{t("Ücretsiz hesap oluşturun")}</p>

          {error && <div className="error-message">{t(error)}</div>}

          <div className="input-group">
            <div className="input-icon">
              <FiUser size={20} color="#6F7787" />
            </div>
            <input
              type="text"
              placeholder={t("Kullanıcı Adı")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
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

          <div className="input-group">
            <div className="input-icon">
              <FiLock size={20} color="#6F7787" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("Şifre Tekrar")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {t(
                showConfirmPassword ? (
                  <FiEyeOff size={20} color="#6F7787" />
                ) : (
                  <FiEye size={20} color="#6F7787" />
                )
              )}
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {t(loading ? "Kayıt Oluşturuluyor..." : "Kayıt Ol")}
          </button>

          <div className="register-link">
            {t("Zaten hesabınız var mı?")}
            {t(" ")}
            <span onClick={() => navigate("/login")} className="link-text">
              {t("Giriş Yap")}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
