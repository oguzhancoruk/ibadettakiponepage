import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config.json';
import moment from 'moment';
import 'moment/locale/tr';
import { IoSunnyOutline, IoSunny, IoPartlySunny, IoMoonOutline, IoMoon, IoCheckmark, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';
import { useLoading } from '../../context/LoadingContext';
import logo from '../assets/images/1.png';
import './DailyPrayer.css';

moment.locale('tr');

// Mobil ile TAMAMEN aynı Ionicons kullanıyoruz!
const PRAYERS = [
  { key: 'fajr', name: 'Sabah', icon: IoSunnyOutline, color: '#FF6B6B' },      // sunny-outline
  { key: 'dhuhr', name: 'Öğle', icon: IoSunny, color: '#4ECDC4' },             // sunny
  { key: 'asr', name: 'İkindi', icon: IoPartlySunny, color: '#45B7D1' },       // partly-sunny
  { key: 'maghrib', name: 'Akşam', icon: IoMoonOutline, color: '#F7B731' },    // moon-outline
  { key: 'isha', name: 'Yatsı', icon: IoMoon, color: '#5F27CD' }               // moon
];

function DailyPrayer() {
  const { isLoading, setIsLoading } = useLoading();
  const [prayers, setPrayers] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDailyPrayer();
    fetchStats();
  }, []);

  const fetchDailyPrayer = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `${config.api_base}/api/daily/prayer/stats?period=week`,
        {
          headers: { Authorization: `Bearer ${user._id}` }
        }
      );

      if (response.data.statusCode === 200 && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('İstatistik getirme hatası:', error);
    }
  };

  const togglePrayer = async (prayerKey) => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const newValue = !prayers[prayerKey];
      const today = moment().format('YYYY-MM-DD');

      await axios.post(
        `${config.api_base}/api/daily/prayer`,
        {
          date: today,
          prayerType: prayerKey,
          status: newValue
        },
        {
          headers: { Authorization: `Bearer ${user._id}` }
        }
      );

      setPrayers({ ...prayers, [prayerKey]: newValue });
      fetchStats(); // İstatistikleri güncelle
    } catch (error) {
      console.error('Namaz güncelleme hatası:', error);
      alert('Namaz güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
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
    <div className="daily-prayer-container">
      <div className="daily-prayer-header">
        <div className="header-content">
          <div className="header-icon">
            <IoCalendarOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>Günlük Namaz Takibi</h2>
            <div className="header-date">
              <IoTimeOutline size={16} color="white" />
              <span>{moment().format('DD MMMM YYYY, dddd')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="daily-prayer-content">
        {/* Prayer List */}
        <div className="prayer-list">
          {PRAYERS.map((prayer) => {
            const Icon = prayer.icon;
            const isChecked = prayers[prayer.key];

            return (
              <div
                key={prayer.key}
                className={`prayer-card ${isChecked ? 'checked' : ''}`}
                onClick={() => !isLoading && togglePrayer(prayer.key)}
                style={{ borderLeftColor: prayer.color }}
              >
                <div className="prayer-icon" style={{ backgroundColor: prayer.color }}>
                  <Icon size={28} color="white" />
                </div>

                <div className="prayer-info">
                  <h3 className="prayer-name">{prayer.name}</h3>
                </div>

                <div className={`prayer-checkbox ${isChecked ? 'checked' : ''}`}>
                  {isChecked && <IoCheckmark size={20} color="white" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Stats */}
        {stats && (
          <div className="weekly-stats-card">
            <h3 className="stats-title">Bu Hafta İstatistikleri</h3>

            <div className="stats-summary">
              <div className="stat-item">
                <div className="stat-number">{stats.prayed || 0}</div>
                <div className="stat-label">Kılınan</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">{stats.totalPossible || 0}</div>
                <div className="stat-label">Toplam</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">%{stats.percentage || 0}</div>
                <div className="stat-label">Oran</div>
              </div>
            </div>

            {stats.byPrayer && (
              <div className="prayer-stats">
                {PRAYERS.map((prayer) => {
                  const prayerStat = stats.byPrayer[prayer.key];
                  if (!prayerStat) return null;

                  const StatIcon = prayer.icon;
                  return (
                    <div key={prayer.key} className="prayer-stat-row">
                      <div className="prayer-stat-icon" style={{ backgroundColor: prayer.color }}>
                        <StatIcon size={16} color="white" />
                      </div>
                      <div className="prayer-stat-info">
                        <span className="prayer-stat-name">{prayer.name}</span>
                        <div className="prayer-stat-bar">
                          <div
                            className="prayer-stat-fill"
                            style={{
                              width: `${(prayerStat.completed / prayerStat.total) * 100}%`,
                              backgroundColor: prayer.color
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="prayer-stat-count">
                        {prayerStat.completed}/{prayerStat.total}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyPrayer;
