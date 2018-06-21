const sanitize = require('mongo-sanitize');
const validator = require('validator');

module.exports = (app) => {
  const User = app.models.user;
  const Car = app.models.car;

  const controller = {};

  /**
   * Make an user object without unnecessary properties (e.g. mongo attributes)
   * @param {*} user mongoose object of user
   * @return {Object} lean user
   */
  const makeReturnedUser = (user) => {
    const userReturn = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      token: user.token,
      cars: user.cars
    };

    return userReturn;
  };

  /**
   * Check if an user (or its props) is valid or not.
   * @param {boolean} updating if it's updating or not; if not, email
   * and password are ignored
   * @param {object} user object that contains fullName, email and/or password
   */
  const validateUser = (updating, { fullName, email, password }) => {
    // console.log(validator.isEmail(email));
    let isValid = true;
    isValid = fullName && isValid ? fullName.length >= 5 : updating;
    if (!updating) {
      isValid = email && isValid ? validator.isEmail(email) : false;
      isValid = password && isValid ? password.trim().length >= 6 : false;
    }
    return isValid;
  };

  /**
   * List all users
   * @param {*} req
   * @param {*} res
   * @return {Array} users
   */
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

  /**
   * Return an user with id passed in params
   * @param {*} req
   * @param {*} res
   * @return {Object} user
   */
  controller.get = (req, res) => {
    const _id = sanitize(req.params.id);
    if (_id !== req.user._id) {
      return res.status(403).end();
    }
    User.findOne({ _id })
      .lean(true)
      .exec((error, user) => {
        if (error) {
          console.log(`error: ${error}`);
          return res.status(500).json(error);
        }
        return res.status(200).json(makeReturnedUser(user));
      });
  };

  /**
   * Add an user with passed properties
   * @param {*} req
   * @param {*} res
   * @return {Object} user
   */
  controller.add = (req, res) => {
    const { fullName, email, password } = req.body;
    if (!validateUser(false, { fullName, email, password })) {
      return res.status(500).json(new Error('User invalid'));
    }
    const newUser = new User();
    newUser.fullName = fullName;
    newUser.email = email;
    newUser.password = newUser.generateHash(password);
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

      return res.status(201).json(makeReturnedUser(user));
    });
  };

  /**
   * Update user that has the _id passed in params
   * @param {*} req
   * @param {*} res
   * @return {Object} user updated
   */
  controller.update = (req, res) => {
    const data = {};
    data.fullName = req.body.fullName;

    if (!validateUser(true, data)) {
      return res.status(500).json(new Error('User invalid'));
    }

    const _id = sanitize(req.params.id);

    if (_id !== `${req.user._id}`) {
      return res.status(403).end();
    }

    User.findOneAndUpdate({ _id }, data, { new: true })
      .lean(true)
      .exec((error, user) => {
        if (error) {
          console.log(`error: ${error}`);
          return res.status(500).json(error);
        }
        return res.status(200).json(makeReturnedUser(user));
      });
  };

  /**
   * Delete an user that has _id passed in params
   * @param {*} req
   * @param {*} res
   */
  controller.delete = (req, res) => {
    const _id = sanitize(req.params.id);
    console.log(typeof _id, typeof `${req.user._id}`);

    if (_id !== `${req.user._id}`) {
      return res.status(401).end();
    }

    User.findByIdAndDelete(_id).exec((error) => {
      if (error) {
        console.log(`error: ${error}`);
        return res.status(500).json(error);
      }
      Car.deleteMany({ owner: _id })
        .exec()
        .then(() => res.status(200).end())
        .catch((err) => {
          console.log(`error: ${err}`);
          return res.status(500).json(err);
        });
    });
  };

  /**
   * Change password of logged user
   * @param {*} req
   * @param {*} res
   */
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
