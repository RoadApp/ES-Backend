module.exports = (app) => {
  const controller = app.controllers.auth;

  app.route('/login').get(controller.login); // has to be post
};
