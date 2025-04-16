import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  plainPassword: { type: String },
  role: {
    type: String,
    enum: ['admin', 'organizer', 'attendee'],
    default: 'attendee'
  },
  joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  avatar: {
    data: Buffer,        // Store image file
    contentType: String  // Store file type (jpg/png)
  }
});


const User = mongoose.model('User', userSchema);
export default User;
