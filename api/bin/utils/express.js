"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonResponse = void 0;
const logger_1 = __importDefault(require("@exmpl/utils/logger"));
function writeJsonResponse(res, code, payload, headers) {
    logger_1.default.debug(`utils::express.ts::writeJsonResponse()`);
    const data = typeof payload === 'object'
        ? JSON.stringify(payload, null, 2)
        : payload;
    res.writeHead(code, { ...headers, 'Content-Type': 'application/json' });
    res.end(data);
}
exports.writeJsonResponse = writeJsonResponse;
