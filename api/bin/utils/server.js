"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const swagger_routes_express_1 = require("swagger-routes-express");
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const api = __importStar(require("@exmpl/api/controllers"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const morgan_body_1 = __importDefault(require("morgan-body"));
const express_dev_logger_1 = require("@exmpl/utils/express_dev_logger");
const config_1 = __importDefault(require("@exmpl/config"));
const logger_1 = __importDefault(require("@exmpl/utils/logger"));
async function createServer() {
    logger_1.default.debug(`utils::server.ts::createServer()`);
    const yamlSpecFile = './config/openapi.yml';
    const apiDefinition = yamljs_1.default.load(yamlSpecFile);
    const apiSummary = swagger_routes_express_1.summarise(apiDefinition);
    const server = express_1.default();
    server.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(apiDefinition));
    const validatorOptions = {
        coerceType: true,
        apiSpec: yamlSpecFile,
        validateRequests: true,
        validateResponses: true
    };
    server.use(OpenApiValidator.middleware(validatorOptions));
    //  await new OpenApiValidator(validatorOptions).install(server);
    logger_1.default.info(apiSummary);
    server.use((err, req, res, next) => {
        res.status(err.status).json({
            error: {
                type: 'request_validation',
                message: err.message,
                errors: err.errors
            }
        });
    });
    server.use(body_parser_1.default.json());
    /* istanbul ignore file */
    if (config_1.default.morganLogger) {
        server.use(morgan_1.default(`:method :url :status :response-time ms - :res[content-length]`));
    }
    /* istanbul ignore file */
    if (config_1.default.morganBodyLogger) {
        morgan_body_1.default(server);
    }
    /* istanbul ignore file */
    if (config_1.default.exmplDevLogger) {
        server.use(express_dev_logger_1.expressDevLogger);
    }
    const connect = swagger_routes_express_1.connector(api, apiDefinition, {
        onCreateRoute: (method, descriptor) => {
            descriptor.shift();
            logger_1.default.verbose(`${method}: ${descriptor.map((d) => d.name).join(', ')}`);
        },
        security: {
            bearerAuth: api.auth
        }
    });
    connect(server);
    return server;
}
exports.createServer = createServer;
