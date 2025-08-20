// models/QueueItem.js
const mongoose = require('mongoose');

const queueItemSchema = new mongoose.Schema({
  username: String,
  position: Number,
});

module.exports = mongoose.model('QueueItem', queueItemSchema);