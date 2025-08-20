const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');
const { validateGameReport } = require('../middleware/validation');

// Report game result (authenticated)
router.post('/report-game', authenticateToken, validateGameReport, GameController.reportGame);

// Get leaderboard (authenticated)
router.get('/leaderboard', authenticateToken, GameController.getLeaderboard);

// Get user profile (authenticated)
router.get('/profile', authenticateToken, GameController.getUserProfile);

// Get all users (admin only)
router.get('/admin/users', authenticateAdmin, GameController.getAllUsers);

module.exports = router;
