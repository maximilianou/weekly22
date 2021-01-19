"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@exmpl/utils/logger"));
const server_1 = require("@exmpl/utils/server");
const db_1 = __importDefault(require("@exmpl/utils/db"));
db_1.default.open()
    .then(() => server_1.createServer())
    .then((server) => {
    server.listen(3022, () => {
        logger_1.default.info(`Listening on port: ${3022}`);
    });
})
    .catch((err) => {
    logger_1.default.error(`Error:: ${err}`);
});
