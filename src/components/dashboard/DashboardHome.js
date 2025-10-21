import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config.json';
import moment from 'moment';
import 'moment/locale/tr';
import { IoCalendarOutline, IoRepeatOutline, IoMoonOutline, IoStatsChartOutline, IoTrendingUpOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useLoading } from '../../context/LoadingContext';
import logo from '../assets/images/1.png';
import './DashboardHome.css';

moment.locale('tr');

function DashboardHome() {
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    todayPrayers: 0,
    weeklyPrayers: 0,
    totalKaza: 0,
    monthlyFasting: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchStats(userData);
  }, []);

  const fetchStats = async (userData) => {
    try {
      setIsLoading(true);

      // Bugünkü namaz istatistikleri
      const todayDate = moment().format('YYYY-MM-DD');
      const todayResponse = await axios.get(
        `${config.api_base}/api/daily/prayer?date=${todayDate}`,
        { headers: { Authorization: `Bearer ${userData._id}` } }
      );

      let todayCount = 0;
      if (todayResponse.data.statusCode === 200 && todayResponse.data.data) {
        const data = todayResponse.data.data;
        if (data.fajr) todayCount++;
        if (data.dhuhr) todayCount++;
        if (data.asr) todayCount++;
        if (data.maghrib) todayCount++;
        if (data.isha) todayCount++;
      }

      // Haftalık namaz istatistikleri - stats endpoint kullan
      const weekResponse = await axios.get(
        `${config.api_base}/api/daily/prayer/stats?period=week`,
        { headers: { Authorization: `Bearer ${userData._id}` } }
      );

      let weeklyCount = 0;
      if (weekResponse.data.statusCode === 200 && weekResponse.data.data) {
        weeklyCount = weekResponse.data.data.prayed;
      }

      // Kaza borcu sayısı
      const kazaResponse = await axios.get(
        `${config.api_base}/api/kaza/list`,
        { headers: { Authorization: `Bearer ${userData._id}` } }
      );

      let totalKaza = 0;
      if (kazaResponse.data.statusCode === 200 && kazaResponse.data.data) {
        kazaResponse.data.data.forEach(debt => {
          totalKaza += (debt.totalDebtRakats || 0);
        });
      }

      // Aylık oruç sayısı
      const monthStart = moment().startOf('month').format('YYYY-MM-DD');
      const monthEnd = moment().endOf('month').format('YYYY-MM-DD');
      const fastingResponse = await axios.get(
        `${config.api_base}/api/fasting/range?startDate=${monthStart}&endDate=${monthEnd}`,
        { headers: { Authorization: `Bearer ${userData._id}` } }
      );

      let monthlyFasting = 0;
      if (fastingResponse.data.statusCode === 200 && fastingResponse.data.data) {
        monthlyFasting = fastingResponse.data.data.filter(f => f.fasted).length;
      }

      setStats({
        todayPrayers: todayCount,
        weeklyPrayers: weeklyCount,
        totalKaza: totalKaza,
        monthlyFasting: monthlyFasting
      });

    } catch (error) {
      console.error('İstatistik getirme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const todayPercentage = Math.round((stats.todayPrayers / 5) * 100);
  const weeklyPercentage = Math.round((stats.weeklyPrayers / 35) * 100);

  if (isLoading) {
    return (
      <div className="page-loading-container">
        <img src={logo} alt="Loading" className="page-loading-logo" />
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Hoş Geldiniz, {user?.username || user?.email}!</h1>
          <p>{moment().format('DD MMMM YYYY, dddd')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary" onClick={() => navigate('/daily')}>
          <div className="stat-icon">
            <IoCalendarOutline size={32} />
          </div>
          <div className="stat-content">
            <h3>Bugünkü Namazlar</h3>
            <div className="stat-value">{stats.todayPrayers} / 5</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${todayPercentage}%` }}></div>
              </div>
              <span className="progress-text">%{todayPercentage}</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-success" onClick={() => navigate('/daily')}>
          <div className="stat-icon">
            <IoStatsChartOutline size={32} />
          </div>
          <div className="stat-content">
            <h3>Haftalık Namazlar</h3>
            <div className="stat-value">{stats.weeklyPrayers} / 35</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${weeklyPercentage}%` }}></div>
              </div>
              <span className="progress-text">%{weeklyPercentage}</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-warning" onClick={() => navigate('/kaza')}>
          <div className="stat-icon">
            <IoRepeatOutline size={32} />
          </div>
          <div className="stat-content">
            <h3>Kaza Borcu</h3>
            <div className="stat-value">{stats.totalKaza}</div>
            <p className="stat-label">Kalan namaz</p>
          </div>
        </div>

        <div className="stat-card stat-card-info" onClick={() => navigate('/fasting')}>
          <div className="stat-icon">
            <IoMoonOutline size={32} />
          </div>
          <div className="stat-content">
            <h3>Bu Ay Oruç</h3>
            <div className="stat-value">{stats.monthlyFasting}</div>
            <p className="stat-label">Tutulan gün</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Hızlı İşlemler</h2>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" onClick={() => navigate('/daily')}>
            <IoCheckmarkCircleOutline size={24} />
            <span>Bugünkü Namazları İşaretle</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/kaza')}>
            <IoTrendingUpOutline size={24} />
            <span>Kaza Borcu Ekle</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/fasting')}>
            <IoMoonOutline size={24} />
            <span>Oruç İşaretle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
