"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../types/enums");
class ErrorController {
}
ErrorController.sendErrorDevAndTest = (err, res) => {
    console.log(err, enums_1.ErrorMessages.APPLICATION_ERROR);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
ErrorController.sendErrorProd = (err, res) => {
    if (err.isOperational) {
        console.error('ERR', err);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.error(err, enums_1.ErrorMessages.APPLICATION_ERROR);
        res.status(err.statusCode).json({
            status: err.status,
            message: enums_1.ErrorMessages.UNKNOWN_ERROR,
        });
    }
};
ErrorController.sendErrorTest = (err, res) => {
    if (!err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: enums_1.ErrorMessages.UNKNOWN_ERROR,
        });
    }
    else {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
};
ErrorController.globalErrorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || enums_1.HttpStatus.INTERNAL_SERVER_ERROR;
    err.message = err.message || enums_1.ErrorMessages.UNKNOWN_ERROR;
    switch (process.env.NODE_ENV) {
        case enums_1.Environment.DEVELOPMENT:
            ErrorController.sendErrorDevAndTest(err, res);
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