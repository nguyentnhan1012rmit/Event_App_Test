import axios from 'axios';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white text-center py-6 px-4">
        <h2 className="text-xl font-semibold uppercase">
          EXPERIENCE WORLD-CLASS LEARNING AT A PREMIER INSTITUTE, APPROVED BY THE MINISTRY OF EDUCATION
        </h2>
      </div>

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition">
              {event.image && (
                <img
                  src={`http://localhost:5000/api/events/image/${event._id}`}
                  alt={event.eventName}
                  className="w-full h-40 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.src = '/assets/placeholder.png'; // or a remote image URL
                  }}
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{event.eventName}</h3>
                <p className="text-sm text-gray-500">{new Date(event.startDateTime).toLocaleString()}</p>
                <p className="text-xs mt-1 text-gray-400">Organized by Student Forum</p>
                <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded">
                  Book Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
