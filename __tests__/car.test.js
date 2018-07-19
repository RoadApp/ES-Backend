const app = require('../config/express')();
const mongoose = require('mongoose');
const request = require('supertest');
const Car = app.models.car;

let token = "";

beforeAll(async () => {
    let mongoUri = process.env.MONGODB_URI;

    require('../config/passport')();
    require('../config/database')(mongoUri || 'mongodb://localhost/road');

    const response = await request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: 'eutenhoumviolaorosa'
      });
    const user = response.body;
    token = user.token;

    mongoose.connection.collections["cars"].drop();
});

afterAll((done) => {
    mongoose.disconnect(done);
});


describe('CRUD /car/:id', () => {

    const user = {
        _id: "test",
        createdAt: Date.now,
        fullName: "John Doe",
        birthDate: new Date(1997, 3, 3),
        cnhExpiration: new Date(2020, 3, 3),
        email: "john@mail.com",
        password: "john123"
    };

    const car = {
        createdAt: Date.now,
        owner: user,
        brand: "Volkswagen",
        model: "Gol",
        year: "2018",
        plate: "XXX-1999",
        odometer: 10000
    };

    const car2 = {
        createdAt: Date.now,
        owner: user,
        brand: "Ford",
        model: "Focus",
        year: "2018",
        plate: "XXX-0000",
        odometer: 2       
    };

    let carId;

    test('should accept and add a valid new car', async () => {
        const response = await request(app)
            .post("/car")
            .set('Authorization', `bearer ${token}`)
            .send(car);
        
        const response2 = await request(app)
            .post("/car")
            .set('Authorization', `bearer ${token}`)
            .send(car2);
       
        expect(response.status).toBe(200); 
        expect(response2.status).toBe(200);        
        carId = response.body._id;            
    });

    
    test('should recover the first added car', async () => {
        const response = await request(app)
            .get("/car/" + carId)
            .set('Authorization', `bearer ${token}`);
        expect(response.body.brand).toBe(car.brand);            
        expect(response.body.model).toBe(car.model);
        expect(response.body.year).toBe(car.year);
    });

    test('should list the added cars', async () => {
        const response = await request(app)
            .get("/car")
            .set('Authorization', `bearer ${token}`);
        expect(response.body).toHaveLength(2);
            
    });

    test('should update the first added car', async () => {
        const carU = {
            model: "Golf"
        };
        const updatedCar = await request(app)
            .put("/car/" + carId)
            .set('Authorization', `bearer ${token}`)
            .send(carU)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            });
        const response = await request(app)
            .get("/car/" + carId)
            .set('Authorization', `bearer ${token}`);
        expect(response.body.model).toBe(carU.model);
            
    });
    
    test('should delete the car', async () => {
        await request(app)
            .delete("/car/" + carId)
            .set('Authorization', `bearer ${token}`);   
        const response = await request(app)
            .get("/car")
            .set('Authorization', `bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).not.toContain(car);
            
    });
 
    test('should reject post without owner, brand, or plate', () => {
      let badItems = [
        {
            createdAt: Date.now,
            brand: "Volkswagen",
            model: "Gol",
            year: "2018",
            plate: "XXX-9999"
        },
        {
            createdAt: Date.now,
            owner: user,
            model: "Gol",
            year: "2018",
            odometer: 0
        },
        {
            createdAt: Date.now,
            owner: user,
            brand: "Volkswagen",
            model: "Gol",
            odometer: 0
        }
      ];
      return Promise.all(badItems.map(badItem => {
        return request(app)
            .post('/car')
            .set('Authorization', `bearer ${token}`)
            .send(badItem)
            .then((res) => {
                expect(res.statusCode).toBe(500);
            });
      }));
    });
});
