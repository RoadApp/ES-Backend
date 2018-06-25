const mongoose = require('mongoose');

const MileageSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  kilometers: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = () => mongoose.model('Mileage', MileageSchema);
