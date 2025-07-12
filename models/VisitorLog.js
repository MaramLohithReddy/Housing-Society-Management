const mongoose = require('mongoose');

const visitorLogSchema = new mongoose.Schema({
  houseNumber: String,
  guestName: String,
  scannedAt: { type: Date, default: Date.now },
  communityName: String,
  qrId: String
});

module.exports = mongoose.model('VisitorLog', visitorLogSchema);
