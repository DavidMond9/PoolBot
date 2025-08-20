const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

class AuthService {
  static async registerUser(username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      return { success: true, message: 'User registered successfully.' };
    } catch (err) {
      if (err.code === 11000) {
        throw new Error('Username already exists');
      }
      throw new Error('Error registering user.');
    }
  }

  static async loginUser(username, password) {
    try {
      // Check if it's admin login
      if (username === 'admin' && password === config.ADMIN_PASSWORD) {
        const token = jwt.sign(
          { username: 'admin', isAdmin: true }, 
          config.JWT_SECRET, 
          { expiresIn: '1h' }
        );
        return { token, isAdmin: true };
      }

      // Regular user login
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Invalid username or password');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid username or password');
      }

      const token = jwt.sign(
        { username: user.username, isAdmin: false }, 
        config.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      return { token, isAdmin: false };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AuthService;
