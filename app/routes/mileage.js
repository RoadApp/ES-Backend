module.exports = (app) => {
  const controller = app.controllers.mileage;
  const permissionUtils = app.utils.permission;

  app
    .route('/mileage')
    .post(permissionUtils.isLoggedIn, controller.add)
    .get(permissionUtils.isLoggedIn, controller.list);

  app
    .route('/mileage/:id')
    .get(permissionUtils.isLoggedIn, controller.get)
    .put(permissionUtils.isLoggedIn, controller.update)
    .delete(permissionUtils.isLoggedIn, controller.delete);
};
