import React from 'react';

export default function RequestCard({ booking, onUpdate }) {
    const handleAccept = () => {
        onUpdate(booking._id, 'Confirmed');
    };

    const handleDeny = () => {
        onUpdate(booking._id, 'Cancelled');
    };

    const handleCancel = () => {
        onUpdate(booking._id, 'Pending');
    };

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
      {/* Event Image */}
      {booking.eventId && (
        <img
          src={`/api/events/image/${booking.eventId._id}`}
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

        {/* Booker Name */}
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Booker:</span> {booking.userId.name}
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

        {/* Buttons */}
        <div className="mt-4">
          {booking.status === 'Confirmed' || booking.status === 'Cancelled' ? (
            // Single button for "Cancel Confirmation" or "Cancel Denial"
            <button
              onClick={handleCancel}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
            >
              {booking.status === 'Confirmed' ? 'Cancel Confirmation' : 'Cancel Denial'}
            </button>
          ) : (
            // Two buttons for "Accept" and "Deny"
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
              >
                Accept
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Deny
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}