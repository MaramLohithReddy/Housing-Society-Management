const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  imageUrl: String,
  community: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
