const express = require('express');
const router = express.Router();
const MaintenanceNotice = require('../models/MaintenanceNotice');
const Payment = require('../models/Payment');

// ✅ POST: Manager posts a new maintenance notice
router.post('/maintenance/create', async (req, res) => {
  const { community, amount, purpose } = req.body;

  if (!community || !amount || !purpose) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const newNotice = new MaintenanceNotice({ community, amount, purpose });
    await newNotice.save();
    res.status(201).json({ success: true, message: '✅ Maintenance posted successfully!' });
  } catch (err) {
    console.error('❌ Error posting maintenance:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET: All maintenance notices for a community
router.get('/maintenance/community/:community', async (req, res) => {
  try {
    const notices = await MaintenanceNotice.find({ community: req.params.community }).sort({ createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (err) {
    console.error("❌ Maintenance fetch error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ DELETE: Delete a maintenance notice by ID
router.delete('/maintenance/:id', async (req, res) => {
  try {
    await MaintenanceNotice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: '🗑️ Maintenance notice deleted' });
  } catch (err) {
    console.error("❌ Error deleting maintenance:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
