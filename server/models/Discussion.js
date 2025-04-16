import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;
