const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  firebaseUid: {
    type: String,
    trim: true,
    required: true
  },
  cars: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        model: 'Car'
      }
    ],
    required: true,
    default: []
  }
});

module.exports = () => mongoose.model('User', UserSchema);
