module.exports = (app) => {
  const controller = app.controllers.mileage;
  const permissionUtils = app.utils.permission;

  app.route('/mileage').get(permissionUtils.isLoggedIn, controller.list);

  app
    .route('/mileage/:id')
    .delete(permissionUtils.isLoggedIn, controller.delete);
};
