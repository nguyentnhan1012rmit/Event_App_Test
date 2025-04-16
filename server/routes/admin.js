// server/routes/admin.js
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

/**
 * Admin Login (Username & Password from .env)
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ message: 'Admin login successful' });
  }

  return res.status(401).json({ message: 'Invalid Admin Credentials' });
});

/**
 * Get all users
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

/**
 * Get all events
 */
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
});

/**
 * Delete user
 */
router.delete('/user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

/**
 * Delete event
 */
router.delete('/event/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
});

/**
 * ✅ Update user name and password (admin only)
 */
router.put('/user/:id', async (req, res) => {
  const { name, password } = req.body;

  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
      updateFields.plainPassword = password; // for admin view
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

export default router;
