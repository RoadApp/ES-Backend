module.exports = (app) => {
  const router = app.Router();
  const carController = app.controller.carController;

  router.get('/car/create', carController.car_create_get);

  router.post('/car/create', carController.car_create_post);

  router.get('/car/:id/delete', carController.car_delete_get);

  router.post('/car/:id/delete', carController.car_delete_post);

  router.get('/car/:id/update', carController.car_update_get);

  router.post('/car/:id/update', carController.car_update_post);

  router.get('/car/:id', carController.car_detail);

  router.get('/cars', carController.car_list);
};
