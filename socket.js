// socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken'); // Make sure this line is present
require('dotenv').config();

let io;

function initSocket(server) {
  io = new Server(server);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.user = user;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`);

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`);
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = { initSocket, getIo };