const express = require('express');
const router = express.Router();
const multer = require('multer');
const Complaint = require('../models/Complaint');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/complaints/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// POST: Create Complaint
router.post('/complaints/create', upload.single('photo'), async (req, res) => {
  const { issue, description, houseNumber, community } = req.body;

  if (!issue || !houseNumber || !community) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const newComplaint = new Complaint({
      issue,
      description,
      houseNumber,
      community,
      status: 'Pending',
      imageUrl: req.file ? '/complaints/' + req.file.filename : null
    });
    await newComplaint.save();
    res.json({ success: true, message: "✅ Complaint submitted" });
  } catch (err) {
    console.error("❌ Error submitting complaint:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: User complaint history
router.get('/complaints/user/:houseNumber', async (req, res) => {
  try {
    const complaints = await Complaint.find({ houseNumber: req.params.houseNumber }).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching history" });
  }
});

// GET: Manager fetch complaints
router.get('/complaints/community/:community', async (req, res) => {
  try {
    const complaints = await Complaint.find({ community: req.params.community }).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching community complaints" });
  }
});

// PATCH: Mark as resolved
router.patch('/complaints/resolve/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndUpdate(req.params.id, { status: 'Resolved' });
    res.json({ success: true, message: '✅ Complaint marked as resolved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
