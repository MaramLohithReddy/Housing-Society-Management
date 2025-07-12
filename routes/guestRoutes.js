const express = require('express');
const router = express.Router();
const GuestQR = require('../models/GuestQR');
const QRCode = require('qrcode');
const verifyToken = require('../middleware/authMiddleware');

// ✅ Route to create a new guest QR
router.post('/guest/create', async (req, res) => {
  try {
    const { houseNumber, guestName, visitDate, visitTime, communityName } = req.body;

    if (!houseNumber || !guestName || !visitDate || !visitTime || !communityName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newQR = new GuestQR({
      houseNumber,
      guestName,
      visitDate,
      visitTime,
      communityName
    });

    const savedQR = await newQR.save();

    // Generate QR code (link to scan endpoint)
    const qrURL = `${req.protocol}://${req.get('host')}/security_scan.html?qrId=${savedQR._id}`;
    const qrImage = await QRCode.toDataURL(qrURL);

    res.json({
      qrId: savedQR._id,
      qrImage,
      scanURL: qrURL
    });
  } catch (error) {
    console.error('❌ Guest QR creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// ✅ Route to get guest QR logs (for manager dashboard)
// GET all guest QR logs for manager's community
router.get('/guest/logs/:community', async (req, res) => {
  try {
    const community = req.params.community;
    const logs = await GuestQR.find({ communityName: community });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching QR logs' });
  }
});

// Example protected route
router.get('/user/dashboard-data', verifyToken, (req, res) => {
  // req.user contains decoded token data
  res.json({ message: `Hello ${req.user.username} from ${req.user.community}` });
});

module.exports = router;


module.exports = router;
