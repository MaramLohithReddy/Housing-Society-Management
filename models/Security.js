const mongoose = require('mongoose');

const securitySchema = new mongoose.Schema({
  username: String,
  password: String,
  community: String
});

module.exports = mongoose.model('Security', securitySchema);
