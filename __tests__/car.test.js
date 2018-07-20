const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../config/express')();
const passport = require('../config/passport');
const mongo = require('../config/database');

describe('CRUD /car/:id', () => {
  let token;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    passport();
    mongo(mongoUri || 'mongodb://localhost/road');

    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: 'eutenhoumviolaorosa'
      });
    token = response.body.token; // eslint-disable-line
    mongoose.connection.collections.cars.drop();
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });

  const car = {
    brand: 'Volkswagen',
    model: 'Gol',
    year: '2018',
    plate: 'XXX-1999',
    odometer: 10000
  };

  const car2 = {
    brand: 'Ford',
    model: 'Focus',
    year: '2018',
    plate: 'XXX-0000',
    odometer: 2
  };

  let carId;

  test('should accept and add a valid new car', async () => {
    const response = await request(app)
      .post('/car')
      .set('Authorization', `bearer ${token}`)
      .send(car);

    const response2 = await request(app)
      .post('/car')
      .set('Authorization', `bearer ${token}`)
      .send(car2);

    expect(response.status).toBe(200);
    expect(response2.status).toBe(200);
    carId = response.body._id;
  });

  test('should recover the first added car', async () => {
    const response = await request(app)
      .get(`/car/${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(response.body.brand).toBe(car.brand);
    expect(response.body.model).toBe(car.model);
    expect(response.body.year).toBe(car.year);
  });

  test('should list the added cars', async () => {
    const response = await request(app)
      .get('/car')
      .set('Authorization', `bearer ${token}`);
    expect(response.body).toHaveLength(2);
  });

  test('should update the first added car', async () => {
    const carU = {
      model: 'Golf'
    };
    const updatedCar = await request(app)
      .put(`/car/${carId}`)
      .set('Authorization', `bearer ${token}`)
      .send(carU);
    expect(updatedCar.statusCode).toBe(200);
    const response = await request(app)
      .get(`/car/${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(response.body.model).toBe(carU.model);
  });

  test('should delete the car', async () => {
    const deleteRes = await request(app)
      .delete(`/car/${carId}`)
      .set('Authorization', `bearer ${token}`);
    expect(deleteRes.status).toBe(200);
    const response = await request(app)
      .get('/car')
      .set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).not.toContain(car);
  });

  test('should reject post without brand, model, year, plate, odometer', () => {
    const badItems = [
      {
        brand: 'Volkswagen',
        model: 'Gol',
        year: '2018',
        plate: 'XXX-9999'
      },
      {
        model: 'Gol',
        year: '2018',
        odometer: 0
      },
      {
        brand: 'Volkswagen',
        model: 'Gol',
        odometer: 0
      }
    ];
    return Promise.all(badItems.map((badItem) =>
      request(app)
        .post('/car')
        .set('Authorization', `bearer ${token}`)
        .send(badItem)
        .then((res) => {
          expect(res.statusCode).toBe(500);
        })));
  });
});
