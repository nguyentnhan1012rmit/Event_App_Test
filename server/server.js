// server/server.js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import discussionRoutes from './routes/discussions.js';
import eventRoutes from './routes/event.js';
import joinedEventsRoutes from './routes/joinedEvents.js';
import myEventsRoutes from './routes/myEvents.js';
import profileRoutes from './routes/profile.js';
import userRoutes from './routes/user.js';

dotenv.config();
const app = express();

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app-name.onrender.com', // 🔁 Replace with actual Render URL after deploy
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/myevents', myEventsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/joinedEvents', joinedEventsRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api', bookingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);

// 🧱 Static frontend serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build files
app.use(express.static(path.join(__dirname, 'client')));

// Handle React routing, return index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// MongoDB + Start Server
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
