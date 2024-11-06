// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

router.post('/remove', authenticateAdmin, adminController.removeUser);
router.post('/clear', authenticateAdmin, adminController.clearQueue);
router.post('/remove-top', authenticateAdmin, adminController.removeTopPlayer);
router.post('/add-at-position', authenticateAdmin, adminController.addAtPosition);
router.get('/users', authenticateAdmin, adminController.getAllUsers);

module.exports = router;
