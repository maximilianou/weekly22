"use strict";
/* istanbul ignore file */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const config_1 = __importDefault(require("@exmpl/config"));
const logger_1 = __importDefault(require("@exmpl/utils/logger"));
//mongoose.Promise = global.Promise;
mongoose_1.default.Promise = global.Promise;
//type MongooseType = typeof mongoose;
//(mongoose as MongooseType).Promise = global.Promise;
//(<MongooseType>mongoose).Promise = global.Promise;
mongoose_1.default.set('debug', process.env.DEBUG !== undefined);
const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: config_1.default.mongo.useCreateIndex,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    autoIndex: config_1.default.mongo.autoIndex,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};
class MongoConnection {
    static getInstance() {
        if (!MongoConnection._instance) {
            MongoConnection._instance = new MongoConnection();
        }
        return MongoConnection._instance;
    }
    ;
    async open() {
        try {
            if (config_1.default.mongo.url === 'inmemory') {
                logger_1.default.debug('connecting to inmemory mongodb');
                this._mongoServer = new mongodb_memory_server_1.MongoMemoryServer();
                const mongoUrl = await this._mongoServer.getUri();
                await mongoose_1.default.connect(mongoUrl, opts);
            }
            else {
                logger_1.default.debug(`connecting to mongodb: ${config_1.default.mongo.url}`);
                mongoose_1.default.connect(config_1.default.mongo.url, opts);
            }
            mongoose_1.default.connection.on('connected', () => {
                logger_1.default.info('Mongo: connected.');
            });
            mongoose_1.default.connection.on('disconnected', () => {
                logger_1.default.info('Mongo: disconnected.');
            });
            mongoose_1.default.connection.on('error', (err) => {
                logger_1.default.error(`Mongo: ${String(err)}`);
                if (err.name === "MongoNetworkError") {
                    setTimeout(() => {
                        mongoose_1.default.connect(config_1.default.mongo.url, opts).catch(() => { });
                    }, 5000);
                }
            });
        }
        catch (err) {
            logger_1.default.error(`db.open: ${err}`);
            throw err;
        }
    }
    async close() {
        try {
            await mongoose_1.default.disconnect();
            if (config_1.default.mongo.url === 'inmemory') {
                await this._mongoServer.stop();
            }
        }
        catch (err) {
            logger_1.default.error(`db.open: ${err}`);
            throw err;
        }
    }
}
;
exports.default = MongoConnection.getInstance();
