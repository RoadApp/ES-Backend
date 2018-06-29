const app = require('./config/express')();

beforeAll(() => {
    require('./config/passport')();
    require('./config/database')('mongodb://localhost/road');
});

describe('POST /car - create new car', () => {
    let user = {
        createdAt: Date.now,
        fullName: "John Doe",
        birthDate: new Date(1997, 03, 03),
        cnhExpiration: new Date(2020, 03, 03),
        email: "john@mail.com",
        password: "john123"
    }
    let car = {
        createdAt: Date.now,
        owner: user,
        brand: "Volkswagen",
        model: "Gol",
        year: "2018",
        plate: "XXX-9999",
        odometer: 0
    };
    it('should accept and add a valid new item', () => {
      return request(app).post('/car')
      .send(car)
      .then((res) => {
        expect(res.body.status).toBe(200);
        expect(res.body.message).toBe('Success!');
        return request(app).get('/car');
      })
    });
    it('should reject post without owner, brand, or plate', () => {
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
          expect(res.body.status).toBe(400);
          expect(res.body.message.startsWith('Bad Request')).toBe(true);
        });
      }));
    });
});
