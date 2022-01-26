"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilFunctions_1 = require("./UtilFunctions");
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.utilFunctions = UtilFunctions_1.default;
        this.statusCode = statusCode;
        this.status = this.utilFunctions.defineResponseStatus(statusCode);
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
//# sourceMappingURL=AppError.js.map