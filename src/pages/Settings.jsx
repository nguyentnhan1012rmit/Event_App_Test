import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
        if (res.data.avatar) {
          setPreview(`http://localhost:5001/api/user/avatar/${res.data._id}`);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (avatar) formData.append('avatar', avatar);
  
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Profile updated successfully!');
      localStorage.setItem('reload', 'true');  // <-- Add this line
      navigate('/dashboard');                  // <-- Keep this
    } catch (err) {
      console.error('Failed to update profile:', err);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-4">Edit Profile</h2>

        <div className="flex justify-center">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white">
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

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
