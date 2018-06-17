const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const Jwt = require('passport-jwt');
const BearerStrategy = require('passport-http-bearer');

// const JwtStrategy = Jwt.Strategy;
// const { ExtractJwt } = Jwt;

const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
  passport.use(
    'bearer',
    new BearerStrategy((token, cb) => {
      User.findOne({ token }, (err, user) => {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }

        return cb(null, user);
      });
    })
  );
};
