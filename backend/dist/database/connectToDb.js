"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../loggers/logger");
const enums_1 = require("../types/enums");
exports.default = async (sequelize) => {
    try {
        await sequelize.sync({ force: process.env.NODE_ENV === enums_1.Environment.DEVELOPMENT ? true : false });
        logger_1.default.log({ level: enums_1.LoggerLevels.INFO, message: 'Synchronized' });
        if (process.env.NODE_ENV !== enums_1.Environment.PRODUCTION) {
            await sequelize.query("COPY \"Cities\" (address, postal_code, country, federal_district, region_type, region, area_type, area, city_type, city, timezone) FROM '/Users/samvelsukiasian/Desktop/Спейсбу/city.csv' DELIMITER ';' CSV HEADER;");
        }
    }
    catch (err) {
        switch (process.env.NODE_ENV) {
            case enums_1.Environment.DEVELOPMENT || enums_1.Environment.TEST:
                console.error(err);
                break;
            case enums_1.Environment.PRODUCTION:
                logger_1.default.log({ level: 'error', message: err });
                break;
        }
    }
};
//# sourceMappingURL=connectToDb.js.map