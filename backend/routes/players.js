const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const Player = require('../models/Player');
const authMiddleware = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

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
    photoUrl: req.body.photoUrl || '',
    userId: req.user.id
  });

  try {
    const newPlayer = await player.save();
    const io = req.app.get('io');
    io.emit('playerAdded', newPlayer);
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/players/:id/photo - Upload player photo
router.post('/players/:id/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Photo file is required' });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary is not configured' });
  }

  try {
    const player = await Player.findOne({ _id: req.params.id, userId: req.user.id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const uploadStream = (buffer) => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'football-players' }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
      stream.end(buffer);
    });

    const result = await uploadStream(req.file.buffer);

    player.photoUrl = result.secure_url;
    await player.save();
    const io = req.app.get('io');
    io.emit('playerUpdated', player);
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const io = req.app.get('io');
    io.emit('playerUpdated', player);
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

    const io = req.app.get('io');
    io.emit('playerDeleted', req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/live-score - Publish a live score update to connected clients
router.post('/live-score', authMiddleware, async (req, res) => {
  try {
    const io = req.app.get('io');
    const payload = {
      matchId: req.body.matchId || 'live-match',
      homeScore: req.body.homeScore ?? 0,
      awayScore: req.body.awayScore ?? 0,
      description: req.body.description || 'Live score update',
      timestamp: new Date().toISOString()
    };

    io.emit('scoreUpdate', payload);
    res.json({ message: 'Score update sent', payload });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;