module.exports = (app) => {
  const controller = app.controllers.auth;
  const permissionUtils = app.utils.permission;

  app.route('/login').post(controller.login);
  app.route('/logout').post(permissionUtils.isLoggedIn, controller.logout);
};
