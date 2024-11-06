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

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
