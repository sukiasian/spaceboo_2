import { app, applicationInstance } from './App';
import logger from './loggers/logger';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { Environment } from './types/enums';
import UtilFunctions from './utils/UtilFunctions';
import databaseConnection from './database/connectToDb';
import { sendMail } from './utils/Email';

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === Environment.DEVELOPMENT) {
    dotenv.config({ path: './.env' });
} else if (process.env.NODE_ENV === Environment.TEST) {
    dotenv.config({ path: './test.config.env' });
}

sendMail({ to: 'sukiasiansam@gmail.com', from: 'sam@spaceboo.com', text: 'hi', subject: 'hello' });

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
