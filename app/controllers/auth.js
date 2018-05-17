module.exports = (app) => {
  const User = app.models.user;

  const controller = {};

  controller.login = (req, res) => {
    User.find().then((result) => {
      if (result) {
        console.log(result);
        res.json('ooa, make login.');
      } else {
        res.json('so, signup');
      }
    });
  };

  return controller;
};
