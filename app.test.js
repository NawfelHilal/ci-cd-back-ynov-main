const request = require("supertest")
const app = require("./app")
const mockingoose = require('mockingoose');
const model = require('./model/user');
require("dotenv").config();
beforeEach(() => {
    mockingoose.resetAll();
  });
describe('GET /users', function () {

    it('responds with json', async function () {
        const _doc = [{
            _id: '507f191e810c19729de860ea',
            name: 'name',
            email: 'name@email.com',
          }];
      
        mockingoose(model).toReturn(_doc, 'find');

        const response = await request(app)
            .get('/users')
            .set('Accept', 'application/json')
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ "utilisateurs": _doc });
    });


    it('responds empty array with json', async function () {
        mockingoose(model).toReturn([], 'find');

        const response = await request(app)
            .get('/users')
            .set('Accept', 'application/json')
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ "utilisateurs": [] });
    });



    it('responds throw an error', async function () {
        try {
            mockingoose(model).toReturn(new Error('something wrong'));
        } catch(e) {
            const response = await request(app)
                .get('/users')
                .set('Accept', 'application/json')
            expect(response).toThrow("something wrong");
        }
        
    });
});

describe('POST /users', function () {

    it('responds with json', async function () {
        const _doc = {
            name: 'name',
            email: 'name@email.com',
          };
      
        mockingoose(model).toReturn(_doc, 'save');

        const response = await request(app)
            .post('/users')
            .send(_doc)
            .set('Accept', 'application/json')
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(_doc);
    });



    it('responds throw an error', async function () {
        mockingoose(model).toReturn(new Error('something'), 'save');
        const response = await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        expect(response.status).toEqual(500);
        expect(response.body).toEqual({error: 'something'});
    });
});