const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true, 
    required: true,
    minlength: 3,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  wins: { 
    type: Number, 
    default: 0 
  },
  losses: { 
    type: Number, 
    default: 0 
  },
  winRatio: { 
    type: Number, 
    default: 0 
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate win ratio before saving
userSchema.pre('save', function(next) {
  const totalGames = this.wins + this.losses;
  this.winRatio = totalGames > 0 ? this.wins / totalGames : 0;
  next();
});

module.exports = mongoose.model('User', userSchema);
