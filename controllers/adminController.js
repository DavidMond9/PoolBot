// controllers/adminController.js
const QueueItem = require('../models/QueueItem');
const User = require('../models/User');
const { getIo } = require('../socket'); // Import getIo for emitting events

exports.removeUser = async (req, res) => {
  try {
    const { username } = req.body;
    const deletedItem = await QueueItem.findOneAndDelete({ username });
    if (deletedItem) {
      // Reorder positions
      await QueueItem.updateMany(
        { position: { $gt: deletedItem.position } },
        { $inc: { position: -1 } }
      );

      // Emit queue updated event
      const io = getIo();
      const queue = await QueueItem.find().sort({ position: 1 }).select('username -_id');
      io.emit('queueUpdated', queue.map(item => item.username));

      res.json({ message: `${username} removed from queue by admin` });
    } else {
      res.status(400).json({ message: 'User not in queue' });
    }
  } catch (err) {
    console.error('Error removing user:', err);
    res.status(500).json({ message: 'Error removing user' });
  }
};

exports.clearQueue = async (req, res) => {
  try {
    await QueueItem.deleteMany({});

    // Emit queue updated event (queue is now empty)
    const io = getIo();
    io.emit('queueUpdated', []);

    res.json({ message: 'Queue cleared by admin' });
  } catch (err) {
    console.error('Error clearing queue:', err);
    res.status(500).json({ message: 'Error clearing queue' });
  }
};

exports.removeTopPlayer = async (req, res) => {
  try {
    const topItem = await QueueItem.findOne().sort({ position: 1 });
    if (!topItem) {
      return res.status(400).json({ message: 'The queue is empty.' });
    }

    await QueueItem.deleteOne({ _id: topItem._id });

    // Reorder positions
    await QueueItem.updateMany(
      { position: { $gt: topItem.position } },
      { $inc: { position: -1 } }
    );

    // Emit queue updated event
    const io = getIo();
    const queue = await QueueItem.find().sort({ position: 1 }).select('username -_id');
    io.emit('queueUpdated', queue.map(item => item.username));

    res.json({ message: `${topItem.username} removed from the queue.` });
  } catch (err) {
    console.error('Error removing top player:', err);
    res.status(500).json({ message: 'Error removing top player' });
  }
};

exports.addAtPosition = async (req, res) => {
  try {
    const { username, position } = req.body;

    if (!Number.isInteger(position) || position < 1) {
      return res.status(400).json({ message: 'Invalid position' });
    }

    const existingItem = await QueueItem.findOne({ username });
    if (existingItem) {
      return res.status(400).json({ message: 'User already in queue' });
    }

    const queueLength = await QueueItem.countDocuments();
    if (position > queueLength + 1) {
      return res.status(400).json({ message: 'Position out of bounds' });
    }

    // Increment positions of items at or after the specified position
    await QueueItem.updateMany(
      { position: { $gte: position } },
      { $inc: { position: 1 } }
    );

    const queueItem = new QueueItem({ username, position });
    await queueItem.save();

    // Emit queue updated event
    const io = getIo();
    const queue = await QueueItem.find().sort({ position: 1 }).select('username -_id');
    io.emit('queueUpdated', queue.map(item => item.username));

    res.json({ message: `${username} added to queue at position ${position}` });
  } catch (err) {
    console.error('Error adding at position:', err);
    res.status(500).json({ message: 'Error adding user at position' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users.map(user => user.username));
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};