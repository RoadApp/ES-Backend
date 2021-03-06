const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Car = require('./car');

const UserSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  cnhExpiration: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  token: {
    type: String,
    trim: true
  }
});

// eslint-disable-next-line func-names
UserSchema.post('remove', async function (next) {
  const cars = await Car.find({ owner: this._id });
  cars.forEach((car) => car.remove());
  next();
});

/**
 * Generate hash for password
 * @param {*} password
 * @return {string} password hash
 */
// eslint-disable-next-line func-names
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Verify if password passed is equals of atual user
 * @param {*} password
 * @return {boolean} true if is equals, false otherwise
 */
// eslint-disable-next-line func-names
UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = () => mongoose.model('User', UserSchema);
