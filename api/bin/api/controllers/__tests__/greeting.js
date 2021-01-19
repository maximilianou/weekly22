"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("@exmpl/utils/server");
let server;
beforeAll(async () => {
    server = await server_1.createServer();
});
describe('GET /hello', () => {
    it('should return 200 and valid response when param list is empty', async (done) => {
        supertest_1.default(server)
            .get(`/api/v1/hello`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ 'message': 'Hello, stranger!' });
            done();
        });
    });
    it('should return 200 and valid response when name param is set', async (done) => {
        const nameParam = 'MaximilianoTestName';
        supertest_1.default(server)
            .get(`/api/v1/hello?name=${nameParam}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ 'message': `Hello, ${nameParam}!` });
            done();
        });
    });
    it('should return 400 and valid error response when param is empty', async (done) => {
        supertest_1.default(server)
            .get(`/api/v1/hello?name=`)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ 'error': {
                    type: 'request_validation',
                    message: expect.stringMatching(/Empty.*\'name\'/),
                    errors: expect.anything()
                } });
            done();
        });
    });
});
describe('GET /goodbye', () => {
    it('should return 200 and valid response to authorization with fakeToken request', async (done) => {
        supertest_1.default(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', 'Bearer fakeToken')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ 'message': 'Goodbye, fakeTokenId!' });
            done();
        });
    });
    it('shourd return 401 and valid error response to invalid auth token', async (done) => {
        supertest_1.default(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', 'Bearer invalidFakeToken')
            .expect(401)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ error: { type: 'unauthorized', message: 'Authorization Failed' } });
            done();
        });
    });
    it('should return 401 and valid error response if authorization header is missed', async (done) => {
        supertest_1.default(server)
            .get(`/api/v1/goodbye`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ 'error': {
                    type: 'request_validation',
                    message: 'Authorization header required',
                    errors: expect.anything()
                } });
            done();
        });
    });
});
