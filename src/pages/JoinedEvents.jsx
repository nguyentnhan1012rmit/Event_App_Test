import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function JoinedEvents({ onClose }) {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/myEvents/joined', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setJoinedEvents(data);
          setFilteredEvents(data);
        } else {
          console.error('Failed to fetch joined events');
        }
      } catch (err) {
        console.error('Error fetching joined events:', err);
      }
    };

    fetchJoinedEvents();
  }, []);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = joinedEvents.filter((event) =>
      event.eventName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredEvents(filtered);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <Header onSearch={handleSearch} />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-6 px-4">
        <h2 className="text-xl font-semibold uppercase">My Joined Events</h2>
      </div>

      <main className="flex-grow px-6 py-10">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-300 text-center">No event fits your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition text-black flex flex-col"
              >
                {event.image && (
                  <img
                    src={`/api/events/image/${event._id}`}
                    alt={event.eventName}
                    className="w-full h-40 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = '/assets/placeholder.png';
                    }}
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-semibold">{event.eventName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.startDateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      Organized by: {event.createdBy?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Participants: {event.participants.length} / {event.maxParticipants}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
