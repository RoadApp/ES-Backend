module.exports = (app) => {
  const User = app.models.user;

  const controller = {};

  controller.login = (req, res) => {
    User.find().then((result) => {
      if (result && result.length) {
        console.log('users', result);
        res.json('ooaá, make login.');
      } else {
        res.json('so, signup');
      }
    });
  };

  return controller;
};
