module.exports = (app) => {
  const controller = app.controllers.car;
  const permissionUtils = app.utils.permission;

  app
    .route('/car')
    .post(permissionUtils.isLoggedIn, controller.create)
    .get(permissionUtils.isLoggedIn, controller.list);

  app
    .route('/car/:id')
    .get(permissionUtils.isLoggedIn, controller.detail)
    .put(permissionUtils.isLoggedIn, controller.update)
    .delete(permissionUtils.isLoggedIn, controller.delete);
};
