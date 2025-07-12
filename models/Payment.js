const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  houseNumber: String,
  amount: Number,
  transactionid: String,
  noticeId: mongoose.Schema.Types.ObjectId,
  community: String,
  purpose: String, // Added to store the purpose of maintenance
  receiptPath: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
