const passport = require('passport');

module.exports = {
  isLoggedIn: passport.authenticate(
    'bearer',
    { session: false }
    // (error, user, info) => {
    //   console.log('error', error);
    //   console.log('user', user);
    //   console.log('info', info);
    // }
  )
};
