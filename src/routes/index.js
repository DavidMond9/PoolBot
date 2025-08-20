const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const queueRoutes = require('./queue');
const gameRoutes = require('./game');

// Mount route modules
router.use('/auth', authRoutes);
router.use('/queue', queueRoutes);
router.use('/game', gameRoutes);

module.exports = router;
