const mongoose = require('mongoose');

const queueItemSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    ref: 'User'
  },
  position: { 
    type: Number, 
    required: true,
    min: 1
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique username in queue
queueItemSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('QueueItem', queueItemSchema);
