"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var user_1 = __importDefault(require("@exmpl/api/services/user"));
var express_1 = require("@exmpl/utils/express");
var logger_1 = __importDefault(require("@exmpl/utils/logger"));
function auth(req, res, next) {
    logger_1.default.debug("controller::user.ts::auth()");
    var token = req.headers.authorization;
    logger_1.default.debug("controller::user.ts::auth() .. token=[" + token + "]");
    user_1.default.auth(token)
        .then(function (authResponse) {
        logger_1.default.debug("controller::user.ts::auth() .. authResponse=[" + authResponse + "]");
        if (!authResponse.error) {
            res.locals.auth = {
                userId: authResponse.userId
            };
            next();
        }
        else {
            express_1.writeJsonResponse(res, 401, authResponse);
        }
    })
        .catch(function (err) {
        express_1.writeJsonResponse(res, 500, {
            error: {
                type: 'internal_server_error',
                message: 'Internal Server Error'
            }
        });
    });
}
exports.auth = auth;
