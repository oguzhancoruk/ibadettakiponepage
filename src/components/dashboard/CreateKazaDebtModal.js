import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config/config.json';
import moment from 'moment';
import 'moment/locale/tr';
import { FiX, FiInfo, FiTag, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import './CreateKazaDebtModal.css';

moment.locale('tr');

function CreateKazaDebtModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Lütfen bir isim girin');
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        `${config.api_base}/api/kaza/create`,
        {
          name: name.trim(),
          startDate: moment(startDate).toISOString()
        },
        {
          headers: { Authorization: `Bearer ${user._id}` }
        }
      );

      if (response.data.statusCode === 200) {
        alert('Kaza borcu başarıyla oluşturuldu!');
        setName('');
        setStartDate(moment().format('YYYY-MM-DD'));
        onSuccess();
        onClose();
      } else {
        alert(response.data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Kaza borcu oluşturma hatası:', error);
      alert('Kaza borcu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const daysSince = moment().diff(moment(startDate), 'days');

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="create-modal-header">
          <h2>Yeni Kaza Borcu</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <FiInfo size={20} />
          <p>
            Farklı dönemler için ayrı kaza borçları oluşturabilirsiniz. Her borç kendi başlangıç tarihinden itibaren hesaplanır.
          </p>
        </div>

        {/* Form */}
        <div className="create-form">
          {/* Name Input */}
          <div className="form-group">
            <label>Borç İsmi</label>
            <p className="form-description">Bu kaza borcuna tanımlayıcı bir isim verin</p>
            <div className="input-with-icon">
              <FiTag size={18} />
              <input
                type="text"
                placeholder="Örn: 2020-2022 Borçlarım"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="form-group">
            <label>Başlangıç Tarihi</label>
            <p className="form-description">Kaza borcunun başladığı tarihi seçin</p>
            <div className="input-with-icon">
              <FiCalendar size={18} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={moment().format('YYYY-MM-DD')}
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="preview-card">
            <h3>Önizleme</h3>
            <div className="preview-row">
              <span className="preview-label">İsim:</span>
              <span className="preview-value">{name || 'Kaza Borcum'}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Başlangıç:</span>
              <span className="preview-value">{moment(startDate).format('DD MMMM YYYY')}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Geçen Süre:</span>
              <span className="preview-value">{daysSince} gün</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="create-modal-buttons">
          <button
            className="create-submit-btn"
            onClick={handleCreate}
            disabled={loading}
          >
            <FiCheckCircle size={20} />
            <span>{loading ? 'Oluşturuluyor...' : 'Kaza Borcu Oluştur'}</span>
          </button>
          <button className="create-cancel-btn" onClick={onClose}>
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateKazaDebtModal;
