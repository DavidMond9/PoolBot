# Pool Queue Management System

A comprehensive pool website designed to manage a queue for pool players, track player stats, and organize tournaments. This project provides a robust interface for users and admins alike, enhancing the overall experience with detailed statistics and performance tracking.

## 🏗️ Architecture

This project follows a **modular, scalable architecture** with clear separation of concerns:

```
src/
├── config/          # Configuration files (database, app settings)
├── controllers/     # HTTP request handlers
├── middleware/      # Authentication and validation middleware
├── models/          # Database schemas and models
├── routes/          # API route definitions
├── services/        # Business logic layer
├── utils/           # Utility functions
└── public/          # Frontend assets
    ├── css/         # Stylesheets
    ├── js/          # JavaScript modules
    └── components/  # Reusable UI components

test/
├── unit/            # Unit tests
└── integration/     # Integration tests
```

## ✨ Features

- **Queue Management**: Allows users to join a pool queue and remove themselves once their game is complete
- **ELO Ranking System**: Tracks player performance and updates ELO scores based on game outcomes
- **Player Statistics**: Maintains records such as all-time wins, losses, win rates, and head-to-head stats
- **Tournament Hosting**: Supports the organization and tracking of tournament brackets and player progression
- **Real-Time Updates**: Ensures that all data, from queue changes to ELO adjustments, updates in real-time for all users
- **Admin Controls**: Special admin features for adding, removing, or editing players, and overseeing tournaments

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PoolBot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/pool
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=your-admin-password
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📝 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and database interactions
- **Coverage Reports**: Track test coverage across the codebase

Run tests with:
```bash
npm test
```

## 🔧 Development

### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Models**: Define database schemas and validation
- **Middleware**: Handle authentication, validation, and error handling
- **Routes**: Define API endpoints and their handlers

### Adding New Features

1. Create a new service in `src/services/`
2. Add corresponding controller in `src/controllers/`
3. Define routes in `src/routes/`
4. Add tests in `test/unit/` and `test/integration/`
5. Update documentation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control (admin/user)
- Secure session management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Queue Management
- `GET /api/queue` - Get current queue
- `POST /api/queue/add` - Add user to queue
- `POST /api/queue/admin/remove` - Remove specific user (admin)
- `POST /api/queue/admin/clear` - Clear entire queue (admin)

### Game Management
- `POST /api/game/report-game` - Report game results
- `GET /api/game/leaderboard` - Get player rankings
- `GET /api/game/profile` - Get user profile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

**Owners**: David Mond, Ryan Cooke  
**Collaborators**: Arnav Ganguly, Nikhil Vasudeva  
**Organization**: Delta Sigma Phi

---

*This project is actively maintained and continuously improved.*
