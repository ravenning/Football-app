const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const authMiddleware = require('../middleware/auth');

// GET /api/players - Get all players for the authenticated user
router.get('/players', authMiddleware, async (req, res) => {
  try {
    const players = await Player.find({ userId: req.user.id });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/players - Create a new player
router.post('/players', authMiddleware, async (req, res) => {
  const player = new Player({
    name: req.body.name,
    position: req.body.position,
    status: req.body.status,
    userId: req.user.id
  });

  try {
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/players/:id - Update a player
router.put('/players/:id', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/players/:id - Delete a player
router.delete('/players/:id', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;