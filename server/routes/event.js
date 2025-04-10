// routes/event.js
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken'; // ✅ You need this
import multer from 'multer';
import Event from '../models/Event.js';

dotenv.config();

const router = express.Router();

// 🔧 Multer setup: Store uploaded file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

/** ================================
 * ✅ CREATE Event with image upload
 * ================================ */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { eventName, startDateTime, endDateTime, description } = req.body;

    const newEvent = new Event({
      eventName,
      startDateTime,
      endDateTime,
      description,
      createdBy: userId
    });

    if (req.file && req.file.buffer && req.file.buffer.length > 0) {
      newEvent.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else if (req.file) {
      return res.status(400).json({ message: 'Invalid image upload: file buffer is empty' });
    }
    

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

/** ===========================================
 * ✅ GET ALL EVENTS (excluding image buffer)
 * =========================================== */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}, '-image.data'); // exclude binary buffer
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

/** ==========================
 * ✅ GET Single Event by ID
 * ========================== */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
});

/** ============================
 * ✅ GET IMAGE by Event ID
 * ============================ */
router.get('/image/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.image?.data) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', event.image.contentType);
    res.send(event.image.data);
  } catch (err) {
    res.status(500).send('Error retrieving image');
  }
});

/** ========================
 * ✅ UPDATE Event (No image)
 * ======================== */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { eventName, startDateTime, endDateTime, description } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { eventName, startDateTime, endDateTime, description },
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});
export default router;
