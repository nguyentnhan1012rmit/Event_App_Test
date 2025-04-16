import axios from 'axios';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import BookingCard from '../components/BookingCard';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]); // For filtered results

    useEffect(() => {
        const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/bookings/made', {
            headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
            setFilteredBookings(res.data); // Initialize filteredBookings with all bookings
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        }
        };

        fetchBookings();
    }, []);

    const handleSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = bookings.filter((booking) =>
          booking.eventId.eventName.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredBookings(filtered); // Update filteredBookings based on the search query
    };

    const handleCancel = async (bookingId) => {
        try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
        alert('Booking cancelled successfully!');
        } catch (err) {
        console.error('Failed to cancel booking:', err);
        alert('Failed to cancel booking. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header onSearch={handleSearch} />
            <h1 className="text-2xl font-semibold mb-2 mt-2">My Bookings</h1>
            <div className="flex flex-wrap gap-6 justify-center mb-4">
                {filteredBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                ))}
            </div>
            <Footer />
        </div>
    )
}