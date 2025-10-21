import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config.json';
import moment from 'moment';
import 'moment/locale/tr';
import { FiPlus, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import { IoListOutline } from 'react-icons/io5';
import { useLoading } from '../../context/LoadingContext';
import logo from '../assets/images/1.png';
import CreateKazaDebtModal from './CreateKazaDebtModal';
import './KazaDebtList.css';

moment.locale('tr');

function KazaDebtList() {
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();
  const [debts, setDebts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${config.api_base}/api/kaza/list`, {
        headers: { Authorization: `Bearer ${user._id}` }
      });

      if (response.data.statusCode === 200) {
        setDebts(response.data.data);
      }
    } catch (error) {
      console.error('Kaza listesi yükleme hatası:', error);
    } finally {
      setIsLoading(false);
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

  const handleDelete = async (debtId, debtName) => {
    if (!window.confirm(`"${debtName}" adlı kaza borcunu silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`${config.api_base}/api/kaza/${debtId}`, {
        headers: { Authorization: `Bearer ${user._id}` }
      });
      fetchDebts();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Kaza borcu silinirken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="page-loading-container">
        <img src={logo} alt="Loading" className="page-loading-logo" />
      </div>
    );
  }

  return (
    <div className="kaza-debt-list-container">
      <div className="kaza-header">
        <div className="header-content">
          <div className="header-icon">
            <IoListOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>Kaza Borçlarım</h2>
            <div className="header-subtitle">
              <span>{debts.length} adet kaza borcu kaydınız var</span>
            </div>
          </div>
          <button className="add-debt-btn" onClick={() => setModalVisible(true)}>
            <FiPlus size={20} />
            Yeni Kaza Borcu
          </button>
        </div>
      </div>

      {debts.length === 0 ? (
        <div className="empty-state">
          <FiCalendar size={64} color="#9CA3AF" />
          <h3>Henüz Kaza Borcu Yok</h3>
          <p>Yeni bir kaza borcu oluşturarak takibe başlayın</p>
        </div>
      ) : (
        <div className="debts-grid">
          {debts.map((debt) => (
            <div key={debt._id} className="debt-card" onClick={() => navigate(`/kaza/${debt._id}`)}>
              <div className="debt-card-header">
                <h3>{debt.name}</h3>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(debt._id, debt.name);
                  }}
                >
                  <FiTrash2 size={16} color="#DC2626" />
                </button>
              </div>

              <div className="debt-date">
                <FiCalendar size={14} />
                <span>Başlangıç: {moment(debt.startDate).format('DD MMMM YYYY')}</span>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(debt.percentage, 100)}%` }}
                  />
                </div>
                <span className="progress-text">%{debt.percentage}</span>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <span className="stat-label">Gerekli</span>
                  <span className="stat-value">{formatNumber(debt.totalRequiredRakats)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Kılınan</span>
                  <span className="stat-value success">{formatNumber(debt.totalPrayedRakats)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Kalan</span>
                  <span className="stat-value danger">{formatNumber(debt.totalDebtRakats)}</span>
                </div>
              </div>

              <div className="debt-days">
                <FiClock size={14} />
                <span>{debt.daysSinceStart} gün geçti</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateKazaDebtModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={fetchDebts}
      />
    </div>
  );
}

export default KazaDebtList;
