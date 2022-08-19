import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { SyncOptions } from 'sequelize/types';
import logger from '../loggers/logger';
import { Environment } from '../types/enums';

export default async (sequelize: Sequelize): Promise<void> => {
    try {
        // await sequelize.sync({ force: process.env.NODE_ENV !== Environment.PRODUCTION ? true : false });
        const syncOptions: SyncOptions = {
            force: false,
        };
        const citiesSqlFile = fs.readFileSync(path.join(__dirname, 'geo-position-data.sql'), 'utf-8');

        await sequelize.sync(syncOptions);
        logger.info('Synchronized');

        if (process.env.NODE_ENV !== Environment.PRODUCTION || syncOptions.force) {
            await sequelize.query(citiesSqlFile);
        }
    } catch (err) {
        logger.error(err);
    }
};
