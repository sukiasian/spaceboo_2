import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Environment, ErrorMessages, HttpStatus } from '../types/enums';

class ErrorController {
    public static sendErrorDevAndTest = (err: any, res: Response): void => {
        console.log(err, ErrorMessages.APPLICATION_ERROR);
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    };

    public static sendErrorProd = (err: any, res: Response): void => {
        if (err.isOperational) {
            console.error('ERR', err);
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            console.error(err, ErrorMessages.APPLICATION_ERROR);
            res.status(err.statusCode).json({
                status: err.status,
                message: ErrorMessages.UNKNOWN_ERROR,
            });
        }
    };

    public static sendErrorTest = (err: any, res: Response): void => {
        if (!err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: ErrorMessages.UNKNOWN_ERROR,
            });
        } else {
            res.status(err.statusCode).json({
                message: err.message,
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
                ErrorController.sendErrorDevAndTest(err, res);
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
