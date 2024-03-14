const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: String,
  contact: String,
  location: String,
  availability: String,
  skills: String,
  message: String,
  status: { type: String, default: 'pending' },
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;