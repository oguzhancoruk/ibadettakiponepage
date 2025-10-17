import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config.json';
import moment from 'moment';
import 'moment/locale/tr';
import { FiSunrise, FiSun, FiSunset, FiMoon, FiCheck } from 'react-icons/fi';
import './DailyPrayer.css';

moment.locale('tr');

const PRAYERS = [
  { key: 'fajr', name: 'Sabah', icon: FiSunrise, color: '#FF6B6B' },
  { key: 'dhuhr', name: 'Öğle', icon: FiSun, color: '#4ECDC4' },
  { key: 'asr', name: 'İkindi', icon: FiSun, color: '#45B7D1' },
  { key: 'maghrib', name: 'Akşam', icon: FiSunset, color: '#F7B731' },
  { key: 'isha', name: 'Yatsı', icon: FiMoon, color: '#5F27CD' }
];

function DailyPrayer() {
  const [prayers, setPrayers] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDailyPrayer();
  }, []);

  const fetchDailyPrayer = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const today = moment().format('YYYY-MM-DD');
      const response = await axios.get(
        `${config.api_base}/api/daily/prayer?date=${today}`,
        {
          headers: { Authorization: `Bearer ${user._id}` }
        }
      );

      if (response.data.statusCode === 200 && response.data.data) {
        setPrayers({
          fajr: response.data.data.fajr || false,
          dhuhr: response.data.data.dhuhr || false,
          asr: response.data.data.asr || false,
          maghrib: response.data.data.maghrib || false,
          isha: response.data.data.isha || false
        });
      } else {
        // Kayıt yoksa tümü false
        setPrayers({
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false
        });
      }
    } catch (error) {
      console.error('Günlük namaz getirme hatası:', error);
    }
  };

  const togglePrayer = async (prayerKey) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const newValue = !prayers[prayerKey];
      const today = moment().format('YYYY-MM-DD');

      await axios.post(
        `${config.api_base}/api/daily/prayer`,
        {
          date: today,
          [prayerKey]: newValue
        },
        {
          headers: { Authorization: `Bearer ${user._id}` }
        }
      );

      setPrayers({ ...prayers, [prayerKey]: newValue });
    } catch (error) {
      console.error('Namaz güncelleme hatası:', error);
      alert('Namaz güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="daily-prayer-container">
      <div className="daily-prayer-header">
        <h2>Günlük Namaz Takibi</h2>
        <p className="subtitle">Bugünün namazlarınızı işaretleyin</p>
        <div className="date-info">
          <div className="date-text">{moment().format('DD MMMM YYYY')}</div>
          <div className="day-text">{moment().format('dddd')}</div>
        </div>
      </div>

      {/* Prayer List */}
      <div className="prayer-list">
        {PRAYERS.map((prayer) => {
          const Icon = prayer.icon;
          const isChecked = prayers[prayer.key];

          return (
            <div
              key={prayer.key}
              className={`prayer-card ${isChecked ? 'checked' : ''}`}
              onClick={() => !loading && togglePrayer(prayer.key)}
              style={{ borderLeftColor: prayer.color }}
            >
              <div className="prayer-icon" style={{ backgroundColor: prayer.color }}>
                <Icon size={28} color="white" />
              </div>

              <div className="prayer-info">
                <h3 className="prayer-name">{prayer.name}</h3>
              </div>

              <div className={`prayer-checkbox ${isChecked ? 'checked' : ''}`}>
                {isChecked && <FiCheck size={20} color="white" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyPrayer;
