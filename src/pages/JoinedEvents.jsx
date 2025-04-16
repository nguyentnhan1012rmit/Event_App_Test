import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function JoinedEvents({ onClose }) {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5001/api/myEvents/joined', {
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


    <>
      <Header onSearch={handleSearch}/>
      <div className="bg-white p-6 rounded-lg w-full max-w-lg flex-col m-auto">
        <h2 className="text-lg font-bold mb-4">Joined Events</h2>
        {filteredEvents.length === 0 ? (
          <p>No event fits your search.</p>
        ) : (
          <ul className="space-y-2">
            {filteredEvents.map((event) => (
              <li key={event._id} className="border p-2 rounded m-2">
                <img
                  src={`http://localhost:5001/api/events/image/${event._id}`}
                  alt={event.eventName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/placeholder.png'; // Fallback to placeholder image
                  }}
                />
                <h3 className="font-semibold text-lg mt-2">{event.eventName}</h3>
                <p className='mt-1'>Organized by: {event.createdBy?.name || 'Unknown'}</p>
                <p>{new Date(event.startDateTime).toLocaleString()}</p>
                <p>Current Participants: {event.participants.length} / {event.maxParticipants}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer/>
    </>
  );
}
