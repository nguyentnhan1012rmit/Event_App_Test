import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToMyEvents = () => {
    navigate('/myevents');
    setOpen(false); // Close dropdown after navigation
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-900 font-semibold cursor-pointer"
      >
        {user?.name?.[0] || 'U'}
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-md z-20">
          <div className="p-3 text-gray-700 text-sm border-b">👤 {user?.name}</div>
          <button
            onClick={goToMyEvents}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            📅 My Created Events
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            🔓 Log Out
          </button>
        </div>
      )}
    </div>
  );
}
