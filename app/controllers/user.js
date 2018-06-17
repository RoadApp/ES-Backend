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
          return res.status(500).json(error);
        }
        return res.status(200).json(users);
      });
  };

  controller.get = (req, res) => {
    const _id = sanitize(req.params.id);
    User.findOne({ _id })
      .lean(true)
      .exec((error, user) => {
        if (error) {
          console.log(`error: ${error}`);
          return res.status(500).json(error);
        }
        return res.status(200).json(user);
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
        const errorToReturn = {};
        if (error.code === 1100) {
          errorToReturn.message = 'Já existe um usuário com esse email.';
        } else {
          errorToReturn.message =
            'Não foi possível criar usuário. Consulte um desenvolvedor do app.';
        }
        return res.status(500).json(errorToReturn);
      }

      const userReturn = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        token: user.token
      };
      return res.status(201).json(userReturn);
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
          return res.status(500).json(error);
        }
        return res.status(200).json(user);
      });
  };

  controller.delete = (req, res) => {
    const _id = sanitize(req.params.id);

    User.findByIdAndDelete(_id).exec((error) => {
      if (error) {
        console.log(`error: ${error}`);
        return res.status(500).json(error);
      }
      return res.status(200).end();
    });
  };

  controller.changePassword = (req, res) => {
    const { _id } = req.user;
    User.findOne({ _id })
      .exec()
      .then((user) => {
        if (user.verifyPassword(req.body.oldPassword)) {
          const data = {};
          data.password = user.generateHash(req.body.password);

          User.findOneAndUpdate({ _id }, data, { new: false })
            .lean(true)
            .exec((err) => {
              if (err) {
                console.log(`error: ${err}`);
                return res.status(500).json(err);
              }
              return res.status(200).end();
            });
        } else {
          return res.status(500).end();
        }
      })
      .catch((error) => {
        console.log(`error: ${error}`);
        return res.status(500).json(error);
      });
  };

  return controller;
};
