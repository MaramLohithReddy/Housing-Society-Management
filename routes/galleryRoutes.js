const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure "gallery" folder exists before uploads
const uploadDir = path.join(__dirname, '..','public', 'gallery');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config for "gallery" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // Use absolute path for multer destination
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({ storage });

// POST: Upload image with error handling
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { community } = req.body;

    if (!req.file || !community) {
      return res.status(400).json({ success: false, message: 'Image and community required' });
    }

    const newImage = new GalleryImage({
      imageUrl: `/gallery/${req.file.filename}`,  // Relative to static folder
      community
    });

    await newImage.save();

    res.json({ success: true, message: '✅ Image uploaded', image: newImage });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
});

// GET: Get images by community
router.get('/:community', async (req, res) => {
  try {
    const images = await GalleryImage.find({ community: req.params.community }).sort({ uploadedAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    console.error('Fetch images error:', err);
    res.status(500).json({ success: false, message: '❌ Failed to fetch images' });
  }
});

module.exports = router;
