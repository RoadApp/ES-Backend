module.exports = (app) => {
  const User = app.models.user;

  const controller = {};

  /**
   * Creates an user.
   * @param {String} firebaseUid Firebase UId of a valid user.
   * @param {String} fullName Full name of an user.
   * @return {Promise} Creation promise of an user
   */
  const createUser = (firebaseUid, fullName) => {
    const user = new User({ firebaseUid, fullName });
    return user.save();
  };

  /**
   * Checks if an user exists in DB.
   * @param {String} firebaseUid Firebase UId of a valid user.
   * @return {Promise} Checking Promise of an user.
   */
  const checkIfUserExists = (firebaseUid) =>
    User.findOne({ firebaseUid }).exec();

  /**
   * This function checks if a user exists in DB. If yes, return it.
   * If not, creates one, and return it. Responds with an error status
   * 500 if it's not possible to find or create a user.
   * @param {Object} req Request object of a method POST. Request must have
   * the Firebase UId of an user (firebaseUid), and its full name (fullName)
   * @param {Object} res Response object of a route
   */
  controller.checkUser = (req, res) => {
    const firebaseUid = req.body.uId;

    checkIfUserExists(firebaseUid)
      .then((findedUser) => {
        if (findedUser) {
          res.json(findedUser);
        } else {
          createUser(firebaseUid, req.body.fullName)
            .then((createdUser) => {
              res.json(createdUser);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json('impossible add user.');
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json('impossible find user.');
      });
  };

  return controller;
};
