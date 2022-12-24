"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("redis");
const childProcess = require("child_process");
const util_1 = require("util");
const logger_1 = require("./loggers/logger");
const enums_1 = require("./types/enums");
class Redis {
    constructor() {
        this.client = (0, redis_1.createClient)();
        this.logger = logger_1.default;
        this.startRedis = async () => {
            this.client.on('error', (err) => {
                this.logger.error(err);
                process.exit(1);
            });
            await this.client.connect();
        };
        this.executeCommand = (command) => {
            if (process.env.NODE_ENV === enums_1.Environment.DEVELOPMENT) {
                try {
                    const exec = (0, util_1.promisify)(childProcess.exec);
                    return exec(command);
                }
                catch (err) {
                    this.logger.error(err);
                }
            }
        };
        this.startRedisServerOnMachine = () => {
            // this.executeCommand('redis-cli shutdown & redis-server');
            this.executeCommand('redis-server');
        };
        this.shutdownRedisServerOnMachine = async () => {
            await this.executeCommand('redis-cli shutdown');
            await this.client.disconnect();
        };
    }
}
exports.redis = new Redis();
//# sourceMappingURL=Redis.js.map