module.exports = (app) => {
  const controller = app.controllers.auth;

  app.route('/login').post(controller.login);
  app.route('/logout').post(controller.logout);
};
