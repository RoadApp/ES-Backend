const mongoose = require('mongoose');

const Service = require('./service');
const Mileage = require('./mileage');

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
    required: false,
    default: 0
  }
});

CarSchema.post('remove', async (next) => {
  const services = await Service.find({ car: this._id });
  const mileages = await Mileage.find({ car: this._id });
  services.forEach(async (service) => service.remove());
  mileages.forEach(async (mileage) => mileage.remove());
  next();
});

module.exports = () => mongoose.model('Car', CarSchema);
