import express from 'express';
import jwt from 'jsonwebtoken';
// import multer from 'multer';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js'

const router = express.Router();

// Route 1: Create a new booking
router.post('/bookings', async (req, res) => {
    try {
      // Extract user ID from the token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Extract eventId from the request body
      const { eventId } = req.body;
  
      // Check if the event exists
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      // Prevent the creator of the event from booking their own event
      if (event.createdBy.toString() === userId) {
        return res.status(400).json({ message: 'You cannot book your own event' });
      }
  
      // Create a new booking
      const newBooking = new Booking({
        eventId,
        userId,
      });
  
      // Save the booking to the database
      await newBooking.save();
  
      res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Route 2: Fetch bookings made by the current account to events they didn't create
router.get('/bookings/made', async (req, res) => {
  try {
    // Extract user ID from the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Step 1: Find all events created by the user
    const userCreatedEvents = await Event.find({ createdBy: userId }).select('_id');
    const userCreatedEventIds = userCreatedEvents.map(event => event._id);

    // Step 2: Find bookings where the user is the attendee and exclude their own events
    const bookings = await Booking.find({
      userId: userId,
      eventId: { $nin: userCreatedEventIds }, // Exclude events created by the user
    })
      .populate({
        path: 'eventId',
        populate: { path: 'createdBy', select: 'name' }, // Populate the host's name
      })
      .populate('userId', 'name'); // Populate the requester's name

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings made by user:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Route 3: Fetch bookings for events created by the current account
router.get('/bookings/created', async (req, res) => {
  try {
    // Extract user ID from the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Step 1: Find all events created by the user
    const userCreatedEvents = await Event.find({ createdBy: userId }).select('_id');
    const userCreatedEventIds = userCreatedEvents.map(event => event._id);

    // Step 2: Find bookings for those events
    const bookings = await Booking.find({
      eventId: { $in: userCreatedEventIds }, // Include only events created by the user
    })
      .populate({
        path: 'eventId',
        populate: { path: 'createdBy', select: 'name' }, // Populate the host's name
      })
      .populate('userId', 'name'); // Populate the requester's name

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings for user-created events:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Route 4: Update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    // Extract user ID from the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Extract booking ID and new status from the request
    const { id: bookingId } = req.params;
    const { status } = req.body;

    // Validate the new status
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Ensure the user is authorized to update the booking
    const event = await Event.findById(booking.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this booking' });
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    // If the status is "Confirmed", add the booker to the event participants
    if (status === 'Confirmed') {
      if (!event.participants.includes(booking.userId)) {
        // Check if the event has reached the maxParticipants limit
        if (event.participants.length >= event.maxParticipants) {
          return res.status(400).json({ message: 'Event is full. Cannot confirm booking.' });
        }

        event.participants.push(booking.userId);
        await event.save();
      }
    }

    // If the status is "Cancelled", remove the booker from the event participants
    if (status === 'Cancelled' || status === 'Pending') {
      event.participants = event.participants.filter(
        (participantId) => participantId.toString() !== booking.userId.toString()
      );
      await event.save();
    }

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Route 5: Delete a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    // Extract user ID from the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Extract booking ID from the request parameters
    const { id: bookingId } = req.params;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Ensure the user is the owner of the booking
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

 export default router;