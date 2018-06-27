const sanitize = require('mongo-sanitize');
// const validator = require('validator');

module.exports = (app) => {
  const Car = app.models.car;
  const Mileage = app.models.mileage;

  const controller = {};

  const loggedUserHasCar = async (owner, carId) => {
    const car = await Car.findOne({ owner, _id: carId });
    console.log(car);
    return car != null;
  };

  // const Mileage_PROJECTION = 'owner brand model year plate, odometer';

  controller.list = async (req, res) => {
    const { car } = req.query;
    try {
      const hasCar = await loggedUserHasCar(req.user._id, car);
      if (hasCar) {
        const mileages = await Mileage.find({ car });
        return res.status(200).json(mileages);
      }
      return res.status(403).end();
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json(error);
    }
  };

  controller.get = async (req, res) => {
    const { car } = req.query;
    const _id = sanitize(req.params.id);
    try {
      const hasCar = await loggedUserHasCar(req.user._id, car);
      if (hasCar) {
        const mileage = await Mileage.findOne({ _id, car });
        return res.status(200).json(mileage);
      }
      return res.status(403).end();
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json(error);
    }
  };

  controller.add = async (req, res) => {
    const { car } = req.query;
    try {
      const hasCar = await loggedUserHasCar(req.user._id, car);
      if (hasCar) {
        const { createdAt, kilometers } = req.body;

        const newMileage = new Mileage({
          createdAt,
          car,
          kilometers
        });

        const mileage = await newMileage.save();
        return res.status(200).json(mileage);
      }
      return res.status(403).end();
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json(error);
    }
  };

  controller.update = async (req, res) => {
    const { car } = req.query;
    try {
      const hasCar = await loggedUserHasCar(req.user._id, car);
      if (hasCar) {
        const { createdAt, kilometers } = req.body;

        const data = {};
        if (createdAt) data.createdAt = createdAt;
        if (kilometers) data.kilometers = kilometers;

        const _id = sanitize(req.params.id);

        const mileage = await Mileage.findOneAndUpdate({ _id, car }, data, {
          new: true
        });
        return res.status(200).json(mileage);
      }
      return res.status(403).end();
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json(error);
    }
  };

  controller.delete = async (req, res) => {
    const { car } = req.query;
    const _id = sanitize(req.params.id);
    try {
      const hasCar = await loggedUserHasCar(req.user._id, car);
      if (hasCar) {
        await Mileage.findOneAndDelete({ _id, car });
        return res.status(200).end();
      }
      return res.status(403).end();
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json(error);
    }
  };

  return controller;
};
