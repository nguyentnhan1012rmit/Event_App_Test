import axios from 'axios';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RequestCard from '../components/RequestCard';

export default function MyBookings() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]); // For filtered results

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/bookings/created', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
        setFilteredRequests(res.data); // Initialize filteredRequests with all pending requests
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = requests.filter((request) =>
      request.eventId.eventName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredRequests(filtered); // Update filteredRequests based on the search query
  };

  const handleUpdate = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/bookings/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) =>
        prev.map((request) =>
          request._id === bookingId ? { ...request, status } : request
        )
      );
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-6 px-4">
        <h1 className="text-xl font-semibold uppercase">Requests</h1>
      </div>

      <main className="flex-grow px-6 py-8">
        {requests.length === 0 ? (
          <div className="text-center text-gray-400">No requests yet.</div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {requests.map((request) => (
              <RequestCard key={request._id} booking={request} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}