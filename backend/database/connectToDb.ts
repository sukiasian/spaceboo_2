import { Sequelize } from 'sequelize-typescript';
import { SyncOptions } from 'sequelize/types';
import logger from '../loggers/logger';
import { Environment } from '../types/enums';

export default async (sequelize: Sequelize): Promise<void> => {
    try {
        // await sequelize.sync({ force: process.env.NODE_ENV !== Environment.PRODUCTION ? true : false });
        const syncOptions: SyncOptions = {
            force: true,
        };

        await sequelize.sync(syncOptions);
        logger.info('Synchronized');

        if (process.env.NODE_ENV !== Environment.PRODUCTION && syncOptions.force) {
            await sequelize.query(
                "COPY \"Cities\" (address, postal_code, country, federal_district, region_type, region, area_type, area, city_type, city, timezone) FROM '/Users/samvelsukiasian/Desktop/Спейсбу/city.csv' DELIMITER ';' CSV HEADER;"
            );
        }
    } catch (err) {
        logger.error(err);
    }
};
