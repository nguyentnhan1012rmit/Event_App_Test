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
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header onSearch={handleSearch} />
            <h1 className="text-2xl font-semibold mb-2 mt-2">Requests</h1>
            <div className="flex flex-wrap gap-6 justify-center mb-4">
                {filteredRequests.map((request) => (
                    <RequestCard key={request._id} booking={request} onUpdate={handleUpdate} />
                ))}
            </div>
            <Footer />
        </div>
    )
}