import { app, applicationInstance } from './App';
import logger from './loggers/logger';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { Environment } from './types/enums';
import UtilFunctions from './utils/UtilFunctions';
import databaseConnection from './database/connectToDb';

const PORT = process.env.PORT || 8000;

// if (process.env.NODE_ENV === Environment.DEVELOPMENT || process.env) {
//     dotenv.config({ path: './.env' });
// } else if (process.env.NODE_ENV === Environment.TEST) {
//     dotenv.config({ path: './test.config.env' });
// }

switch (process.env.NODE_ENV) {
    case Environment.DEVELOPMENT || Environment.PRODUCTION:
        dotenv.config({ path: './.env' });
        break;

    case Environment.TEST:
        dotenv.config({ path: './.test.config.env' });
        break;
}

(async () => {
    await databaseConnection(applicationInstance.sequelize);

    const server = app.listen(PORT, () => {
        logger.info(`Server is listening on ${PORT}`);

        if (process.env.NODE_ENV === Environment.PRODUCTION) {
            process.send('Server is ready');
        }
    });

    UtilFunctions.exitHandler(server);
})();
