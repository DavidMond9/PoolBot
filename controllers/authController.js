// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Admin password from environment variables
const adminPassword = process.env.ADMIN_PASSWORD || 'daude';

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username.toLowerCase() === 'admin') {
      return res.status(400).json({ message: 'Username not allowed' });
    }

    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Error registering user.' });
    }
  }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    if (username === 'admin' && password === adminPassword) {
      const token = jwt.sign(
        { username: 'admin', isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } else {
      const user = await User.findOne({ username });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { userId: user._id, username: user.username, isAdmin: false },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  };