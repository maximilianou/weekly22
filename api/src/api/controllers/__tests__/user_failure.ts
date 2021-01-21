import request from 'supertest';
import {Express} from 'express-serve-static-core';

import {createServer} from '@exmpl/utils/server';

import { mocked } from 'ts-jest/utils';
import UserService, { AuthResponse } from '@exmpl/api/services/user';

import faker from 'faker';

let server: Express;
beforeAll( async () => {
  server = await createServer();
});

describe('auth failure', () => {
  it('sould return 500 and valid response if auth reject', async (done) => {
    const MockedUserService = mocked(UserService, true);
    MockedUserService.auth = jest.fn().mockRejectedValue(new Error());
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', 'Bearer fakeToken')
      .expect(500)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).toMatchObject({error: {
          type: 'internal_server_error', 
          message: 'Internal Server Error'
        }});
        done();
      });
  });
}); 

describe('createUser failure', () =>{
  it('should return 500 and valid response if auth rejects with an error', async (done) => {
    const MockedUserService = mocked(UserService, true);
    MockedUserService.createUser = jest.fn().mockResolvedValue({error: {type: 'unknown'}});
    request(server)
      .post(`/api/v1/users`)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName()
      })
      .expect(500)
      .end( (err, res) => {
        if(err) return done(err);
        expect(res.body).toMatchObject({error: {
          type: 'internal_server_error',
          message: 'Internal Server Error'}});
        done();
      });
  });
});