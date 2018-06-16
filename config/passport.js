const passport = require('passport');
// const LocalStrategy = require('passport-local');
const Jwt = require('passport-jwt');

const JwtStrategy = Jwt.Strategy;
const { ExtractJwt } = Jwt;

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

  // passport.use(new LocalStrategy(
  //   {
  //     usernameField: 'email',
  //     passwordField: 'password',
  //     session: false
  //   },
  //   (email, password, done) => {
  //     User.findOne({ email })
  //       .exec()
  //       .then((user) => {
  //         if (!user) {
  //           done(null, false);
  //         } else if (!user.verifyPassword(password)) {
  //           done(null);
  //         } else {
  //           done(null, user);
  //         }
  //       })
  //       .catch((error) => {
  //         done(error);
  //       });
  //   }
  // ));
  passport.use(new JwtStrategy(
    {
      secretOrKey: 'oi',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true
    },
    (jwtPayload, done) => {
      const email = jwtPayload.sub;
      User.findOne({ email })
        .exec()
        .then((user) => {
          if (!user) {
            done(null, false);
          } else {
            done(null, user);
          }
        })
        .catch((error) => {
          done(error, false);
        });
    }
  ));
};
