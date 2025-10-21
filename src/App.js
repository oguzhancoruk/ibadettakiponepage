import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Features from './components/Features';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardHome from './components/dashboard/DashboardHome';
import DailyPrayer from './components/dashboard/DailyPrayer';
import KazaDebtList from './components/dashboard/KazaDebtList';
import KazaDebt from './components/dashboard/KazaDebt';
import Fasting from './components/dashboard/Fasting';
import Account from './components/dashboard/Account';
import ContactPage from './pages/Contact';
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Auth Pages (With Header/Footer) */}
        <Route path="/login" element={
          <>
            <Header />
            <Login />
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <Header />
            <Register />
            <Footer />
          </>
        } />

        {/* Dashboard Route - Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
        </Route>

        {/* App Routes (With Dashboard Layout) - Protected */}
        <Route path="/daily" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DailyPrayer />} />
        </Route>
        <Route path="/kaza" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<KazaDebtList />} />
        </Route>
        <Route path="/kaza/:debtId" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<KazaDebt />} />
        </Route>
        <Route path="/fasting" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Fasting />} />
        </Route>
        <Route path="/account" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Account />} />
        </Route>

        {/* Public Pages (With Header/Footer) */}
        <Route path="/*" element={
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
        } />
      </Routes>
    </div>
  );
}

export default App;
