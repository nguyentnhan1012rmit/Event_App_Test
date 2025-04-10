import mongoose from 'mongoose';

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
  }
});


const Event = mongoose.model('Event', eventSchema);
export default Event;