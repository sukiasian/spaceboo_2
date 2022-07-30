"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const logger_1 = require("../loggers/logger");
const enums_1 = require("../types/enums");
exports.default = async (sequelize) => {
    try {
        // await sequelize.sync({ force: process.env.NODE_ENV !== Environment.PRODUCTION ? true : false });
        const syncOptions = {
            force: false,
        };
        const citiesSqlFile = fs.readFileSync(path.join(__dirname, 'geo-position-data.sql'), 'utf-8');
        await sequelize.sync(syncOptions);
        logger_1.default.info('Synchronized');
        if (process.env.NODE_ENV !== enums_1.Environment.PRODUCTION && syncOptions.force) {
            await sequelize.query(citiesSqlFile);
        }
    }
    catch (err) {
        logger_1.default.error(err);
    }
};
//# sourceMappingURL=connectToDb.js.map