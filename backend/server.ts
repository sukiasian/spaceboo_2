import { appConfig } from './AppConfig';
import logger from './loggers/logger';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { Environment } from './types/enums';
import UtilFunctions from './utils/UtilFunctions';
import databaseConnection from './database/connectToDb';
import { Singleton, SingletonFactory } from './utils/Singleton';
import setCrons from './crons';
import { redis } from './Redis';

class Server extends Singleton {
    public readonly redis = redis;
    private readonly appConfig = appConfig;
    private readonly app = appConfig.app;
    private readonly PORT = process.env.PORT || 8000;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public static configureDotenv = (): void => {
        switch (process.env.NODE_ENV) {
            case Environment.DEVELOPMENT || Environment.PRODUCTION:
                dotenv.config({ path: './.env' });
                break;

            case Environment.TEST:
                dotenv.config({ path: './.test.config.env' });
                break;
        }
    };

    public startCrons = (): void => {
        setCrons();
    };

    public start = async () => {
        await databaseConnection(this.appConfig.sequelize);
        await this.redis.startRedis();

        const server = this.app.listen(this.PORT, () => {
            logger.info(`Server is listening on ${this.PORT}`);

            if (process.env.NODE_ENV === Environment.PRODUCTION) {
                process.send('Server is ready');
            }
        });

        this.utilFunctions.exitHandler(server, this.appConfig.sequelize);
    };
}

Server.configureDotenv();

const server = SingletonFactory.produce<Server>(Server);

server.startCrons();
server.start();
