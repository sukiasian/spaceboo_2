"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_1 = require("util");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const logger_1 = require("../loggers/logger");
const enums_1 = require("../types/enums");
const Redis_1 = require("../Redis");
var DateFormat;
(function (DateFormat) {
    DateFormat["NATIVE"] = "native";
    DateFormat["POSTGRES"] = "postgres";
})(DateFormat || (DateFormat = {}));
class UtilFunctions {
}
_a = UtilFunctions;
UtilFunctions.signToken = jwt.sign;
UtilFunctions.logger = logger_1.default;
UtilFunctions.redis = Redis_1.redis;
UtilFunctions.defineResponseStatus = (httpStatus) => {
    if (httpStatus >= enums_1.HttpStatus.OK && httpStatus < enums_1.HttpStatus.FORBIDDEN) {
        return enums_1.ResponseStatus.SUCCESS;
    }
    else if (httpStatus >= enums_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        return enums_1.ResponseStatus.ERROR;
    }
    return enums_1.ResponseStatus.FAILURE;
};
UtilFunctions.sendResponse = (res) => {
    return (statusCode, message, data) => {
        if (!message && data) {
            res.status(statusCode).json({
                status: _a.defineResponseStatus(statusCode),
                data,
            });
        }
        else if (message && data !== undefined) {
            res.status(statusCode).json({
                status: _a.defineResponseStatus(statusCode),
                message,
                data,
            });
        }
        else if (message && data === undefined) {
            res.status(statusCode).json({
                status: _a.defineResponseStatus(statusCode),
                message,
            });
        }
        else {
            res.status(statusCode).json({
                status: _a.defineResponseStatus(statusCode),
            });
        }
    };
};
UtilFunctions.shutdownOpenProcesses = async (server, sequelize) => {
    let errorExists;
    server.close((err) => {
        if (err) {
            logger_1.default.error(err);
            errorExists = err;
        }
    });
    await sequelize.close();
    logger_1.default.info('Sequelize disconnected.');
    await _a.redis.client.quit();
    await _a.redis.shutdownRedisServerOnMachine();
    logger_1.default.info('Redis disconnected.');
    process.exit(errorExists ? 1 : 0);
};
UtilFunctions.exitHandler = (server, sequelize) => {
    process
        .on('unhandledRejection', (reason, p) => {
        logger_1.default.error('Unhandled Rejection: ', reason, p);
        _a.shutdownOpenProcesses(server, sequelize);
    })
        .on('uncaughtException', (err) => {
        logger_1.default.error('Uncaught Exception thrown');
        _a.shutdownOpenProcesses(server, sequelize);
    })
        .on('SIGTERM', () => {
        logger_1.default.info('SIGTERM signal received.');
        _a.shutdownOpenProcesses(server, sequelize);
    })
        .on('SIGINT', () => {
        logger_1.default.info('SIGINT signal received.');
        _a.shutdownOpenProcesses(server, sequelize);
    })
        .on('beforeExit', () => {
        logger_1.default.info('Exit occured.');
        _a.shutdownOpenProcesses(server, sequelize);
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
UtilFunctions.createSequelizeRawQuery = async (sequelize, query, options = {}) => {
    return sequelize.query(query, Object.assign({ type: sequelize_1.QueryTypes.SELECT }, options));
};
UtilFunctions.makeDirectory = (0, util_1.promisify)(fs.mkdir);
UtilFunctions.readDirectory = (0, util_1.promisify)(fs.readdir);
UtilFunctions.checkIfExists = (0, util_1.promisify)(fs.exists);
UtilFunctions.removeDirectory = (0, util_1.promisify)(fs.rmdir);
UtilFunctions.removeFile = (0, util_1.promisify)(fs.rm);
UtilFunctions.findAndRemoveImage = async (userId, imageToRemoveFilename) => {
    const pathToFile = path.resolve('assets/images', imageToRemoveFilename);
    const checkIfFileExists = await UtilFunctions.checkIfExists(pathToFile);
    if (!checkIfFileExists) {
        _a.logger.error(enums_1.ErrorMessages.NO_IMAGE_FOUND);
        return;
    }
    await UtilFunctions.removeFile(pathToFile);
};
UtilFunctions.signTokenAndStoreInCookies = async (res, jwtPayload, signOptions = {}) => {
    const token = _a.signToken(jwtPayload, process.env.JWT_SECRET_KEY, signOptions);
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 90 * 24 * 3600000),
        secure: false,
    };
    if (process.env.NODE_ENV === enums_1.Environment.PRODUCTION) {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);
};
UtilFunctions.makeDecimal = (valueToNumber) => {
    return parseInt(valueToNumber, 10);
};
UtilFunctions.isUUID = (id) => {
    // NOTE: does not work
    // return uuid.validate(id);
    return id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? true : false;
};
exports.default = UtilFunctions;
//# sourceMappingURL=UtilFunctions.js.map