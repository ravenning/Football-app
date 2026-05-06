const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const demoEmail = process.env.DEMO_PLAYER_EMAIL || 'demo.player@example.com';
    const demoPassword = process.env.DEMO_PLAYER_PASSWORD || 'Player123!';

    const existingDemo = await User.findOne({ email: demoEmail });
    if (!existingDemo) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(demoPassword, salt);

      await User.create({
        name: 'Demo Player',
        email: demoEmail,
        password: hashedPassword,
        role: 'Player'
      });

      console.log(`Demo player account created: ${demoEmail}`);
    } else {
      console.log('Demo player account already exists');
    }
  })
  .catch(err => console.log(err));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/players'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});