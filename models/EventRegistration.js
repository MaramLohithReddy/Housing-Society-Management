const mongoose = require('mongoose');

const eventRegSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  houseNumber: String,
  username: String,
  phone: String,
  tickets: Number,
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EventRegistration', eventRegSchema);
