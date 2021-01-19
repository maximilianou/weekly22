"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@exmpl/utils/logger"));
function auth(bearerToken) {
    logger_1.default.debug(`services::user.ts::auth()`);
    return new Promise(function (resolve, reject) {
        const token = bearerToken.replace('Bearer ', '');
        logger_1.default.debug(`services::user.ts::auth() .. token::[${token}]`);
        if (token === 'fakeToken') {
            return resolve({ userId: 'fakeTokenId' });
        }
        return resolve({ error: { type: 'unauthorized', message: 'Authorization Failed' } });
    });
}
exports.default = { auth: auth };
