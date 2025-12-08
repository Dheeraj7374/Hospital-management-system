import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ComingSoon from './components/common/ComingSoon';
import BookAppointment from './components/appointments/BookAppointment';
import MyAppointments from './components/appointments/MyAppointments';
import DoctorsManagement from './components/doctors/DoctorsManagement';
import PatientsManagement from './components/patients/PatientsManagement';
import BillingManagement from './components/billing/BillingManagement';
import Profile from './components/profile/Profile';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    
    window.location.href = '/login';
  };

  const handleLoginSuccess = () => {
    window.location.href = '/dashboard';
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar role={localStorage.getItem('role')} />
        <div className="main-content">
          <TopBar
            onLogout={handleLogout}
            username={localStorage.getItem('username') || 'User'}
            role={localStorage.getItem('role') || 'GUEST'}
          />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/doctors" element={<DoctorsManagement />} />
              <Route path="/patients" element={<PatientsManagement />} />
              <Route path="/appointments" element={<MyAppointments />} />
              <Route path="/appointments/book" element={<BookAppointment />} />
              <Route path="/billing" element={<BillingManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
