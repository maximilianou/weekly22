"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../user"));
describe('auth', () => {
    it('should resolve to true and valid userId for hardcoded token', async () => {
        const response = await user_1.default.auth('fakeToken');
        expect(response).toEqual({ userId: 'fakeTokenId' });
    });
    it('should resolve with false for invalid token', async () => {
        const response = await user_1.default.auth('invalidToken');
        expect(response).toEqual({ error: { type: 'unauthorized', message: 'Authorization Failed' } });
    });
});
