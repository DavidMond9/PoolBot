// controllers/tournamentController.js
const Tournament = require('../models/Tournament');
const TournamentRegistration = require('../models/TournamentRegistration');

// Get all tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    console.error('Error fetching tournaments:', err);
    res.status(500).json({ message: 'Error fetching tournaments' });
  }
};

exports.getTournamentDetails = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Filter out registrations with null users
    const registrations = await TournamentRegistration.find({ tournament: tournamentId }).populate('user', 'username');
    const participants = registrations
      .filter(reg => reg.user) // Ensure user is not null
      .map(reg => reg.user.username);

    res.json({
      tournament,
      participants,
    });
  } catch (err) {
    console.error('Error fetching tournament details:', err);
    res.status(500).json({ message: 'Error fetching tournament details' });
  }
};


// Register user for a tournament
exports.registerForTournament = async (req, res) => {
    try {
      const userId = req.user.userId; // Use userId from token payload
      const tournamentId = req.params.id;
  
      // Check if tournament exists
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({ message: 'Tournament not found' });
      }
  
      // Check if user already registered
      const existingRegistration = await TournamentRegistration.findOne({
        user: userId,
        tournament: tournamentId,
      });
      if (existingRegistration) {
        return res.status(400).json({
          message: 'You have already registered for this tournament',
        });
      }
  
      // Create registration
      const registration = new TournamentRegistration({
        user: userId,
        tournament: tournamentId,
      });
  
      await registration.save();
  
      res.json({ message: 'Successfully registered for the tournament' });
    } catch (err) {
      console.error('Error registering for tournament:', err);
      res.status(500).json({ message: 'Error registering for tournament' });
    }
  };

// Get tournaments the user has registered for
exports.getUserTournaments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const registrations = await TournamentRegistration.find({ user: userId }).populate('tournament');

    const tournaments = registrations.map(reg => reg.tournament);

    res.json(tournaments);
  } catch (err) {
    console.error('Error fetching user tournaments:', err);
    res.status(500).json({ message: 'Error fetching user tournaments' });
  }
};

// Admin: Create a new tournament
exports.createTournament = async (req, res) => {
  try {
    const { name, description, date } = req.body;

    const tournament = new Tournament({
      name,
      description,
      date,
    });

    await tournament.save();

    res.json({ message: 'Tournament created successfully', tournament });
  } catch (err) {
    console.error('Error creating tournament:', err);
    res.status(500).json({ message: 'Error creating tournament' });
  }
};

// Admin: Update an existing tournament
exports.updateTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const { name, description, date } = req.body;

    const tournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      { name, description, date },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json({ message: 'Tournament updated successfully', tournament });
  } catch (err) {
    console.error('Error updating tournament:', err);
    res.status(500).json({ message: 'Error updating tournament' });
  }
};

// Admin: Delete a tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    const tournament = await Tournament.findByIdAndDelete(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Optionally, delete related registrations
    await TournamentRegistration.deleteMany({ tournament: tournamentId });

    res.json({ message: 'Tournament deleted successfully' });
  } catch (err) {
    console.error('Error deleting tournament:', err);
    res.status(500).json({ message: 'Error deleting tournament' });
  }
};