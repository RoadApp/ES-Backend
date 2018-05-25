module.exports = (app) => {
  const Car = app.models.car;

  const controller = {};

  // Display all cars on GET.
  controller.list = () =>
    Car.find();

  // Display detail page for a specific car on GET.
  controller.detail = (id) =>
    Car.findById(id).exec();

  // Handle car create on POST.
  controller.create = (brand, model, year, plate) => {
    const car = new Car({
      brand, model, year, plate
    });
    return car.save();
  };

  // Handle car delete on DELETE.
  controller.delete = (id) =>
    Car.findByIdAndRemove(id);

  // Display car update form on PUT.
  controller.update = (id, brand) =>
    Car.findByIdAndUpdate(id, { $set: { brand } });


  return controller;
};
