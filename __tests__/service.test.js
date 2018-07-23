const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../config/express')();
const passport = require('../config/passport');
const mongo = require('../config/database');

const {
  models: { service: Service, car: Car }
} = app;

describe('CRUD /service/:id', () => {
  let token;
  let carId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    passport();
    mongo(mongoUri || 'mongodb://localhost/road');
    await request(app)
      .post('/user')
      .send({
        fullName: 'Admin Example',
        birthDate: new Date(1997, 3, 3),
        cnhExpiration: new Date(2020, 3, 3),
        email: 'admin@email.com',
        password: 'eutenhoumviolaorosa'
      });
    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: 'eutenhoumviolaorosa'
      });
    token = response.body.token; // eslint-disable-line
    await Car.remove({}).exec();
    await Service.remove({}).exec();
    const newCar = await new Car({
      owner: response.body._id,
      model: 'Classic',
      brand: 'Chevrolet',
      year: '2016',
      plate: 'PGY-2222',
      odometer: '50000'
    }).save();
    carId = newCar._id;
  });

  afterAll((done) => {
    Service.remove({})
      .exec()
      .then(() => {
        mongoose.disconnect(done);
      });
  });

  const service1 = {
    mileage: 60000,
    description: 'Revisão',
    expense: 500,
    place: 'Caruaru/PE'
  };

  const service2 = {
    mileage: 60500,
    description: 'Calibragem de pneus',
    expense: 30,
    madeAt: new Date(2018, 6, 21)
  };

  let serviceId;

  test('should accept and add a valid new service', async () => {
    const response1 = await request(app)
      .post(`/service?car=${carId}`)
      .set('Authorization', `bearer ${token}`)
      .send(service1);

    const response2 = await request(app)
      .post(`/service?car=${carId}`)
      .set('Authorization', `bearer ${token}`)
      .send(service2);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    serviceId = response1.body._id;
  });

  test('should recover the first added service', async () => {
    const response = await request(app)
      .get(`/service/${serviceId}?car=${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(response.body.mileage).toBe(service1.mileage);
    expect(response.body.place).toBe(service1.place);
    expect(response.body.description).toBe(service1.description);
    expect(response.body.expense).toBe(service1.expense);
  });

  test('should list the added services', async () => {
    const response = await request(app)
      .get(`/service?car=${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(response.body).toHaveLength(2);
  });

  test('should update the first added service', async () => {
    const serviceU = {
      expense: 600,
      place: 'Campina Grande/PB'
    };
    const updatedService = await request(app)
      .put(`/service/${serviceId}?car=${carId}`)
      .set('Authorization', `bearer ${token}`)
      .send(serviceU);
    expect(updatedService.statusCode).toBe(200);
    const response = await request(app)
      .get(`/service/${serviceId}?car=${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(response.body.expense).toBe(serviceU.expense);
    expect(response.body.place).toBe(serviceU.place);
  });

  test('should delete the service', async () => {
    const deleteRes = await request(app)
      .delete(`/service/${serviceId}?car=${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(deleteRes.status).toBe(200);
    const response = await request(app)
      .get(`/service?car=${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).not.toContain(service1);
  });

  test('should reject post without mileage, expense, description', () => {
    const badItems = [
      {
        description: 'Revisão',
        expense: 500,
        place: 'Caruaru/PE'
      },
      {
        mileage: 60000,
        description: 'Revisão',
        place: 'Caruaru/PE'
      },
      {
        mileage: 60000,
        expense: 500,
        place: 'Caruaru/PE',
        madeAt: new Date(2018, 6, 2)
      }
    ];
    return Promise.all(badItems.map((badItem) =>
      request(app)
        .post(`/service?car=${carId}`)
        .set('Authorization', `bearer ${token}`)
        .send(badItem)
        .then((res) => {
          expect(res.statusCode).toBe(500);
        })));
  });
});
