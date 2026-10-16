import { useEffect, useState } from "react";
import { usePreferences, t } from "./context/Preferences";
import "./hooks/useInstall";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./components/dashboard/DashboardHome";
import DailyPrayer from "./components/dashboard/DailyPrayer";
import KazaDebtList from "./components/dashboard/KazaDebtList";
import KazaDebt from "./components/dashboard/KazaDebt";
import Fasting from "./components/dashboard/Fasting";
import Account from "./components/dashboard/Account";
import ContactPage from "./pages/Contact";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import ProtectedRoute from "./components/ProtectedRoute";
import Tools from "./pages/Tools";
import Tesbih from "./pages/Tesbih";
import Duas from "./pages/Duas";
import Hatim from "./pages/Hatim";
import Family from "./pages/Family";
import Friends from "./pages/Friends";
import Achievements from "./pages/Achievements";
import Games from "./pages/Games";
import Game from "./pages/Game";
import Reports from "./pages/Reports";
import Journal from "./pages/Journal";
import Challenges from "./pages/Challenges";
import Activity from "./pages/Activity";
import Qibla from "./pages/Qibla";
import Mosques from "./pages/Mosques";
import PrayerGuide from "./pages/PrayerGuide";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Subscription from "./pages/Subscription";
import Search from "./pages/Search";
import "./theme.css";
function App() {
  const { theme, language } = usePreferences();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        theme === "system" ? (media?.matches ? "dark" : "light") : theme;
    };
    apply();
    media?.addEventListener("change", apply);
    return () => media?.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return (
    <div className="App">
      {!online && (
        <div className="pt-offline-banner" role="status">
          {t(
            "Çevrimdışısın. Kayıtlarını görüntülemek veya kaydetmek için internete bağlan."
          )}
        </div>
      )}
      <Routes>
        {/* Auth Pages (With Header/Footer) */}
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
              <Footer />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <Header />
              <ForgotPassword />
              <Footer />
            </>
          }
        />
        <Route
          path="/reset-password"
          element={
            <>
              <Header />
              <ResetPassword />
              <Footer />
            </>
          }
        />

        {/* Dashboard Route - Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
        </Route>

        {/* App Routes (With Dashboard Layout) - Protected */}
        <Route
          path="/daily"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DailyPrayer />} />
        </Route>
        <Route
          path="/kaza"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<KazaDebtList />} />
        </Route>
        <Route
          path="/kaza/:debtId"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<KazaDebt />} />
        </Route>
        <Route
          path="/fasting"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Fasting />} />
        </Route>
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Account />} />
        </Route>

        {[
          ["/reports", <Reports />],
          ["/journal", <Journal />],
          ["/challenges", <Challenges />],
          ["/activity", <Activity />],
          ["/qibla", <Qibla />],
          ["/mosques", <Mosques />],
          ["/guide", <PrayerGuide />],
          ["/settings", <Settings />],
          ["/support", <Support />],
          ["/subscription", <Subscription />],
          ["/search", <Search />],
          ["/tools", <Tools />],
          ["/tesbih", <Tesbih />],
          ["/duas", <Duas />],
          ["/hatim", <Hatim />],
          ["/family", <Family />],
          ["/friends", <Friends />],
          ["/achievements", <Achievements />],
          ["/games", <Games />],
          ["/games/:gameKey", <Game />],
        ].map(([path, page]) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={page} />
          </Route>
        ))}

        {/* Public Pages (With Header/Footer) */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
