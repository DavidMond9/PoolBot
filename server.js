// server.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = 3000;

const mongoose = require('mongoose');
require('dotenv').config();

const { initSocket } = require('./socket');

// Initialize Socket.IO
initSocket(server);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
const queueRoutes = require('./routes/queue');
const adminRoutes = require('./routes/admin');
const tournamentRoutes = require('./routes/tournaments'); // Include tournament routes


app.use('/auth', authRoutes);
app.use('/queue', queueRoutes);
app.use('/admin', adminRoutes);
app.use('/tournaments', tournamentRoutes); // Use tournament routes

// New endpoint to report game results
app.post('/report-game', authenticateToken, async (req, res) => {
  const { winner, loser } = req.body;
  const username = req.user.username;

  // Check if the user is one of the top two players
  const queue = await QueueItem.find().sort({ position: 1 }).limit(2);
  const topPlayers = queue.map(item => item.username);

  if (!topPlayers.includes(username)) {
    return res.status(403).json({ message: 'You can only report games if you are currently on the table.' });
  }

  if (!winner || !loser) {
    return res.status(400).json({ message: 'Winner and loser must be specified.' });
  }

  if (!topPlayers.includes(winner) || !topPlayers.includes(loser)) {
    return res.status(400).json({ message: 'Winner and loser must be among the top two players.' });
  }

  if (winner === loser) {
    return res.status(400).json({ message: 'Winner and loser cannot be the same person.' });
  }

  // Update winner's stats
  const winnerUser = await User.findOne({ username: winner });
  if (winnerUser) {
    winnerUser.wins += 1;
    winnerUser.winRatio = winnerUser.wins / (winnerUser.wins + winnerUser.losses);
    await winnerUser.save();
  }

  // Update loser's stats
  const loserUser = await User.findOne({ username: loser });
  if (loserUser) {
    loserUser.losses += 1;
    loserUser.winRatio = loserUser.wins / (loserUser.wins + loserUser.losses);
    await loserUser.save();
  }

  // Remove the loser from the queue
  const loserQueueItem = await QueueItem.findOne({ username: loser });
  if (loserQueueItem) {
    await QueueItem.deleteOne({ _id: loserQueueItem._id });
    // Reorder positions
    await QueueItem.updateMany(
      { position: { $gt: loserQueueItem.position } },
      { $inc: { position: -1 } }
    );
  }

  res.json({ message: 'Game reported successfully.' });
});

// Endpoint to get leaderboard data
app.get('/leaderboard', authenticateToken, async (req, res) => {
  const users = await User.find({}, 'username wins losses winRatio').sort({ winRatio: -1, wins: -1 });
  res.json(users);
});

// Endpoint to get user profile data
app.get('/profile', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const user = await User.findOne({ username }, 'username wins losses winRatio').lean();
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
