const sanitize = require('mongo-sanitize');

module.exports = (app) => {
  const Car = app.models.car;
  const Mileage = app.models.mileage;
  const Exception = app.utils.exception.GeneralException;

  const controller = {};

  const loggedUserHasCar = async (owner, carId) => {
    const car = await Car.findOne({ owner, _id: carId });
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
      return req.status(403).end();
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json(error);
    }
  };

  controller.add = async (
    car,
    userId,
    { createdAt = Date.now(), kilometers }
  ) => {
    try {
      const hasCar = await loggedUserHasCar(userId, car);
      if (hasCar) {
        const newMileage = new Mileage({
          createdAt,
          car,
          kilometers
        });

        const mileage = await newMileage.save();
        return mileage;
      }
      throw Exception(403, "User doesn't have car passed.");
    } catch (error) {
      console.log('Error:', error);
      throw error;
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
