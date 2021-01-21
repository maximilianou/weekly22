import faker from 'faker';
import request from 'supertest';
import {Express} from 'express-serve-static-core';
import db from '@exmpl/utils/db';
import {createServer} from '@exmpl/utils/server';

let server: Express;
beforeAll(async () => {
  await db.open();
  server = await createServer();
});
afterAll(async () => {
  await db.close();
  // server kill signal
});

describe('POST /api/v1/users', () => {
  it('should return 201 and valid response for valid user', async (done) => {
    request(server)
      .post(`/api/v1/users`)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName(),
      })
      .expect(201)
      .end( function(err, res){
        if(err) return done(err);
        expect(res.body).toMatchObject({
          userId: expect.stringMatching(/^[a-z0-9]{24}/)
        });
        done();
      });
  });
  it('should return 409 and valid response for duplicate', async (done) => {
    const data = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.firstName()
    };
    request(server)
      .post(`/api/v1/users`)
      .send(data)
      .expect(201)
      .end(function(err, res){
        if(err) return done(err);
        request(server)
          .post(`/api/v1/users`)
          .send(data)
          .expect(409)
          .end(function(err, res){
            if(err) return done(err);
            expect(res.body).toMatchObject({
              error: {
                type: 'account_already_exists',
                message: expect.stringMatching(/already exists/)
              }
            })
            done();
          });
      });
  });
  it('should return 400 and valid response for invalid request', async (done) => {
    request(server)
      .post(`/api/v1/users`)
      .send({
        mail: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName(),
      })
      .expect(400)
      .end(function(err, res){
        if(err) return done(err);
        expect(res.body).toMatchObject({
          error: {
            type: 'request_validation',
            message: expect.stringMatching(/email/),
          }
        })
        done();
      });
  });
});