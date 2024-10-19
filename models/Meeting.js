const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  agenda: { type: String, required: true },
  roomId: { type: String, required: true } // Unique room ID for the meeting
});

module.exports = mongoose.model('Meeting', meetingSchema);
