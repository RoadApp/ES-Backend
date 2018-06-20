const mongoose = require('mongoose');

const CarSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  plate: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = () => mongoose.model('Car', CarSchema);
