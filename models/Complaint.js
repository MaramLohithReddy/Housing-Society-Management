const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  issue: String,
  description: String,
  houseNumber: String,
  community: String,
  imageUrl: String,
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
