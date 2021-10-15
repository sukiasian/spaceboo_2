import { app, applicationInstance } from './App';
import logger from './loggers/logger';
import * as process from 'process';
import { Environment } from './types/enums';
import UtilFunctions from './utils/UtilFunctions';
import databaseConnection from './database/connectToDb';

const PORT = process.env.PORT || 8000;

(async () => {
    await databaseConnection(applicationInstance.sequelize);

    const server = app.listen(PORT, () => {
        logger.log({
            level: 'info',
            message: `Server is listening on ${PORT}`,
        });

        if (process.env.NODE_ENV === Environment.PRODUCTION) {
            process.send('Server is ready');
        }
    });

    UtilFunctions.exitHandler(server);
})();
