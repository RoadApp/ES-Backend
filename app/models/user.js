const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

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

// eslint-disable-next-line func-names
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// eslint-disable-next-line func-names
UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = () => mongoose.model('User', UserSchema);
