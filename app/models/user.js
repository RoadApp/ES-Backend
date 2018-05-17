const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = () => mongoose.model('User', UserSchema);
