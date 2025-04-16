import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/admin/login', { username, password });
      navigate('/admin-panel');
    } catch (error) {
      setMessage('Invalid credentials');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full p-2 border" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full p-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
}
