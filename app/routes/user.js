module.exports = (app) => {
  const controller = app.controllers.user;
  const permissionUtils = app.utils.permission;

  app.route('/user').post(controller.add);

  app
    .route('/user/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(permissionUtils.isLoggedIn, controller.delete);

  app
    .route('/changePassword')
    .post(permissionUtils.isLoggedIn, controller.changePassword);
};
