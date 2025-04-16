import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


// Admin Update user name and password by ID
router.put('/:id', async (req, res) => {
  const { name, password } = req.body;

  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
      updateFields.plainPassword = password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});


// Update user profile (name + avatar)
router.put('/profile', upload.single('avatar'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
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

    res.status(200).json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user avatar by id
router.get('/avatar/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) return res.status(404).send('No Avatar');

    res.contentType(user.avatar.contentType);
    res.send(user.avatar.data);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
