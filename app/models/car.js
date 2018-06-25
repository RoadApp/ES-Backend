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
    type: String,
    required: true
  },
  plate: {
    type: String,
    required: true,
    unique: true
  },
  odometer: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = () => mongoose.model('Car', CarSchema);
