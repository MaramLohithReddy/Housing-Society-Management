const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  username: String,
  password: String,
  community: String
});

module.exports = mongoose.model('Manager', managerSchema);
