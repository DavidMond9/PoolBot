// routes/queue.js
const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, queueController.getQueue);
router.post('/add', authenticateToken, queueController.addToQueue);
router.post('/remove', authenticateToken, queueController.removeFromQueue); // New route

module.exports = router;