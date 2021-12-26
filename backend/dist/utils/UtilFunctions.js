"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../loggers/logger");
const App_1 = require("../App");
const enums_1 = require("../types/enums");
var DateFormat;
(function (DateFormat) {
    DateFormat["NATIVE"] = "native";
    DateFormat["POSTGRES"] = "postgres";
})(DateFormat || (DateFormat = {}));
class UtilFunctions {
}
UtilFunctions.sendResponse = (res) => {
    return (statusCode, message, data) => {
        if (!message && data) {
            res.status(statusCode).json({
                statusCode,
                data,
            });
        }
        else if (message && !data) {
            res.status(statusCode).json({
                statusCode,
                message,
            });
        }
        else if (message && data) {
            res.status(statusCode).json({
                statusCode,
                message,
                data,
            });
        }
        else {
            res.status(statusCode).json({
                statusCode,
            });
        }
    };
};
UtilFunctions.exitHandler = (server) => {
    process
        .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
        server.close((err) => {
            if (err) {
                logger_1.default.log({ level: enums_1.LoggerLevels.ERROR, message: err });
                process.exit(1);
            }
            App_1.applicationInstance.sequelize.close().then(() => {
                logger_1.default.log({ level: enums_1.LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
                process.exit(0);
            });
        });
    })
        .on('uncaughtException', (err) => {
        logger_1.default.log({ level: enums_1.LoggerLevels.ERROR, message: 'Uncaught Exception thrown' });
        server.close((err) => {
            if (err) {
                logger_1.default.log({ level: enums_1.LoggerLevels.ERROR, message: err });
                process.exit(1);
            }
            App_1.applicationInstance.sequelize.close().then(() => {
                logger_1.default.log({ level: enums_1.LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
                process.exit(0);
            });
        });
    })
        .on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        server.close((err) => {
            if (err) {
                logger_1.default.log({ level: enums_1.LoggerLevels.ERROR, message: err });
                process.exit(1);
            }
            App_1.applicationInstance.sequelize.close().then(() => {
                logger_1.default.log({ level: enums_1.LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
                process.exit(0);
            });
        });
    })
        .on('SIGINT', function () {
        console.info('SIGINT signal received.');
        server.close((err) => {
            if (err) {
                logger_1.default.log({ level: enums_1.LoggerLevels.ERROR, message: err });
                process.exit(1);
            }
            App_1.applicationInstance.sequelize.close().then(() => {
                logger_1.default.log({ level: enums_1.LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
                process.exit(0);
            });
        });
    });
};
UtilFunctions.catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
UtilFunctions.timezoneParserByFormat = (timezone, format) => {
    const timezoneSignAndValue = timezone.match(/[+-]\d/g)[0];
    const timezoneSign = timezoneSignAndValue[0];
    const timezoneValue = parseInt(timezoneSignAndValue.substring(1), 10);
    switch (format) {
        case DateFormat.NATIVE:
            return timezoneValue < 10 ? `${timezoneSign}0${timezoneValue}00` : `${timezoneSign}${timezoneValue}00`;
        case DateFormat.POSTGRES:
            return timezoneValue < 10
                ? `${timezoneSign}0${timezoneValue}:00`
                : `${timezoneSign}${timezoneValue}:00`;
    }
};
// NOTE PROBABLY make timezoneParser private and create here dateToPostgresFormat which will format a date into a postgres format date (iso)
UtilFunctions.timeValueToDoubleDigitParser = (value) => {
    return value > 9 ? `${value}` : `0${value}`;
};
UtilFunctions.createIsoUtcZeroDate = (dateRawValue, timeRawValue) => {
    const date = new Date(`${dateRawValue} ${timeRawValue} +0000`);
    const year = date.getFullYear();
    const month = UtilFunctions.timeValueToDoubleDigitParser(date.getUTCMonth() + 1);
    const day = UtilFunctions.timeValueToDoubleDigitParser(date.getUTCDate());
    const hours = UtilFunctions.timeValueToDoubleDigitParser(date.getUTCHours());
    const minutes = UtilFunctions.timeValueToDoubleDigitParser(date.getUTCMinutes());
    const seconds = UtilFunctions.timeValueToDoubleDigitParser(date.getUTCSeconds());
    const milliseconds = date.getUTCMilliseconds();
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};
UtilFunctions.createIsoDatesRangeToCreateAppointments = (beginningDate, beginningTime, endingDate, endingTime) => {
    return [
        { inclusive: true, value: UtilFunctions.createIsoUtcZeroDate(beginningDate, beginningTime) },
        { inclusive: false, value: UtilFunctions.createIsoUtcZeroDate(endingDate, endingTime) },
    ];
};
UtilFunctions.createIsoDatesRangeToFindAppointments = (beginningDate, beginningTime, endingDate, endingTime) => {
    return `[${UtilFunctions.createIsoUtcZeroDate(beginningDate, beginningTime)},
            ${UtilFunctions.createIsoUtcZeroDate(endingDate, endingTime)}
        )`;
};
exports.default = UtilFunctions;
//# sourceMappingURL=UtilFunctions.js.map