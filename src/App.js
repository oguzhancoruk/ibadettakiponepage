import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Features from './components/Features';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyPrayer from './components/dashboard/DailyPrayer';
import KazaDebtList from './components/dashboard/KazaDebtList';
import KazaDebt from './components/dashboard/KazaDebt';
import Fasting from './components/dashboard/Fasting';
import Account from './components/dashboard/Account';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Auth Pages (No Header/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* App Routes (With Dashboard Layout) */}
        <Route path="/daily" element={<Dashboard />}>
          <Route index element={<DailyPrayer />} />
        </Route>
        <Route path="/kaza" element={<Dashboard />}>
          <Route index element={<KazaDebtList />} />
        </Route>
        <Route path="/kaza/:debtId" element={<Dashboard />}>
          <Route index element={<KazaDebt />} />
        </Route>
        <Route path="/fasting" element={<Dashboard />}>
          <Route index element={<Fasting />} />
        </Route>
        <Route path="/account" element={<Dashboard />}>
          <Route index element={<Account />} />
        </Route>

        {/* Public Pages (With Header/Footer) */}
        <Route path="/*" element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
