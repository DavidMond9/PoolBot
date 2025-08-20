const AuthService = require('../../src/services/authService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');
jest.mock('../../src/config/config', () => ({
  JWT_SECRET: 'test-secret',
  ADMIN_PASSWORD: 'adminpass'
}));

describe('AuthService', () => {
  let User;
  
  beforeEach(() => {
    jest.clearAllMocks();
    User = require('../../src/models/User');
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      bcrypt.hash.mockResolvedValue(hashedPassword);

      const mockUser = {
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockUser);

      const result = await AuthService.registerUser(username, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(User).toHaveBeenCalledWith({ username, password: hashedPassword });
      expect(mockUser.save).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.message).toBe('User registered successfully.');
    });

    it('should handle duplicate username error', async () => {
      const username = 'existinguser';
      const password = 'password123';

      const mockUser = {
        save: jest.fn().mockRejectedValue({ code: 11000 })
      };
      User.mockImplementation(() => mockUser);

      await expect(AuthService.registerUser(username, password))
        .rejects.toThrow('Username already exists');
    });
  });

  describe('loginUser', () => {
    it('should login admin user successfully', async () => {
      const username = 'admin';
      const password = 'adminpass';
      const token = 'admin-token';

      jwt.sign.mockReturnValue(token);

      const result = await AuthService.loginUser(username, password);

      expect(jwt.sign).toHaveBeenCalledWith(
        { username: 'admin', isAdmin: true },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(result.token).toBe(token);
      expect(result.isAdmin).toBe(true);
    });

    it('should login regular user successfully', async () => {
      const username = 'testuser';
      const password = 'password123';
      const token = 'user-token';
      const hashedPassword = 'hashedPassword123';

      User.findOne.mockResolvedValue({
        username,
        password: hashedPassword
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);

      const result = await AuthService.loginUser(username, password);

      expect(User.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith(
        { username, isAdmin: false },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(result.token).toBe(token);
      expect(result.isAdmin).toBe(false);
    });

    it('should handle invalid credentials', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      User.findOne.mockResolvedValue(null);

      await expect(AuthService.loginUser(username, password))
        .rejects.toThrow('Invalid username or password');
    });
  });
});
