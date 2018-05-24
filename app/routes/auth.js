module.exports = (app) => {
  const controller = app.controllers.auth;

  app.route('/checkUser').post(controller.checkUser);
};
