// models/TournamentRegistration.js
const mongoose = require('mongoose');

const tournamentRegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TournamentRegistration', tournamentRegistrationSchema);
