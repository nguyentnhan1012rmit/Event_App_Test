// server/routes/profile.js
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ PUT /api/profile/update
router.put('/update', upload.single('avatar'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const updateFields = {};
    if (req.body?.name) updateFields.name = req.body.name;
    if (req.file) {
      updateFields.avatar = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;
