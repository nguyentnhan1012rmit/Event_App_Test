import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function Settings() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
        if (res.data.avatar) {
          setPreview(`/api/user/avatar/${res.data._id}`);
        }
      } catch (err) {
        toast.error("⚠️ Failed to fetch user info.");
        console.error('Fetch error:', err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (avatar) formData.append('avatar', avatar);

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      await axios.put('/api/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Profile updated successfully!');
      localStorage.setItem('reload', 'true');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('❌ Update failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-10 text-white transition-all duration-300 space-y-8">
        <h2 className="text-center text-3xl font-extrabold tracking-wide">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 group-hover:scale-105 transition-transform duration-300 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white shadow-md">
                  ?
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Upload New Avatar"
              />
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block mb-2 text-lg font-semibold tracking-wide">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-5 py-3 text-lg rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving || !name.trim()}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg transition ${
              isSaving || !name.trim()
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Discard changes and go back?")) {
                navigate(-1);
              }
            }}
            className="w-full py-3 rounded-xl text-white font-bold text-lg bg-red-600 hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}