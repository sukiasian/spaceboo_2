import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Logger } from 'winston';
import logger from '../loggers/logger';
import { Environment, ErrorMessages, HttpStatus } from '../types/enums';

class ErrorController {
    private static readonly logger: Logger = logger;
    public static sendErrorProd = (err: any, res: Response): void => {
        if (err.isOperational) {
            this.logger.log(err, ErrorMessages.APPLICATION_ERROR);

            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            this.logger.log(err, ErrorMessages.UNKNOWN_ERROR);

            res.status(err.statusCode).json({
                status: err.status,
                message: ErrorMessages.UNKNOWN_ERROR,
            });
        }
    };
    public static sendErrorDev = (err: any, res: Response): void => {
        this.logger.log(err);

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    };
    public static sendErrorTest = (err: any, res: Response): void => {
        if (err.isOperational) {
            this.logger.log(err, ErrorMessages.APPLICATION_ERROR);

            res.status(err.statusCode).json({
                message: err.message,
            });
        } else {
            this.logger.log(err, ErrorMessages.UNKNOWN_ERROR);

            res.status(err.statusCode).json({
                status: err.status,
                message: ErrorMessages.UNKNOWN_ERROR,
            });
        }
    };

    public static globalErrorController: ErrorRequestHandler = (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        err.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        err.message = err.message || ErrorMessages.UNKNOWN_ERROR;

        switch (process.env.NODE_ENV) {
            case Environment.DEVELOPMENT:
                ErrorController.sendErrorDev(err, res);
                break;

            case Environment.TEST:
                ErrorController.sendErrorTest(err, res);
                break;

            case Environment.PRODUCTION:
                ErrorController.sendErrorProd(err, res);
                break;
        }
    };
}

export default ErrorController.globalErrorController;
