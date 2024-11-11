// scripts/seedTournaments.js
const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    await Tournament.deleteMany({});

    const tournaments = [
      { name: '1v1 Tournament', description: 'A classic one-on-one tournament.', date: new Date('2024-12-31') },
      { name: 'Doubles Tournament', description: 'Team up and compete!', date: new Date('2024-11-30') },
    ];

    await Tournament.insertMany(tournaments);

    console.log('Tournaments seeded');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });