import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config.json';
import moment from 'moment';
import 'moment/locale/tr';
import { FiArrowLeft, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import './KazaDebt.css';

moment.locale('tr');

const PRAYERS = [
  { key: 'fajr', name: 'Sabah', color: '#FF6B6B' },
  { key: 'dhuhr', name: 'Öğle', color: '#4ECDC4' },
  { key: 'asr', name: 'İkindi', color: '#45B7D1' },
  { key: 'maghrib', name: 'Akşam', color: '#F7B731' },
  { key: 'isha', name: 'Yatsı', color: '#5F27CD' }
];

function KazaDebt() {
  const navigate = useNavigate();
  const { debtId } = useParams();
  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [rakatInput, setRakatInput] = useState('');

  useEffect(() => {
    fetchDebt();
  }, [debtId]);

  const fetchDebt = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${config.api_base}/api/kaza/${debtId}`, {
        headers: { Authorization: `Bearer ${user._id}` }
      });

      if (response.data.statusCode === 200) {
        setDebt(response.data.data);
      }
    } catch (error) {
      console.error('Kaza detay yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrayed = async () => {
    const rakats = parseInt(rakatInput);
    if (!rakats || rakats <= 0) {
      alert('Lütfen geçerli bir rekat sayısı girin');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(
        `${config.api_base}/api/kaza/${debtId}/prayed`,
        {
          prayerType: selectedPrayer.key,
          rakats: rakats
        },
        {
          headers: { Authorization: `Bearer ${user._id}` }
        }
      );

      setModalVisible(false);
      setSelectedPrayer(null);
      setRakatInput('');
      fetchDebt();
    } catch (error) {
      console.error('Kaza işaretleme hatası:', error);
      alert('Kaza namazı işaretlenirken bir hata oluştu');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!debt) {
    return <div className="loading">Kaza borcu bulunamadı</div>;
  }

  const totalDebtRakats = debt.totalDebtRakats || 0;
  const totalPrayedRakats = debt.totalPrayedRakats || 0;
  const totalRequiredRakats = debt.totalRequiredRakats || 0;
  const daysSinceStart = debt.daysSinceStart || 0;

  return (
    <div className="kaza-debt-container">
      {/* Header */}
      <div className="kaza-debt-header">
        <button className="back-btn" onClick={() => navigate('/kaza')}>
          <FiArrowLeft size={24} />
        </button>
        <h2>{debt.name}</h2>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-date">
          <FiCalendar size={16} />
          <span>Başlangıç: {moment(debt.startDate).format('DD MMMM YYYY')}</span>
        </div>
        <div className="summary-days">
          <FiClock size={16} />
          <span>{daysSinceStart} gün önce</span>
        </div>

        <div className="summary-stats">
          <div className="summary-stat">
            <span className="summary-stat-value">{formatNumber(totalRequiredRakats)}</span>
            <span className="summary-stat-label">Olması Gereken</span>
          </div>
          <div className="summary-stat-divider" />
          <div className="summary-stat">
            <span className="summary-stat-value success">{formatNumber(totalPrayedRakats)}</span>
            <span className="summary-stat-label">Kılınan</span>
          </div>
          <div className="summary-stat-divider" />
          <div className="summary-stat">
            <span className="summary-stat-value danger">{formatNumber(totalDebtRakats)}</span>
            <span className="summary-stat-label">Kalan Borç</span>
          </div>
        </div>
      </div>

      {/* Prayer Cards */}
      <div className="prayers-container">
        {PRAYERS.map((prayer) => {
          const totalRequired = debt[`${prayer.key}TotalRequired`] || 0;
          const dailyPrayed = debt[`${prayer.key}DailyPrayed`] || 0;
          const kazaPrayed = debt[`${prayer.key}KazaPrayed`] || 0;
          const remaining = debt[`${prayer.key}RemainingDebt`] || 0;
          const percentage = (debt[`${prayer.key}Percent`] || 0);

          return (
            <div key={prayer.key} className="prayer-detail-card">
              <div className="prayer-detail-header">
                <div className="prayer-icon" style={{ backgroundColor: prayer.color }}>
                  {prayer.name.charAt(0)}
                </div>
                <div className="prayer-detail-info">
                  <h3>{prayer.name}</h3>
                  <p className="remaining-text">{formatNumber(remaining)} rekat kalan</p>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: prayer.color
                    }}
                  />
                </div>
                <span className="progress-percentage">%{percentage}</span>
              </div>

              <div className="prayer-stats">
                <div className="prayer-stat">
                  <span className="prayer-stat-label">Kalan Borç</span>
                  <span className="prayer-stat-value danger">{formatNumber(remaining)}</span>
                </div>
                <div className="prayer-stat">
                  <span className="prayer-stat-label">Günlük Kılınan</span>
                  <span className="prayer-stat-value primary">{formatNumber(dailyPrayed)}</span>
                </div>
                <div className="prayer-stat">
                  <span className="prayer-stat-label">Kaza Kılınan</span>
                  <span className="prayer-stat-value success">{formatNumber(kazaPrayed)}</span>
                </div>
              </div>

              <button
                className="prayed-btn"
                style={{ backgroundColor: prayer.color }}
                onClick={() => {
                  setSelectedPrayer(prayer);
                  setModalVisible(true);
                }}
              >
                <FiCheckCircle size={20} />
                <span>Kaza Kıldım (Rekat Gir)</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Kaza Kıldım</h3>
            <p className="modal-description">
              {selectedPrayer?.name} namazı için kaç rekat kıldınız?
            </p>
            <input
              type="number"
              className="modal-input"
              placeholder="Rekat sayısı (örn: 10)"
              value={rakatInput}
              onChange={(e) => setRakatInput(e.target.value)}
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setModalVisible(false);
                  setSelectedPrayer(null);
                  setRakatInput('');
                }}
              >
                İptal
              </button>
              <button
                className="modal-btn confirm-btn"
                onClick={handlePrayed}
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KazaDebt;
