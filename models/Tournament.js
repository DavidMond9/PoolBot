// models/Tournament.js
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date: Date,
});

module.exports = mongoose.model('Tournament', tournamentSchema);
