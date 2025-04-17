import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaCog,
  FaPaperPlane,
  FaRegStar,
  FaSignOutAlt,
  FaTicketAlt,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [showJoined, setShowJoined] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const goToMyEvents = () => {
    navigate('/myevents');
    setOpen(false);
  };

  const goToJoinedEvents = () => {
    navigate('/joined-events');
    setOpen(false);
  };

  const goToMyBookings = () => {
    navigate('/my-bookings');
    setOpen(false);
  };

  const goToRequests = () => {
    navigate('/requests');
    setOpen(false);
  };

  const goToSettings = () => {
    navigate('/settings');
    setOpen(false);
  };

  const fetchJoinedEvents = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/joinedEvents/joined', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setJoinedEvents(res.data);
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (showJoined) fetchJoinedEvents();
  }, [showJoined]);

  const menuItemClass =
    'w-full text-left px-5 py-3 text-base text-black hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200 inline-flex items-center gap-2';

  return (
    <div className="relative">
      {/* Avatar Circle */}
      <div
        onClick={() => setOpen(!open)}
        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-900 font-semibold cursor-pointer overflow-hidden"
      >
        {currentUser?.avatar ? (
          <img
            src={`/api/user/avatar/${currentUser._id}`}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          currentUser?.name?.[0] || 'U'
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-md z-20 flex flex-col">
          {/* Avatar + Name Display */}
          <div className="p-4 text-black text-base border-b flex items-center gap-2 font-semibold">
            {currentUser?.avatar ? (
              <img
                src={`/api/user/avatar/${currentUser._id}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUser />
            )}
            {currentUser?.name}
          </div>
          
          <button onClick={goToMyEvents} className={menuItemClass}>
            <FaCalendarAlt />
            My Events
          </button>

          <button
            onClick={goToJoinedEvents}
            className={menuItemClass}
          >
            <FaRegStar />
            Joined Events
          </button>

          <button onClick={goToMyBookings} className={menuItemClass}>
            <FaTicketAlt />
            My Bookings
          </button>

          <button onClick={goToRequests} className={menuItemClass}>
            <FaPaperPlane />
            Request
          </button>

          <button onClick={goToSettings} className={menuItemClass}>
            <FaCog />
            Settings
          </button>

          <div className="border-t mt-2"></div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 text-base text-red-600 hover:text-red-700 hover:bg-gray-100 transition-colors duration-200 inline-flex items-center gap-2"
          >
            <FaSignOutAlt />
            Log Out
          </button>
        </div>
      )}

      {showJoined && (
        <div className="absolute right-0 mt-2 w-72 bg-white border shadow-lg p-4 z-30 max-h-64 overflow-y-auto rounded-md">
          <h2 className="font-semibold text-base mb-2 text-gray-800">
            ⭐ Your Joined Events
          </h2>
          {joinedEvents.length === 0 ? (
            <p className="text-sm text-gray-500">No joined events.</p>
          ) : (
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
              {joinedEvents.map((event) => (
                <li key={event._id}>{event.eventName}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
