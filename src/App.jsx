import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import MyBookings from './pages/MyBookings';
import MyEvents from './pages/MyEvents'; // ✅ Import the new page
import JoinedEvents from './pages/JoinedEvents.jsx';
import PendingRequests from './pages/PendingRequests';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/joined-events" element={<JoinedEvents />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/requests" element={<PendingRequests/>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
