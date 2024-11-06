// middlewares/authenticateAdmin.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.isAdmin) {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateAdmin;
