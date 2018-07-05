const app = require('../config/express')();
const mongoose = require('mongoose');
const request = require('supertest');

let token = "";

beforeAll(() => {
    let mongoUri = process.env.MONGODB_URI;

    require('../config/passport')();
    require('../config/database')(mongoUri || 'mongodb://localhost/road');

    // TO DO LOGIN & token UPDATE
    // token = something

});

afterAll((done) => {
    mongoose.disconnect(done);
});


describe('CRUD /user/:id', () => {

    const user1 = {
        _id: "test1",
        createdAt: Date.now,
        fullName: "John Doe",
        birthDate: new Date(1997, 3, 3),
        cnhExpiration: new Date(2020, 3, 3),
        email: "john@mail.com",
        password: "john123"
    };

    const user2 = {
        _id: "test2",
        createdAt: Date.now,
        fullName: "Joseph Doe",
        birthDate: new Date(1995, 9, 12),
        cnhExpiration: new Date(2020, 5, 6),
        email: "joseph@mail.com",
        password: "joseph123"
    };

    test('should accept and add a valid new user', async () => {
        await request(app)
            .post("/user")
            .send(user1)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            });
    });

    test('should recover the first added user', async () => {
        const response = await request(app).get("/user/" + user1._id);
        expect(response.fullName).toBe(user1.fullName)
            
    });

    test('should list the added users', async () => {
        const response = await request(app).get("/car");
        expect(response).toHaveLength(2);
            
    });

    test('should update the first added user', async () => {
        const userU = {
            fullName: "João Doe"
        };
        const updatedCar = await request(app)
            .put("/user/" + user1._id)
            .send(userU)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            });
        expect(updatedCar.fullName).toBe(userU.fullName);
            
    });
    
 
    test('should reject user without fullName, birthDate, email or password', () => {
      let badItems = [
        {
            _id: "test1",
            createdAt: Date.now,
            birthDate: new Date(1997, 3, 3),
            cnhExpiration: new Date(2020, 3, 3),
            email: "john@mail.com",
            password: "john123"
        },
        {
            _id: "test1",
            createdAt: Date.now,
            fullName: "John Doe",
            cnhExpiration: new Date(2020, 3, 3),
            email: "john@mail.com",
            password: "john123"
        },
        {
            _id: "test1",
            createdAt: Date.now,
            fullName: "John Doe",
            birthDate: new Date(1997, 3, 3),
            cnhExpiration: new Date(2020, 3, 3),
            password: "john123"
        },
        {
            _id: "test1",
            createdAt: Date.now,
            fullName: "John Doe",
            birthDate: new Date(1997, 3, 3),
            cnhExpiration: new Date(2020, 3, 3),
            email: "john@mail.com"
        }
      ];
      return Promise.all(badItems.map(badItem => {
        return request(app).post('/user')
        .send(badItem)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.statusMessage.startsWith('Bad Request')).toBe(true);
        });
      }));
    });
});
