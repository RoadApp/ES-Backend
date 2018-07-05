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
        user: user,
        body: {
            createdAt: Date.now,
            brand: "Volkswagen",
            model: "Gol",
            year: "2018",
            plate: "XXX-9999",
            odometer: 10000
        }       
    };

    const car2 = {
        user: user,
        body: {
            createdAt: Date.now,
            brand: "Ford",
            model: "Focus",
            year: "2018",
            plate: "XXX-0000",
        }       
    };

    const carId = "";

    test('should accept and add a valid new item', async () => {
        const addedCar = await request(app)
            .post("/car")
            .send(car)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            });
        carId = addedCar._id;            
    });

    test('verify default odometer value', async () => {
        const addedCar = await request(app)
            .post("/car")
            .send(car2)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            });
        expect(addedCar.odometer).toBe(0);            
    });
    
    test('should recover the first added car', async () => {
        const response = request(app).get("/car/" + carId);
        expect(response.plate).toBe(car.body.plate)
            
    });

    test('should list the added cars', async () => {
        const response = request(app).get("/car");
        expect(response).toHaveLength(2);
            
    });

    test('should update the first added car', async () => {
        const carU = {
            user: user,
            body: { plate: "XXX-8888" }
        };
        const updatedCar = await request(app)
            .put("/car" + carId)
            .send(carU)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            });
        expect(updatedCar.plate).toBe(carU.body.plate);
            
    });
    
    test('should delete the car', async () => {
        await request(app).delete("/car/" + carId);
        const response = request(app).get("/car");
        expect(response).toBe({});
            
    });
 
    test('should reject post without owner, brand, or plate', () => {
      let badItems = [
        {
            createdAt: Date.now,
            brand: "Volkswagen",
            model: "Gol",
            year: "2018",
            plate: "XXX-9999",
            odometer: 0
        },
        {
            createdAt: Date.now,
            owner: user,
            model: "Gol",
            year: "2018",
            plate: "XXX-9999",
            odometer: 0
        },
        {
            createdAt: Date.now,
            owner: user,
            brand: "Volkswagen",
            model: "Gol",
            year: "2018",
            odometer: 0
        }
      ];
      return Promise.all(badItems.map(badItem => {
        return request(app).post('/car')
        .send(badItem)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.statusMessage.startsWith('Bad Request')).toBe(true);
        });
      }));
    });
});
