module.exports = (app) => {
  const Car = app.models.car;

  const controller = {};

  // Display all cars on GET.
  controller.list = (req, res) => {
    res.send('NOT IMPLEMENTED: car list');
  };

  // Display detail page for a specific car on GET.
  controller.detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: car detail: ${req.params.id}`);
  };

  // Handle car create on POST.
  controller.create = (req, res) => {
    res.send('NOT IMPLEMENTED: car create POST');
  };

  // Handle car delete on DELETE.
  controller.delete = (req, res) => {
    res.send('NOT IMPLEMENTED: car delete DELETE');
  };

  // Display car update form on PUT.
  controller.update = (req, res) => {
    res.send('NOT IMPLEMENTED: car update PUT');
  };

  return controller;
};
