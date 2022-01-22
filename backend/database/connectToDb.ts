import { Sequelize } from 'sequelize-typescript';
import logger from '../loggers/logger';
import { Environment, LoggerLevels } from '../types/enums';

export default async (sequelize: Sequelize): Promise<void> => {
    try {
        // await sequelize.sync({ force: process.env.NODE_ENV !== Environment.PRODUCTION ? true : false });
        await sequelize.sync({ force: false });
        logger.log({ level: LoggerLevels.INFO, message: 'Synchronized' });

        if (process.env.NODE_ENV !== Environment.PRODUCTION) {
            await sequelize.query(
                "COPY \"Cities\" (address, postal_code, country, federal_district, region_type, region, area_type, area, city_type, city, timezone) FROM '/Users/samvelsukiasian/Desktop/Спейсбу/city.csv' DELIMITER ';' CSV HEADER;"
            );
        }
    } catch (err) {
        logger.log(err);
    }
};
