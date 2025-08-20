const User = require('../models/User');
const QueueService = require('./queueService');

class GameService {
  static async reportGame(winner, loser, reporterUsername) {
    try {
      // Check if the reporter is one of the top two players
      const topPlayers = await QueueService.getTopPlayers(2);
      if (!topPlayers.includes(reporterUsername)) {
        throw new Error('You can only report games if you are currently on the table.');
      }

      if (!topPlayers.includes(winner) || !topPlayers.includes(loser)) {
        throw new Error('Winner and loser must be among the top two players.');
      }

      // Update winner's stats
      const winnerUser = await User.findOne({ username: winner });
      if (winnerUser) {
        winnerUser.wins += 1;
        winnerUser.winRatio = winnerUser.wins / (winnerUser.wins + winnerUser.losses);
        await winnerUser.save();
      }

      // Update loser's stats
      const loserUser = await User.findOne({ username: loser });
      if (loserUser) {
        loserUser.losses += 1;
        loserUser.winRatio = loserUser.wins / (loserUser.wins + loserUser.losses);
        await loserUser.save();
      }

      // Remove the loser from the queue
      await QueueService.removeFromQueue(loser);

      return { message: 'Game reported successfully.' };
    } catch (err) {
      throw err;
    }
  }

  static async getLeaderboard() {
    try {
      const users = await User.find({}, 'username wins losses winRatio')
        .sort({ winRatio: -1, wins: -1 });
      return users;
    } catch (err) {
      throw new Error('Failed to fetch leaderboard');
    }
  }

  static async getUserProfile(username) {
    try {
      const user = await User.findOne({ username }, 'username wins losses winRatio').lean();
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  static async getAllUsers() {
    try {
      const users = await User.find({}, 'username');
      return users.map(user => user.username);
    } catch (err) {
      throw new Error('Failed to fetch users');
    }
  }
}

module.exports = GameService;
