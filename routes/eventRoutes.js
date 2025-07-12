const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');

// 🔹 Configure Multer for event image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/gallery/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

/**
 * ✅ POST: Manager creates event
 */
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { name, description, ticketLimit, maxPerUser, community } = req.body;
    const imagePath = req.file ? `/gallery/${req.file.filename}` : '';

    const newEvent = new Event({
      name,
      description,
      ticketLimit: parseInt(ticketLimit),
      ticketLeft: parseInt(ticketLimit),
      maxPerUser: parseInt(maxPerUser),
      image: imagePath,
      community
    });

    await newEvent.save();
    res.json({ success: true, message: '✅ Event created successfully' });

  } catch (err) {
    console.error('❌ Create event error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating event' });
  }
});

/**
 * ✅ POST: User registers for event (with check for maxPerUser)
 */
// ✅ POST: User registers for event
router.post('/register', async (req, res) => {
  const { eventId, tickets, houseNumber, community } = req.body;

  try {
    const user = await User.findOne({ houseNumber, community });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.ticketLimit !== 0 && event.ticketLeft < tickets) {
      return res.status(400).json({ success: false, message: 'Not enough tickets left' });
    }

    const existingRegs = await EventRegistration.find({ eventId, houseNumber });
    const alreadyTaken = existingRegs.reduce((sum, r) => sum + r.tickets, 0);

    if (alreadyTaken + tickets > event.maxPerUser) {
      return res.status(400).json({
        success: false,
        message: `Limit exceeded! You can only book ${event.maxPerUser} tickets.`
      });
    }

    const registration = new EventRegistration({
      eventId,
      userId: user._id,
      houseNumber,
      username: user.username,
      phone: user.phone,
      tickets
    });

    await registration.save();

    if (event.ticketLimit !== 0) {
      event.ticketLeft -= tickets;
      await event.save();
    }

    res.json({ success: true, message: '🎟️ Registered successfully' });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * ✅ GET: View registrations for a specific event
 */
router.get('/registrations/:eventId', async (req, res) => {
  try {
    const regs = await EventRegistration.find({ eventId: req.params.eventId });
    const formatted = regs.map(r => ({
      houseNumber: r.houseNumber,
      username: r.username,
      phone: r.phone,
      tickets: r.tickets
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("❌ Registration fetch error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * ✅ GET: Fetch active events by community
 */
router.get('/:community', async (req, res) => {
  try {
    console.log("📍 Fetching events for community:", req.params.community);
    const events = await Event.find({ community: req.params.community, deleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * ✅ GET: Fetch deleted events for manager
 */
router.get('/deleted/:community', async (req, res) => {
  try {
    const deletedEvents = await Event.find({ community: req.params.community, deleted: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: deletedEvents });
  } catch (err) {
    console.error('❌ Deleted event fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching deleted events' });
  }
});

/**
 * ✅ SOFT DELETE: Mark event as deleted
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, { deleted: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: '🗑️ Event moved to Deleted Events' });
  } catch (err) {
    console.error('❌ Soft delete error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
