const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Security = require('../models/security');
const GuestQR = require('../models/GuestQR');

// 🔐 Security login
// Security login
router.post('/security/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Security.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Return community to be stored in frontend
    res.json({ message: "Login successful", community: user.community });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ QR Scan route
router.post('/security/scan/:qrId', async (req, res) => {
  const { community } = req.body;
  const qrId = req.params.qrId;

  if (!mongoose.Types.ObjectId.isValid(qrId)) {
    return res.status(400).json({ message: "Invalid QR ID format" });
  }

  try {
    const qr = await GuestQR.findById(qrId);

    if (!qr) {
      return res.status(404).json({ message: 'QR not found' });
    }

   if (qr.communityName !== community) {
     return res.status(403).json({ message: 'QR not valid for your community' });
    }

    if (qr.used) {
      return res.status(400).json({ message: 'QR already used' });
    }

    qr.used = true;
    await qr.save();

    res.json({ message: `✅ Entry approved for ${qr.guestName}` });
  } catch (err) {
    console.error("QR scan error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
