// routes/myEvents.js
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import Event from '../models/Event.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const events = await Event.find({ createdBy: userId }, '-image.data');
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Failed to fetch user's events:", error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// ✅ Fetch events where the current user is a participant
router.get('/joined', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find events where the user is in the participants array
    const events = await Event.find({ participants: userId }, '-image.data').populate('createdBy', 'name');
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Failed to fetch joined events:", error);
    res.status(500).json({ message: 'Failed to fetch joined events', error: error.message });
  }
});

// ✅ Delete event (user-owned only)
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const deleted = await Event.findOneAndDelete({ _id: req.params.id, createdBy: userId });
    if (!deleted) return res.status(404).json({ message: "Event not found or not owned by user" });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete event:", err);
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
});

// ✅ Update name or image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const updateFields = {};
    if (req.body.eventName) updateFields.eventName = req.body.eventName;
    if (req.file && req.file.buffer) {
      updateFields.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, createdBy: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Event not found or not owned by user" });

    res.status(200).json({ message: "Event updated successfully", event: updated });
  } catch (err) {
    console.error("❌ Failed to update event:", err);
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
});

// ✅ Important: default export
export default router;
