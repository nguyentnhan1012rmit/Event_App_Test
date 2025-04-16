// server/server.js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import discussionRoutes from './routes/discussions.js';
import eventRoutes from './routes/event.js'; // Import event routes
import joinedEventsRoutes from './routes/joinedEvents.js';
import myEventsRoutes from './routes/myEvents.js';
import userRoutes from './routes/user.js';


dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Only one route mount needed
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); // Use event routes
app.use('/api/myevents', myEventsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/joinedEvents', joinedEventsRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api', bookingRoutes);
app.use('/api/user', userRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(5001, () => console.log('🚀 Server running on http://localhost:5001'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
