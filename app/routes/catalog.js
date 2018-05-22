module.exports = (app) => {
  const controller = app.controller.car;

  app.route('/car')
    .post(controller.create)
    .get(controller.list);

  app.route('/car/:id')
    .get(controller.detail)
    .put(controller.update)
    .delete(controller.delete);
};
