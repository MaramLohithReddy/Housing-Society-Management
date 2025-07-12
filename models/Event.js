const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  ticketLimit: Number,
  ticketLeft: Number,
  maxPerUser: Number,
  community: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
  type: Boolean,
  default: false
  }

});

module.exports = mongoose.model('Event', eventSchema);
