"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const util_1 = require("util");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const logger_1 = require("../loggers/logger");
const enums_1 = require("../types/enums");
const AppError_1 = require("./AppError");
var DateFormat;
(function (DateFormat) {
    DateFormat["NATIVE"] = "native";
    DateFormat["POSTGRES"] = "postgres";
})(DateFormat || (DateFormat = {}));
class UtilFunctions {
}
UtilFunctions.signToken = jwt.sign;
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
                status: this.defineResponseStatus(statusCode),
                data,
            });
        }
        else if (message && data !== undefined) {
            res.status(statusCode).json({
                status: this.defineResponseStatus(statusCode),
                message,
                data,
            });
        }
        else if (message && data === undefined) {
            res.status(statusCode).json({
                status: this.defineResponseStatus(statusCode),
                message,
            });
        }
        else {
            res.status(statusCode).json({
                status: this.defineResponseStatus(statusCode),
            });
        }
    };
};
UtilFunctions.exitHandler = (server, sequelize) => {
    process
        .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
        server.close((err) => {
            if (err) {
                logger_1.default.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                logger_1.default.error('Sequelize connection disconnected');
                process.exit(0);
            });
        });
    })
        .on('uncaughtException', (err) => {
        logger_1.default.error('Uncaught Exception thrown');
        server.close((err) => {
            if (err) {
                logger_1.default.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                logger_1.default.info('Sequelize connection disconnected');
                process.exit(0);
            });
        });
    })
        .on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        server.close((err) => {
            if (err) {
                logger_1.default.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                logger_1.default.info('Sequelize connection disconnected');
                process.exit(0);
            });
        });
    })
        .on('SIGINT', function () {
        console.info('SIGINT signal received.');
        server.close((err) => {
            if (err) {
                logger_1.default.error(err);
                process.exit(1);
            }
            sequelize.close().then(() => {
                logger_1.default.info('Sequelize connection disconnected');
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
UtilFunctions.makeDirectory = util_1.promisify(fs.mkdir);
UtilFunctions.readDirectory = util_1.promisify(fs.readdir);
UtilFunctions.checkIfExists = util_1.promisify(fs.exists);
UtilFunctions.removeDirectory = util_1.promisify(fs.rmdir);
UtilFunctions.removeFile = util_1.promisify(fs.rm);
UtilFunctions.findAndRemoveImage = async (userId, imageToRemoveFilename) => {
    const pathToFile = path.resolve('assets/images', imageToRemoveFilename);
    const checkIfFileExists = await UtilFunctions.checkIfExists(pathToFile);
    if (!checkIfFileExists) {
        throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.NO_IMAGE_FOUND);
    }
    await UtilFunctions.removeFile(pathToFile);
};
UtilFunctions.signTokenAndStoreInCookies = async (res, jwtPayload, signOptions = {}) => {
    const token = this.signToken(jwtPayload, process.env.JWT_SECRET_KEY, signOptions);
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
exports.default = UtilFunctions;
//# sourceMappingURL=UtilFunctions.js.map