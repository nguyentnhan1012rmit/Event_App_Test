import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventForm from './EventForm';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <header className="bg-blue-900 text-white shadow px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative">

          {/* Mobile & Tablet: Logo on top center */}
          <div className="flex justify-center md:order-1 lg:hidden">
            <Link to="/dashboard">
              <img
                src="/Logo_light.png"
                alt="Logo"
                className="h-14 object-contain"
              />
            </Link>
          </div>

          {/* Desktop: Centered logo */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link to="/dashboard">
              <img
                src="/Logo_light.png"
                alt="Logo"
                className="h-14 object-contain"
              />
            </Link>
          </div>

          {/* Left: Search bar */}
          <div className="flex justify-start md:order-2 md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search event"
              className="px-4 py-2 rounded-md text-black w-full sm:w-64"
            />
          </div>

          {/* Right: Nav buttons */}
          <div className="flex justify-end items-center gap-3 md:order-3 md:w-1/2 lg:w-1/3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-900 px-3 py-1 rounded-md font-semibold"
            >
              Create Event
            </button>
            <Link to="/wallet">Wallet</Link>
            <Link to="/dashboard">Dashboard</Link>
            <ProfileDropdown user={user} />
          </div>
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