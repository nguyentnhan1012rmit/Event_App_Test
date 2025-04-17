import React from 'react';
import { getImageUrl } from '../utils/getImageUrl'; // ✅ import helper (adjust path if needed)

export default function BookingCard({ booking, onCancel }) {
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
      {/* Event Image */}
      {booking.eventId && (
        <img
          src={getImageUrl(booking.eventId._id)} // ✅ use dynamic URL
          alt={booking.eventId.eventName}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/assets/placeholder.png'; // Fallback to placeholder image
          }}
        />
      )}

      {/* Card Content */}
      <div className="p-4">
        {/* Event Name */}
        <h2 className="text-lg font-semibold text-gray-800">{booking.eventId.eventName}</h2>

        {/* Event Host */}
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Event Host:</span> {booking.eventId.createdBy.name}
        </p>

        {/* Booking Status */}
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`${
              booking.status === 'Confirmed'
                ? 'text-green-600'
                : booking.status === 'Pending'
                ? 'text-yellow-600'
                : 'text-red-600'
            } font-medium`}
          >
            {booking.status}
          </span>
        </p>

        {/* Booking Date */}
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Created On:</span>{' '}
          {new Date(booking.bookingDate).toLocaleDateString()}
        </p>

        {/* Cancel Button */}
        <button
          onClick={() => onCancel(booking._id)}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
}
