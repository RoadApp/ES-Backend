module.carController = (app) => {
  const Car = app.models.car;

  const carController = {};

  carController.car_list = (req, res) => {
    res.send('NOT IMPLEMENTED: car list');
  };

  // Display detail page for a specific car.
  carController.car_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: car detail: ${req.params.id}`);
  };

  // Display car create form on GET.
  carController.car_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: car create GET');
  };

  // Handle car create on POST.
  carController.car_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: car create POST');
  };

  // Display car delete form on GET.
  carController.car_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: car delete GET');
  };

  // Handle car delete on POST.
  carController.car_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: car delete POST');
  };

  // Display car update form on GET.
  carController.car_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: car update GET');
  };

  // Handle car update on POST.
  carController.car_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: car update POST');
  };

  return carController;
};
