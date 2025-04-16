import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now, // Defaults to the current time
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'], // Possible statuses
    default: 'Pending',
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;