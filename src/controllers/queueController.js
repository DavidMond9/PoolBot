const QueueService = require('../services/queueService');

class QueueController {
  static async getQueue(req, res) {
    try {
      const queue = await QueueService.getQueue();
      res.json(queue);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async addToQueue(req, res) {
    try {
      const username = req.user.username;
      const result = await QueueService.addToQueue(username);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async removeFromQueue(req, res) {
    try {
      const { username } = req.body;
      const result = await QueueService.removeFromQueue(username);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async removeTopPlayer(req, res) {
    try {
      const result = await QueueService.removeTopPlayer();
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async addAtPosition(req, res) {
    try {
      const { username, position } = req.body;
      const result = await QueueService.addAtPosition(username, position);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async clearQueue(req, res) {
    try {
      const result = await QueueService.clearQueue();
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = QueueController;
