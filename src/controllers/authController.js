const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.registerUser(username, password);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.loginUser(username, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
