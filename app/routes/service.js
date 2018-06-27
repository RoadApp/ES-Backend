module.exports = (app) => {
  const controller = app.controllers.service;
  const permissionUtils = app.utils.permission;

  app
    .route('/service')
    .post(permissionUtils.isLoggedIn, controller.add)
    .get(permissionUtils.isLoggedIn, controller.list);

  app
    .route('/service/:id')
    .get(permissionUtils.isLoggedIn, controller.get)
    .put(permissionUtils.isLoggedIn, controller.update)
    .delete(permissionUtils.isLoggedIn, controller.delete);
};
