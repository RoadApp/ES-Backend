const request = require('supertest');

const app = require('../config/express')();
const passport = require('../config/passport');
const mongo = require('../config/database');

let db;

describe('auth', () => {
  let token;

  beforeAll(() => {
    passport();
    db = mongo(process.env.MONGODB_URI || 'mongodb://localhost/road');
  });

  afterAll((done) => {
    db.disconnect(done);
  });

  test('Test login with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: 'eutenhoumviolaorosa'
      });
    expect(response.status).toBe(200);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user).toHaveProperty('token');
    expect(user.token).toBeDefined();
    expect(user.token).not.toBe('');
    token = user.token; // eslint-disable-line
  });

  test('Test logout', async () => {
    const response = await request(app)
      .post('/logout')
      .set('Authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
