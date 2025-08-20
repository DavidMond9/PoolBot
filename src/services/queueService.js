const QueueItem = require('../models/QueueItem');

class QueueService {
  static async getQueue() {
    try {
      const queue = await QueueItem.find().sort({ position: 1 });
      return queue.map(item => item.username);
    } catch (err) {
      throw new Error('Failed to fetch queue');
    }
  }

  static async addToQueue(username) {
    try {
      const existingItem = await QueueItem.findOne({ username });
      if (existingItem) {
        throw new Error('You are already in the queue.');
      }

      const lastItem = await QueueItem.findOne().sort({ position: -1 });
      const newPosition = lastItem ? lastItem.position + 1 : 1;

      const queueItem = new QueueItem({ username, position: newPosition });
      await queueItem.save();
      return { message: `${username} added to the queue.` };
    } catch (err) {
      throw err;
    }
  }

  static async removeFromQueue(username) {
    try {
      const deletedItem = await QueueItem.findOneAndDelete({ username });
      if (!deletedItem) {
        throw new Error('User not in queue');
      }

      // Reorder positions
      await QueueItem.updateMany(
        { position: { $gt: deletedItem.position } },
        { $inc: { position: -1 } }
      );

      return { message: `${username} removed from queue` };
    } catch (err) {
      throw err;
    }
  }

  static async removeTopPlayer() {
    try {
      const topItem = await QueueItem.findOne().sort({ position: 1 });
      if (!topItem) {
        throw new Error('The queue is empty.');
      }

      await QueueItem.deleteOne({ _id: topItem._id });
      
      // Reorder positions
      await QueueItem.updateMany(
        { position: { $gt: topItem.position } },
        { $inc: { position: -1 } }
      );

      return { message: `${topItem.username} removed from the queue.` };
    } catch (err) {
      throw err;
    }
  }

  static async addAtPosition(username, position) {
    try {
      const existingItem = await QueueItem.findOne({ username });
      if (existingItem) {
        throw new Error('User already in queue');
      }

      const queueLength = await QueueItem.countDocuments();
      if (position > queueLength + 1) {
        throw new Error('Position out of bounds');
      }

      // Increment positions of items at or after the specified position
      await QueueItem.updateMany(
        { position: { $gte: position } },
        { $inc: { position: 1 } }
      );

      const queueItem = new QueueItem({ username, position });
      await queueItem.save();
      return { message: `${username} added to queue at position ${position}` };
    } catch (err) {
      throw err;
    }
  }

  static async clearQueue() {
    try {
      await QueueItem.deleteMany({});
      return { message: 'Queue cleared' };
    } catch (err) {
      throw new Error('Failed to clear queue');
    }
  }

  static async getTopPlayers(limit = 2) {
    try {
      const queue = await QueueItem.find().sort({ position: 1 }).limit(limit);
      return queue.map(item => item.username);
    } catch (err) {
      throw new Error('Failed to get top players');
    }
  }
}

module.exports = QueueService;
