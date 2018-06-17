const mongoose = require('mongoose');

const CarSchema = mongoose.Schema({
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
    required: true
  }
}); // To be incremented

module.exports = () => mongoose.model('Car', CarSchema);
