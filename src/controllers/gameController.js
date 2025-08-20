const GameService = require('../services/gameService');

class GameController {
  static async reportGame(req, res) {
    try {
      const { winner, loser } = req.body;
      const username = req.user.username;
      const result = await GameService.reportGame(winner, loser, username);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getLeaderboard(req, res) {
    try {
      const leaderboard = await GameService.getLeaderboard();
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const username = req.user.username;
      const profile = await GameService.getUserProfile(username);
      res.json(profile);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await GameService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = GameController;
