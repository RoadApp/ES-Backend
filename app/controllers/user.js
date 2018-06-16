const sanitize = require('mongo-sanitize');

module.exports = (app) => {
  const User = app.models.user;

  const controller = {};

  controller.list = (req, res) => {
    User.find({}, 'fullName email cars')
      .sort({ fullName: 1 })
      .lean(true)
      .exec((error, users) => {
        if (error) {
          console.log(`error: ${error}`);
          res.status(500).json(error);
        }
        res.status(200).json(users);
      });
  };

  controller.get = (req, res) => {
    const _id = sanitize(req.params.id);
    User.findOne({ _id })
      .lean(true)
      .exec((error, user) => {
        if (error) {
          console.log(`error: ${error}`);
          res.status(500).json(error);
        }
        res.status(200).json(user);
      });
  };

  controller.add = (req, res) => {
    const newUser = new User();
    newUser.fullName = req.body.fullName;
    newUser.email = req.body.email;
    newUser.password = newUser.generateHash(req.body.password);
    newUser.save((error, user) => {
      if (error) {
        console.log(`error: ${error}`);
        res.status(500).json(error);
      }
      res.status(201).json(user);
    });
  };

  controller.update = (req, res) => {
    const data = {};
    data.fullName = req.body.fullName;
    data.email = req.body.email;

    const _id = sanitize(req.params.id);
    User.findOneAndUpdate({ _id }, data, { new: true })
      .lean(true)
      .exec((error, user) => {
        if (error) {
          console.log(`error: ${error}`);
          res.status(500).json(error);
        }
        res.status(200).json(user);
      });
  };

  controller.delete = (req, res) => {
    const _id = sanitize(req.params.id);

    User.findOneAndUpdate({ _id }, { new: true })
      .lean(true)
      .exec((error) => {
        if (error) {
          console.log(`error: ${error}`);
          res.status(500).json(error);
        }
        res.status(200).end();
      });
  };

  controller.changePassword = (req, res) => {
    const { _id } = req.user;
    User.findOne({ _id }).exec((error, user) => {
      if (error) {
        console.log(`error: ${error}`);
        res.status(500).json(error);
      }
      if (user.validPassword(req.body.old_password)) {
        const data = {};
        data.password = user.generateHash(req.body.password);

        User.findOneAndUpdate({ _id }, data, { new: false })
          .lean(true)
          .exec((err) => {
            if (err) {
              console.log(`error: ${err}`);
              res.status(500).json(err);
            }
            res.status(200).end();
          });
      } else {
        res.status(500).end();
      }
    });
  };

  return controller;
};
