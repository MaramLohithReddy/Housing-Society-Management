const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST: Manager creates a user
router.post('/users/create', async (req, res) => {
  const { username, houseNumber, phone, email, password, community } = req.body;

  if (!username || !houseNumber || !phone || !email || !password || !community) {
    return res.status(400).json({ success: false, message: '❌ All fields are required.' });
  }

  try {
    const existing = await User.findOne({ houseNumber, community });
    if (existing) {
      return res.status(409).json({ success: false, message: '❌ User already exists.' });
    }

    const newUser = new User({ username, houseNumber, phone, email, password, community });
    await newUser.save();

    res.json({ success: true, message: '✅ User created successfully.' });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ success: false, message: '❌ Server error' });
  }
});
router.get('/users/community/:community', async (req, res) => {
  try {
    const users = await User.find({ community: req.params.community }).sort({ houseNumber: 1 });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE: Remove user by ID (Manager only)
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: '🗑️ User deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
module.exports = router;
