import { t } from "../context/Preferences";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import "./ResetPassword.css";
function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({
      type: "",
      text: "",
    });
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Şifreler eşleşmiyor",
      });
      setLoading(false);
      return;
    }
    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Şifre en az 6 karakter olmalıdır",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${config.api_base}/api/reset-password`,
        {
          token,
          newPassword: formData.newPassword,
        }
      );
      if (response.data.statusCode === 200) {
        setMessage({
          type: "success",
          text: "Şifreniz başarıyla değiştirildi! Giriş sayfasına yönlendiriliyorsunuz...",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Bir hata oluştu",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Bir hata oluştu. Lütfen tekrar deneyin.",
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
            <h2>{t("❌ Geçersiz Bağlantı")}</h2>
            <p>{t("Şifre sıfırlama bağlantısı geçersiz.")}</p>
            <button onClick={() => navigate("/login")} className="back-btn">
              {t("Giriş Sayfasına Dön")}
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
          <h2>{t("Yeni Şifre Belirle")}</h2>
          <p>{t("Lütfen yeni şifrenizi girin")}</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{t(message.text)}</div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">{t("Yeni Şifre")}</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder={t("Yeni şifrenizi girin")}
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {t(showPassword ? "👁️" : "👁️‍🗨️")}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t("Şifre Tekrar")}</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t("Şifrenizi tekrar girin")}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {t(loading ? "Değiştiriliyor..." : "Şifreyi Değiştir")}
          </button>
        </form>

        <div className="reset-password-footer">
          <button onClick={() => navigate("/login")} className="back-link">
            {t("← Giriş Sayfasına Dön")}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;
