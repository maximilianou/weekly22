"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodbye = exports.hello = void 0;
//import { writeJsonResponse } from '../../utils/express';
const express_1 = require("@exmpl/utils/express");
const logger_1 = __importDefault(require("@exmpl/utils/logger"));
function hello(req, res) {
    logger_1.default.debug(`controller::greeting.ts::hello()`);
    const name = req.query.name || 'stranger';
    express_1.writeJsonResponse(res, 200, { "message": `Hello, ${name}!` });
}
exports.hello = hello;
function goodbye(req, res) {
    logger_1.default.debug(`controller::greeting.ts::goodbye()`);
    logger_1.default.debug(`controller::greeting.ts::goodbye() .. res.locals=[${JSON.stringify(res.locals)}]`);
    logger_1.default.debug(`controller::greeting.ts::goodbye() .. res.locals.auth=[${res.locals.auth}]`);
    const userId = res.locals.auth.userId;
    express_1.writeJsonResponse(res, 200, { "message": `Goodbye, ${userId}!` });
}
exports.goodbye = goodbye;
