import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Verify Token Inline
const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user ? decoded : null;
  } catch {
    return null;
  }
};

// Join Event
router.post('/join/:eventId', async (req, res) => {
  const userData = await verifyToken(req);
  if (!userData) return res.status(401).json({ message: 'Unauthorized' });

  const user = await User.findById(userData.id);
  if (!user.joinedEvents) user.joinedEvents = [];

  if (!user.joinedEvents.includes(req.params.eventId)) {
    user.joinedEvents.push(req.params.eventId);
    await user.save();
  }

  res.status(200).json({ message: 'Joined Event Successfully' });
});

// Get Joined Events
router.get('/joined', async (req, res) => {
  const userData = await verifyToken(req);
  if (!userData) return res.status(401).json({ message: 'Unauthorized' });

  const user = await User.findById(userData.id).populate('joinedEvents');
  res.status(200).json(user.joinedEvents);
});

export default router;
