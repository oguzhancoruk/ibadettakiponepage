import { getPreferences } from "../../context/Preferences";
import { t } from "../../context/Preferences";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";
import moment from "moment";
import "moment/locale/tr";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { IoFastFoodOutline, IoMoon, IoRepeat, IoStar } from "react-icons/io5";
import { useLoading } from "../../context/LoadingContext";
import logo from "../assets/images/1.png";
import "./Fasting.css";
const FASTING_TYPES = [
  {
    key: "ramadan",
    name: "Ramazan",
    icon: IoMoon,
    color: "#9B59B6",
  },
  {
    key: "kaza",
    name: "Kaza",
    icon: IoRepeat,
    color: "#E67E22",
  },
  {
    key: "voluntary",
    name: "Nafile",
    icon: IoStar,
    color: "#3498DB",
  },
];
function Fasting() {
  const { isLoading, setIsLoading } = useLoading();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [fasting, setFasting] = useState(null);
  const [stats, setStats] = useState(null);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [kazaModalVisible, setKazaModalVisible] = useState(false);
  const [kazaAction, setKazaAction] = useState("add");
  const [kazaCount, setKazaCount] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  useEffect(() => {
    fetchFasting(selectedDate);
    fetchStats();
    fetchMonthFastings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchFasting(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);
  const fetchFasting = async (date) => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `${config.api_base}/api/fasting?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${user._id}`,
          },
        }
      );
      if (response.data.statusCode === 200 && response.data.data) {
        setFasting(response.data.data);
      } else {
        setFasting(null);
      }
    } catch (error) {
      console.error("Oruç getir hatası:", error);
      setFasting(null);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `${config.api_base}/api/fasting/stats?period=month`,
        {
          headers: {
            Authorization: `Bearer ${user._id}`,
          },
        }
      );
      if (response.data.statusCode === 200 && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Stats getir hatası:", error);
    }
  };
  const fetchMonthFastings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
      const response = await axios.get(
        `${config.api_base}/api/fasting/range?startDate=${startOfMonth}&endDate=${endOfMonth}`,
        {
          headers: {
            Authorization: `Bearer ${user._id}`,
          },
        }
      );
      if (response.data.statusCode === 200 && response.data.data) {
        const marked = {};
        response.data.data.forEach((item) => {
          if (item.fasted) {
            // Backend'den gelen tarih ISO formatında, YYYY-MM-DD'ye çevir
            const dateKey = moment(item.date).format("YYYY-MM-DD");
            marked[dateKey] = {
              type: item.type,
              marked: true,
            };
          }
        });
        setMarkedDates(marked);
      }
    } catch (error) {
      console.error("Ay oruçları getir hatası:", error);
    }
  };
  const toggleFasting = async (type) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `${config.api_base}/api/fasting`,
        {
          date: selectedDate,
          fasted: true,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${user._id}`,
          },
        }
      );
      setTypeModalVisible(false);
      fetchFasting(selectedDate);
      fetchStats();
      fetchMonthFastings();
      alert(
        `${
          type === "ramadan" ? "Ramazan" : type === "kaza" ? "Kaza" : "Nafile"
        } orucu işaretlendi!`
      );
    } catch (error) {
      console.error("Oruç işaretleme hatası:", error);
      alert("Oruç işaretlenirken bir hata oluştu");
    }
  };
  const removeFasting = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `${config.api_base}/api/fasting`,
        {
          date: selectedDate,
          fasted: false,
        },
        {
          headers: {
            Authorization: `Bearer ${user._id}`,
          },
        }
      );
      fetchFasting(selectedDate);
      fetchStats();
      fetchMonthFastings();
    } catch (error) {
      console.error("Oruç kaldırma hatası:", error);
      alert("Oruç kaldırılırken bir hata oluştu");
    }
  };
  const handleKazaDebt = async () => {
    const count = parseInt(kazaCount);
    if (!count || count <= 0) {
      alert("Lütfen geçerli bir sayı girin");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `${config.api_base}/api/fasting/kaza`,
        {
          action: kazaAction,
          count,
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${user._id}`,
          },
        }
      );
      setKazaModalVisible(false);
      setKazaCount("");
      fetchFasting(selectedDate);
      fetchStats();
      fetchMonthFastings();
      alert(
        kazaAction === "add"
          ? `${count} kaza orucu eklendi`
          : `${count} kaza orucu azaltıldı`
      );
    } catch (error) {
      console.error("Kaza oruç hatası:", error);
      alert("İşlem sırasında bir hata oluştu");
    }
  };
  const isToday = selectedDate === moment().format("YYYY-MM-DD");
  const isFasted = fasting && fasting.fasted;
  if (isLoading) {
    return (
      <div className="page-loading-container">
        <img src={logo} alt={t("Loading")} className="page-loading-logo" />
      </div>
    );
  }
  return (
    <div className="fasting-container">
      {/* Header */}
      <div className="fasting-header">
        <div className="header-content">
          <div className="header-icon">
            <IoFastFoodOutline size={32} color="white" />
          </div>
          <div className="header-info">
            <h2>{t("Oruç Takibi")}</h2>
            <div className="header-date">
              <span>{moment(selectedDate).format("DD MMMM YYYY, dddd")}</span>
              {isToday && <span className="today-badge">{t("BUGÜN")}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="fasting-content">
        <div className="fasting-main">
          {/* Calendar Card */}
          <div className="calendar-card">
            <Calendar
              value={new Date(selectedDate)}
              onChange={(date) =>
                setSelectedDate(moment(date).format("YYYY-MM-DD"))
              }
              maxDate={new Date()}
              locale={getPreferences().language}
              tileClassName={({ date }) => {
                const dateString = moment(date).format("YYYY-MM-DD");
                if (markedDates[dateString]) {
                  const type = markedDates[dateString].type;
                  return t("fasted-day fasted-{v0}", {
                    v0: type,
                  });
                }
                return null;
              }}
              tileContent={({ date }) => {
                const dateString = moment(date).format("YYYY-MM-DD");
                if (markedDates[dateString]) {
                  const type = markedDates[dateString].type;
                  const fastingType = FASTING_TYPES.find((t) => t.key === type);
                  if (fastingType) {
                    const Icon = fastingType.icon;
                    return (
                      <div className="fasting-marker">
                        <Icon size={16} color={fastingType.color} />
                      </div>
                    );
                  }
                }
                return null;
              }}
              onActiveStartDateChange={({ activeStartDate }) => {
                // Ay değiştiğinde o ayın oruçlarını getir
                const startOfMonth = moment(activeStartDate)
                  .startOf("month")
                  .format("YYYY-MM-DD");
                const endOfMonth = moment(activeStartDate)
                  .endOf("month")
                  .format("YYYY-MM-DD");
                const user = JSON.parse(localStorage.getItem("user"));
                axios
                  .get(
                    `${config.api_base}/api/fasting/range?startDate=${startOfMonth}&endDate=${endOfMonth}`,
                    {
                      headers: {
                        Authorization: `Bearer ${user._id}`,
                      },
                    }
                  )
                  .then((response) => {
                    if (
                      response.data.statusCode === 200 &&
                      response.data.data
                    ) {
                      const marked = {};
                      response.data.data.forEach((item) => {
                        if (item.fasted) {
                          // Backend'den gelen tarih ISO formatında, YYYY-MM-DD'ye çevir
                          const dateKey = moment(item.date).format(
                            "YYYY-MM-DD"
                          );
                          marked[dateKey] = {
                            type: item.type,
                            marked: true,
                          };
                        }
                      });
                      setMarkedDates(marked);
                    }
                  })
                  .catch((error) => {
                    console.error("Ay oruçları getir hatası:", error);
                  });
              }}
            />
          </div>

          {/* Status Card */}
          <div className="status-card">
            {t(
              isFasted ? (
                <>
                  <FiCheckCircle size={60} color="#27AE60" />
                  <h3 className="status-title success">{t("Oruç Tutuldu!")}</h3>
                  <p className="fasting-type">
                    {t(
                      fasting.type === "ramadan"
                        ? "🌙 Ramazan Orucu"
                        : fasting.type === "kaza"
                        ? "🔄 Kaza Orucu"
                        : "⭐ Nafile Orucu"
                    )}
                  </p>
                  <button
                    className="remove-fasting-btn"
                    onClick={removeFasting}
                  >
                    <FiXCircle size={18} />
                    <span>{t("Kaldır")}</span>
                  </button>
                </>
              ) : (
                <>
                  <FiXCircle size={60} color="#95A5A6" />
                  <h3 className="status-title">{t("Oruç Tutulmadı")}</h3>
                  <button
                    className="add-fasting-btn"
                    onClick={() => setTypeModalVisible(true)}
                  >
                    <FiCheckCircle size={18} />
                    <span>{t("Oruç İşaretle")}</span>
                  </button>
                </>
              )
            )}
          </div>

          {/* Kaza Debt Card */}
          {fasting && fasting.kazaDebt > 0 && (
            <div className="kaza-debt-warning">
              <div className="kaza-debt-header">
                <FiAlertCircle size={24} />
                <h3>{t("Kaza Orucu Borcu")}</h3>
              </div>
              <div className="kaza-debt-count">
                {t(fasting.kazaDebt)}
                {t(" gün")}
              </div>
              <button
                className="manage-kaza-btn"
                onClick={() => setKazaModalVisible(true)}
              >
                {t("Yönet")}
              </button>
            </div>
          )}
        </div>

        {/* Stats Card */}
        {stats && (
          <div className="stats-card">
            <h3>{t("Bu Ay İstatistikleri")}</h3>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-number">{t(stats.completed || 0)}</div>
                <div className="stat-label">{t("Tutulan")}</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{t(stats.total || 0)}</div>
                <div className="stat-label">{t("Toplam Gün")}</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">%{t(stats.percentage || 0)}</div>
                <div className="stat-label">{t("Oran")}</div>
              </div>
            </div>

            {stats.byType && (
              <div className="type-stats">
                <div className="type-stat-row">
                  <div
                    className="type-dot"
                    style={{
                      backgroundColor: "#9B59B6",
                    }}
                  ></div>
                  <span className="type-label">{t("Ramazan")}</span>
                  <span className="type-value">
                    {t(stats.byType.ramadan || 0)}
                  </span>
                </div>
                <div className="type-stat-row">
                  <div
                    className="type-dot"
                    style={{
                      backgroundColor: "#E67E22",
                    }}
                  ></div>
                  <span className="type-label">{t("Kaza")}</span>
                  <span className="type-value">
                    {t(stats.byType.kaza || 0)}
                  </span>
                </div>
                <div className="type-stat-row">
                  <div
                    className="type-dot"
                    style={{
                      backgroundColor: "#3498DB",
                    }}
                  ></div>
                  <span className="type-label">{t("Nafile")}</span>
                  <span className="type-value">
                    {t(stats.byType.voluntary || 0)}
                  </span>
                </div>
              </div>
            )}

            {stats.totalKazaDebt > 0 && (
              <div className="total-kaza-debt">
                <span>{t("Toplam Kaza Borcu:")}</span>
                <strong>
                  {t(stats.totalKazaDebt)}
                  {t(" gün")}
                </strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Type Selection Modal */}
      {typeModalVisible && (
        <div
          className="modal-overlay"
          onClick={() => setTypeModalVisible(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t("Oruç Türünü Seçin")}</h3>

            {FASTING_TYPES.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.key}
                  className="type-option"
                  onClick={() => toggleFasting(type.key)}
                >
                  <div
                    className="type-icon"
                    style={{
                      backgroundColor: type.color,
                    }}
                  >
                    <IconComponent size={24} color="white" />
                  </div>
                  <span>{t(type.name)}</span>
                </button>
              );
            })}

            <button
              className="cancel-modal-btn"
              onClick={() => setTypeModalVisible(false)}
            >
              {t("İptal")}
            </button>
          </div>
        </div>
      )}

      {/* Kaza Debt Modal */}
      {kazaModalVisible && (
        <div
          className="modal-overlay"
          onClick={() => setKazaModalVisible(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t("Kaza Orucu Yönet")}</h3>

            <div className="action-selector">
              <button
                className={`action-option ${
                  kazaAction === "add" ? "selected" : ""
                }`}
                onClick={() => setKazaAction("add")}
              >
                {t("Borç Ekle")}
              </button>
              <button
                className={`action-option ${
                  kazaAction === "subtract" ? "selected" : ""
                }`}
                onClick={() => setKazaAction("subtract")}
              >
                {t("Borç Azalt")}
              </button>
            </div>

            <input
              type="number"
              className="kaza-input"
              placeholder={t("Gün sayısı")}
              value={kazaCount}
              onChange={(e) => setKazaCount(e.target.value)}
            />

            <div className="modal-buttons">
              <button
                className="modal-cancel-btn"
                onClick={() => {
                  setKazaModalVisible(false);
                  setKazaCount("");
                }}
              >
                {t("İptal")}
              </button>
              <button className="modal-confirm-btn" onClick={handleKazaDebt}>
                {t("Tamam")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Fasting;
