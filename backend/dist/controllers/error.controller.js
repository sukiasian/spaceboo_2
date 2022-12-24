"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../loggers/logger");
const enums_1 = require("../types/enums");
class ErrorController {
}
_a = ErrorController;
ErrorController.logger = logger_1.default;
ErrorController.sendErrorProd = (err, res) => {
    if (err.isOperational) {
        _a.logger.error(`${err}, ${enums_1.ErrorMessages.APPLICATION_ERROR}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        _a.logger.error(`${err}, ${enums_1.ErrorMessages.UNKNOWN_ERROR}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: enums_1.ErrorMessages.UNKNOWN_ERROR,
        });
    }
};
ErrorController.sendErrorDev = (err, res) => {
    _a.logger.error(`${err}`);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
ErrorController.sendErrorTest = (err, res) => {
    if (err.isOperational) {
        _a.logger.error(`${err}, ${enums_1.ErrorMessages.APPLICATION_ERROR}`);
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    else {
        _a.logger.error(`${err}, ${enums_1.ErrorMessages.UNKNOWN_ERROR}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: enums_1.ErrorMessages.UNKNOWN_ERROR,
        });
    }
};
ErrorController.globalErrorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || enums_1.HttpStatus.INTERNAL_SERVER_ERROR;
    err.message = err.message || enums_1.ErrorMessages.UNKNOWN_ERROR;
    switch (process.env.NODE_ENV) {
        case enums_1.Environment.DEVELOPMENT:
            ErrorController.sendErrorDev(err, res);
            break;
        case enums_1.Environment.TEST:
            ErrorController.sendErrorTest(err, res);
            break;
        case enums_1.Environment.PRODUCTION:
            ErrorController.sendErrorProd(err, res);
            break;
    }
};
exports.default = ErrorController.globalErrorController;
//# sourceMappingURL=error.controller.js.map