const mongoose = require('mongoose');

const MaintenanceNoticeSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  community: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MaintenanceNotice', MaintenanceNoticeSchema);
