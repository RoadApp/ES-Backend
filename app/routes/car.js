module.exports = (app) => {
  const controller = app.controllers.car;
  const permissionUtils = app.utils.permission;

  app
    .route('/car')
    .post(permissionUtils.isLoggedIn, controller.add)
    .get(permissionUtils.isLoggedIn, controller.list);

  app
    .route('/car/:id')
    .get(permissionUtils.isLoggedIn, controller.get)
    .put(permissionUtils.isLoggedIn, controller.update)
    .delete(permissionUtils.isLoggedIn, controller.delete);
};
