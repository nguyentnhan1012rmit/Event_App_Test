import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [originalPreview, setOriginalPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
        setOriginalName(res.data.name);
        if (res.data.avatar) {
          const avatarUrl = `/api/user/avatar/${res.data._id}`;
          setPreview(avatarUrl);
          setOriginalPreview(avatarUrl);
        }
      } catch (err) {
        alert("⚠️ Failed to fetch user info.");
        console.error('Fetch error:', err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name cannot be empty.");
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

      alert('✅ Profile updated successfully!');
      localStorage.setItem('reload', 'true');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('❌ Update failed. Please try again.');
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

  const handleDiscard = () => {
    const confirmReset = window.confirm("Discard all changes?");
    if (confirmReset) {
      setName(originalName);
      setPreview(originalPreview);
      setAvatar(null);
    }
  };

  const handleBack = () => {
    const hasChanges =
      name !== originalName || (avatar && preview !== originalPreview);

    if (hasChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to go back?");
      if (!confirmLeave) return;
    }

    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-10 text-white space-y-8">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-sm text-blue-400 hover:underline"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-bold tracking-wide">Edit Profile</h2>
          <div className="w-12" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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

          <button
            type="button"
            onClick={handleDiscard}
            className="w-full py-3 rounded-xl text-white font-bold text-lg bg-red-600 hover:bg-red-700 transition"
          >
            Discard
          </button>
        </form>
      </div>
    </div>
  );
}
