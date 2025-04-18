import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ NEW STATE
  const navigate = useNavigate();

  const isDirty = email !== '' || newPassword !== '';

  const handleBack = () => {
    if (!isDirty || isSaved) {
      window.location.href = '/';
    } else {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirm) {
        window.location.href = '/';
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/reset-password', {
        email,
        newPassword,
      });
      setMessage(res.data.message || 'Password reset successfully');
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img src="/Logo_light.png" alt="Logo" className="h-16 object-contain" />
        </div>

        <form onSubmit={handleResetPassword}>
          <div className="relative mb-4">
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-0 text-sm text-blue-400 hover:underline"
            >
              &larr; Back
            </button>
            <h2 className="text-xl font-semibold text-center">Reset Password</h2>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-400">{message}</p>
        )}
      </div>
    </div>
  );
}
