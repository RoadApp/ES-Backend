const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  madeAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  expense: {
    type: Number,
    required: true,
    default: 0
  },
  place: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = () => mongoose.model('Service', ServiceSchema);
