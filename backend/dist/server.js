"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppConfig_1 = require("./AppConfig");
const logger_1 = require("./loggers/logger");
const process = require("process");
const dotenv = require("dotenv");
const enums_1 = require("./types/enums");
const UtilFunctions_1 = require("./utils/UtilFunctions");
const connectToDb_1 = require("./database/connectToDb");
const Singleton_1 = require("./utils/Singleton");
const crons_1 = require("./crons");
const Redis_1 = require("./Redis");
class Server extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.redis = Redis_1.redis;
        this.appConfig = AppConfig_1.appConfig;
        this.app = AppConfig_1.appConfig.app;
        this.PORT = process.env.PORT || 8000;
        this.utilFunctions = UtilFunctions_1.default;
        this.startCrons = () => {
            (0, crons_1.default)();
        };
        this.start = async () => {
            await (0, connectToDb_1.default)(this.appConfig.sequelize);
            await this.redis.startRedis();
            const server = this.app.listen(this.PORT, () => {
                logger_1.default.info(`Server is listening on ${this.PORT}`);
                if (process.env.NODE_ENV === enums_1.Environment.PRODUCTION) {
                    process.send('Server is ready');
                }
            });
            this.utilFunctions.exitHandler(server, this.appConfig.sequelize);
        };
    }
}
Server.configureDotenv = () => {
    switch (process.env.NODE_ENV) {
        case enums_1.Environment.DEVELOPMENT || enums_1.Environment.PRODUCTION:
            dotenv.config({ path: './.env' });
            break;
        case enums_1.Environment.TEST:
            dotenv.config({ path: './.test.config.env' });
            break;
    }
};
Server.configureDotenv();
const server = Singleton_1.SingletonFactory.produce(Server);
server.startCrons();
// NOTE remove method after dockerization
console.log(5555);
server.redis.startRedisServerOnMachine();
console.log(6666);
server.start();
//# sourceMappingURL=server.js.map