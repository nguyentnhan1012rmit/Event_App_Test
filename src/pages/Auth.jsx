import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  withCredentials: true,
});

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

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
      const res = await axios.post('/api/auth/register', { name, email, password, role }, { withCredentials: true });
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-center mb-4 text-2xl font-semibold">
          {activeTab === 'login' ? 'Welcome Back 👋' : 'Join Us 🚀'}
        </h2>

        <div className="flex justify-center mb-4 space-x-6">
          <button
            className={`pb-1 border-b-2 ${activeTab === 'login' ? 'border-white text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`pb-1 border-b-2 ${activeTab === 'register' ? 'border-white text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        {activeTab === 'register' && (
          <div className="mb-3">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
        )}

        <div className="mb-3">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {activeTab === 'register' && (
          <div className="mb-4">
            <label className="block mb-1">Role</label>
            <div className="flex justify-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="attendee"
                  name="role"
                  checked={role === 'attendee'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Attendee</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="organizer"
                  name="role"
                  checked={role === 'organizer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Organizer</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="text-right text-sm mb-3">
            <a href="/forgot-password" className="text-blue-400 hover:underline">
              Forgot Password?
            </a>
          </div>
        )}

        <button
          className={`w-full py-2 rounded text-white font-semibold mb-3 ${
            activeTab === 'login' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={activeTab === 'login' ? handleLogin : handleRegister}
        >
          {activeTab === 'login' ? 'Login' : 'Register'}
        </button>

        <div className="text-center text-gray-400">OR</div>

        <div className="flex justify-center mt-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Google Login Failed')}
          />
        </div>
      </div>
    </div>
  );
}
