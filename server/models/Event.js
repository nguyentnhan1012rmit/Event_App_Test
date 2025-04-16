import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  type: { type: String, enum: ['private', 'public'], default: 'public' },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  description: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
    },
  ],
  maxParticipants: {
    type: Number,
    required: true, // Ensure this is set when creating the event
    validate: {
      validator: function (value) {
        return value >= this.participants.length; // Ensure maxParticipants >= current participants
      },
      message: 'Max participants cannot be less than the current number of participants',
    },
  },
  comments: [commentSchema] // <-- Add this to store comments
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
