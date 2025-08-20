// Validation middleware for common input validation
const validateRegistration = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters long' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  if (username.toLowerCase() === 'admin') {
    return res.status(400).json({ message: 'Username not allowed' });
  }
  
  next();
};

const validateGameReport = (req, res, next) => {
  const { winner, loser } = req.body;
  
  if (!winner || !loser) {
    return res.status(400).json({ message: 'Winner and loser must be specified.' });
  }
  
  if (winner === loser) {
    return res.status(400).json({ message: 'Winner and loser cannot be the same person.' });
  }
  
  next();
};

const validatePosition = (req, res, next) => {
  const { position } = req.body;
  
  if (!Number.isInteger(position) || position < 1) {
    return res.status(400).json({ message: 'Invalid position' });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateGameReport,
  validatePosition
};
