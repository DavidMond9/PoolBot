const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validation');

// Registration endpoint
router.post('/register', validateRegistration, AuthController.register);

// Login endpoint
router.post('/login', AuthController.login);

module.exports = router;
