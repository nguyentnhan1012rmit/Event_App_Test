import express from 'express';
import jwt from 'jsonwebtoken';
import Discussion from '../models/Discussion.js';
import User from '../models/User.js';

const router = express.Router();

// Verify Token
const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user;
  } catch {
    return null;
  }
};

// Get Comments By Event
router.get('/:eventId', async (req, res) => {
  try {
    const comments = await Discussion.find({ eventId: req.params.eventId }).populate('user', 'name');
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Post Comment
router.post('/:eventId/comment', async (req, res) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const newComment = new Discussion({
      eventId: req.params.eventId,
      user: user._id,
      comment: req.body.comment,
    });

    await newComment.save();
    await newComment.populate('user', 'name');

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Error posting comment' });
  }
});

// Update Comment
router.put('/comment/:commentId', async (req, res) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const comment = await Discussion.findOneAndUpdate(
      { _id: req.params.commentId, user: user._id },
      { comment: req.body.comment },
      { new: true }
    ).populate('user', 'name');

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment' });
  }
});

// Delete Comment
router.delete('/comment/:commentId', async (req, res) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const comment = await Discussion.findOneAndDelete({
      _id: req.params.commentId,
      user: user._id,
    });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

export default router;
