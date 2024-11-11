// controllers/queueController.js
const QueueItem = require('../models/QueueItem');
const { getIo } = require('../socket'); // Import getIo for emitting events

exports.getQueue = async (req, res) => {
  try {
    const queue = await QueueItem.find().sort({ position: 1 });
    res.json(queue.map(item => item.username));
  } catch (err) {
    console.error('Error fetching queue:', err);
    res.status(500).json({ message: 'Error fetching queue' });
  }
};

exports.addToQueue = async (req, res) => {
  try {
    const username = req.user.username;

    const existingItem = await QueueItem.findOne({ username });
    if (existingItem) {
      return res.status(400).json({ message: 'You are already in the queue.' });
    }

    const lastItem = await QueueItem.findOne().sort({ position: -1 });
    const newPosition = lastItem ? lastItem.position + 1 : 1;

    const queueItem = new QueueItem({ username, position: newPosition });
    await queueItem.save();

    // Emit queue updated event
    const io = getIo();
    const queue = await QueueItem.find().sort({ position: 1 }).select('username -_id');
    io.emit('queueUpdated', queue.map(item => item.username));

    res.json({ message: `${username} added to the queue.` });
  } catch (err) {
    console.error('Error adding to queue:', err);
    res.status(500).json({ message: 'Error adding to queue' });
  }
};

exports.removeFromQueue = async (req, res) => {
  try {
    const username = req.user.username;

    const existingItem = await QueueItem.findOne({ username });
    if (!existingItem) {
      return res.status(400).json({ message: 'You are not in the queue.' });
    }

    // Remove the user from the queue
    await QueueItem.deleteOne({ username });

    // Reorder positions of the remaining queue items
    await QueueItem.updateMany(
      { position: { $gt: existingItem.position } },
      { $inc: { position: -1 } }
    );

    // Emit queue updated event
    const io = getIo();
    const queue = await QueueItem.find().sort({ position: 1 }).select('username -_id');
    io.emit('queueUpdated', queue.map(item => item.username));

    res.json({ message: 'You have been removed from the queue.' });
  } catch (err) {
    console.error('Error removing from queue:', err);
    res.status(500).json({ message: 'Error removing from queue' });
  }
};