const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'Position TBD'
  },
  status: {
    type: String,
    enum: ['Available', 'Injured', 'Absent'],
    default: 'Available'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);