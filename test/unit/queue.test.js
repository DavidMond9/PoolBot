const QueueService = require('../../src/services/queueService');

// Mock the QueueItem model
jest.mock('../../src/models/QueueItem');

describe('QueueService', () => {
  let QueueItem;
  
  beforeEach(() => {
    jest.clearAllMocks();
    QueueItem = require('../../src/models/QueueItem');
  });

  describe('getQueue', () => {
    it('should return queue usernames in order', async () => {
      const mockQueue = [
        { username: 'user1', position: 1 },
        { username: 'user2', position: 2 },
        { username: 'user3', position: 3 }
      ];

      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockQueue)
      };
      QueueItem.find.mockReturnValue(mockFind);

      const result = await QueueService.getQueue();

      expect(QueueItem.find).toHaveBeenCalled();
      expect(mockFind.sort).toHaveBeenCalledWith({ position: 1 });
      expect(result).toEqual(['user1', 'user2', 'user3']);
    });

    it('should handle errors', async () => {
      const mockFind = {
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      QueueItem.find.mockReturnValue(mockFind);

      await expect(QueueService.getQueue())
        .rejects.toThrow('Failed to fetch queue');
    });
  });

  describe('addToQueue', () => {
    it('should add user to queue successfully', async () => {
      const username = 'newuser';

      // Mock existing item check - return null (user not in queue)
      QueueItem.findOne
        .mockResolvedValueOnce(null) // First call for existing item check
        .mockReturnValueOnce({       // Second call for last item position
          sort: jest.fn().mockResolvedValue({ position: 5 })
        });

      // Mock new queue item
      const mockQueueItem = {
        save: jest.fn().mockResolvedValue(true)
      };
      QueueItem.mockImplementation(() => mockQueueItem);

      const result = await QueueService.addToQueue(username);

      expect(QueueItem).toHaveBeenCalledWith({ username, position: 6 });
      expect(mockQueueItem.save).toHaveBeenCalled();
      expect(result.message).toBe('newuser added to the queue.');
    });

    it('should prevent adding user already in queue', async () => {
      const username = 'existinguser';

      QueueItem.findOne.mockResolvedValue({ username, position: 1 });

      await expect(QueueService.addToQueue(username))
        .rejects.toThrow('You are already in the queue.');
    });
  });

  describe('removeFromQueue', () => {
    it('should remove user and reorder positions', async () => {
      const username = 'usertoremove';

      QueueItem.findOneAndDelete.mockResolvedValue({ username, position: 2 });

      const result = await QueueService.removeFromQueue(username);

      expect(QueueItem.findOneAndDelete).toHaveBeenCalledWith({ username });
      expect(QueueItem.updateMany).toHaveBeenCalledWith(
        { position: { $gt: 2 } },
        { $inc: { position: -1 } }
      );
      expect(result.message).toBe('usertoremove removed from queue');
    });

    it('should handle user not in queue', async () => {
      const username = 'nonexistentuser';

      QueueItem.findOneAndDelete.mockResolvedValue(null);

      await expect(QueueService.removeFromQueue(username))
        .rejects.toThrow('User not in queue');
    });
  });

  describe('clearQueue', () => {
    it('should clear all queue items', async () => {
      QueueItem.deleteMany.mockResolvedValue({ deletedCount: 5 });

      const result = await QueueService.clearQueue();

      expect(QueueItem.deleteMany).toHaveBeenCalledWith({});
      expect(result.message).toBe('Queue cleared');
    });
  });
});
