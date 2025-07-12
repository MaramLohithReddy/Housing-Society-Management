const mongoose = require('mongoose');

const guestQRSchema = new mongoose.Schema({
  houseNumber: String,
  guestName: String,
  visitDate: String,
  visitTime: String,
  communityName: String,
  used: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('GuestQR', guestQRSchema);
