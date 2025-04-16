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
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
            <Header />

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-6 px-4">
                <h1 className="text-xl font-semibold uppercase">My Bookings</h1>
            </div>

            <main className="flex-grow px-6 py-8">
                {/* Replace this section with dynamic bookings */}
                <div className="w-full bg-blue-900 text-white py-3 text-center rounded-md">
                    Rmit VN
                </div>
            </main>

            <Footer />
        </div>
    );
}