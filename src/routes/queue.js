const express = require('express');
const router = express.Router();
const QueueController = require('../controllers/queueController');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');
const { validatePosition } = require('../middleware/validation');

// Get current queue (authenticated)
router.get('/', authenticateToken, QueueController.getQueue);

// Add user to queue (authenticated)
router.post('/add', authenticateToken, QueueController.addToQueue);

// Remove specific user (admin only)
router.post('/admin/remove', authenticateAdmin, QueueController.removeFromQueue);

// Clear queue (admin only)
router.post('/admin/clear', authenticateAdmin, QueueController.clearQueue);

// Remove top player (admin only)
router.post('/admin/remove-top', authenticateAdmin, QueueController.removeTopPlayer);

// Add user at specific position (admin only)
router.post('/admin/add-at-position', authenticateAdmin, validatePosition, QueueController.addAtPosition);

module.exports = router;
