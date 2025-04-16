import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import EventForm from './EventForm';

export default function Header({ onSearch }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      localStorage.removeItem('token');
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value); // Pass the search query to the parent component
    }
  };

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-blue-900 text-white shadow">
        <div className="flex items-center gap-4">
          <Link to={'/dashboard'}>
            <img src="/Logo_light.png" alt="Logo" className="h-8" />
          </Link>
          <input
            type="text"
            placeholder="Search event"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-3 py-1 rounded-md text-black focus:outline-none w-56"
          />
        </div>
        <div className="flex gap-4 items-center">
          <button type="button" onClick={() => setIsModalOpen(true)} className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-100">
            Create Event
          </button>
          <span className="material-icons">Wallet</span>
          <span className="material-icons">Dashboard</span>
          <ProfileDropdown user={user} />
        </div>
      </header>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-400 rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create Event</h2>
            <EventForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
