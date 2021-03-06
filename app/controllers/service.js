const sanitize = require('mongo-sanitize');
const validator = require('validator');
const moment = require('moment');
let MileageController = require('./mileage');

module.exports = (app) => {
  const Car = app.models.car;
  const Service = app.models.service;
  MileageController = MileageController(app);

  const controller = {};

  const validateService = (
    updating,
    actualMileage,
    {
      mileage, expense, madeAt, description
    }
  ) => {
    let isValid = true;
    isValid = mileage && isValid ? mileage >= actualMileage : false || updating;
    isValid = expense && isValid ? expense >= 0 : isValid && updating;
    isValid =
      madeAt && isValid
        ? moment(madeAt).isBefore() || moment(madeAt).isSame()
        : isValid && updating;
    isValid =
      description && isValid
        ? !validator.isEmpty(description)
        : isValid && updating;
    return isValid;
  };

  const loggedUserHasCar = async (owner, carId) => {
    const car = await Car.findOne({ owner, _id: carId });
    return car != null;
  };

  controller.list = async (req, res) => {
    const { car } = req.query;
    try {
      const hasCar = await loggedUserHasCar(req.user._id, car);
      if (hasCar) {
        const services = await Service.find({ car });
        return res.status(200).json(services);
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
        const service = await Service.findOne({ _id, car });
        return res.status(200).json(service);
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
        const {
          madeAt = Date.now(),
          mileage,
          expense,
          place,
          description
        } = req.body;

        const actualMileage = (await Car.findOne({ _id: car }).exec()).odometer;

        if (
          !validateService(false, actualMileage, {
            mileage,
            expense,
            madeAt,
            description
          })
        ) {
          return res.status(500).json(new Error('Service invalid'));
        }

        const newService = new Service({
          madeAt,
          car,
          mileage,
          expense,
          place,
          description
        });

        const foundedCar = await Car.findOne({
          _id: car,
          owner: req.user._id
        }).exec();
        if (foundedCar.odometer <= mileage) {
          try {
            await MileageController.add(car, req.user._id, {
              createdAt: madeAt,
              kilometers: mileage
            });
            const service = await newService.save();
            return res.status(200).json(service);
          } catch (error) {
            console.log('Error:', error);
            return res.status(500).json(error);
          }
        } else {
          return res.status(500).end();
        }
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
        const {
          madeAt, expense, place, description
        } = req.body;

        const data = {};
        if (madeAt) data.madeAt = madeAt;
        if (expense) data.expense = expense;
        if (place) data.place = place;
        if (description) data.description = description;

        const actualMileage = (await Car.findOne({ _id: car }).exec()).odometer;

        if (!validateService(true, actualMileage, data)) {
          return res.status(500).json(new Error('Service invalid'));
        }

        const _id = sanitize(req.params.id);

        const service = await Service.findOneAndUpdate({ _id, car }, data, {
          new: true
        });
        return res.status(200).json(service);
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
        await Service.findOneAndDelete({ _id, car });
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
