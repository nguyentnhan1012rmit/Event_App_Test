import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password }, { withCredentials: true });
      const loginRes = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      localStorage.setItem('token', loginRes.data.token);
      alert("Registration successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google user:', decoded);
      localStorage.setItem('token', credentialResponse.credential);
      alert(`Logged in as ${decoded.name}`);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Google login error', err);
      alert('Google login failed');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1f1f, #2c3e50)',
        padding: '20px',
      }}
    >
      <div className="card shadow-lg p-4 bg-dark text-white w-100" style={{ maxWidth: '450px' }}>
        <h2 className="text-center mb-4">
          {activeTab === 'login' ? 'Welcome Back 👋' : 'Join Us 🚀'}
        </h2>

        <ul className="nav nav-tabs mb-4 justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </li>
        </ul>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        {activeTab === 'register' && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {activeTab === 'login' && (
          <div className="text-end mb-3">
            <a href="/forgot-password" className="text-sm text-info">
              Forgot Password?
            </a>
          </div>
        )}

        <button
          className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-success'} w-100 mb-3`}
          onClick={activeTab === 'login' ? handleLogin : handleRegister}
        >
          {activeTab === 'login' ? 'Login' : 'Register'}
        </button>

        <div className="text-center">
          <span className="text-muted">OR</span>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Google Login Failed')}
          />
        </div>
      </div>
    </div>
  );
}
