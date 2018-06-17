const sanitize = require('mongo-sanitize');

module.exports = (app) => {
  const Car = app.models.car;

  const controller = {};

  const CAR_PROJECTION = 'brand model year plate';

  // Display all cars on GET.
  controller.list = (req, res) =>
    Car.find({}, CAR_PROJECTION)
      .sort({ createdAt: 1 })
      .lean(true)
      .exec()
      .then((cars) => res.status(200).json(cars))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).end();
      });

  // Display detail page for a specific car on GET.
  controller.get = (req, res) => {
    const _id = sanitize(req.params.id);
    Car.findById(_id, CAR_PROJECTION)
      .lean(true)
      .exec()
      .then((car) => res.status(200).json(car))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Handle car create on POST.
  controller.add = (req, res) => {
    const {
      brand, model, year, plate
    } = req.body;
    const newCar = new Car({
      brand,
      model,
      year,
      plate
    });
    newCar
      .save()
      .then((car) => res.status(200).json(car))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Display car update form on PUT.
  controller.update = (req, res) => {
    const data = {
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      plate: req.body.plate
    };

    const _id = sanitize(req.params.id);

    Car.findOneAndUpdate({ _id }, data, { new: true })
      .lean(true)
      .exec()
      .then((car) => res.status(200).json(car))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Handle car delete on DELETE.
  controller.delete = (req, res) => {
    const _id = sanitize(req.params.id);
    Car.findByIdAndDelete(_id)
      .exec()
      .then(() => res.status(200).end())
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  return controller;
};
