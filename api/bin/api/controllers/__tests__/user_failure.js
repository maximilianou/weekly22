"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_1 = __importDefault(require("@exmpl/api/services/user"));
const server_1 = require("@exmpl/utils/server");
jest.mock('@exmpl/api/services/user');
let server;
beforeAll(async () => {
    server = await server_1.createServer();
});
describe('auth failure', () => {
    it('sould return 500 and valid response if auth reject', async (done) => {
        user_1.default.auth.mockRejectedValue(new Error());
        supertest_1.default(server)
            .get(`/api/v1/goodbye`)
            .set('Authorization', 'Bearer fakeToken')
            .expect(500)
            .end((err, res) => {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error'
                } });
            done();
        });
    });
});
