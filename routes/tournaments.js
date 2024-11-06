// routes/tournaments.js
const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const authenticateToken = require('../middlewares/authenticateToken');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

// Public routes
router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentDetails);

// User routes
router.post('/:id/register', authenticateToken, tournamentController.registerForTournament);
router.get('/user/registrations', authenticateToken, tournamentController.getUserTournaments);

// Admin routes
router.post('/', authenticateToken, authenticateAdmin, tournamentController.createTournament);
router.put('/:id', authenticateToken, authenticateAdmin, tournamentController.updateTournament);
router.delete('/:id', authenticateToken, authenticateAdmin, tournamentController.deleteTournament);

module.exports = router;
