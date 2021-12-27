import { ErrorMessages, HttpStatus } from '../types/enums';

export default class AppError extends Error {
    public statusCode: HttpStatus;
    public isOperational: boolean;
    public status: string;

    constructor(statusCode: HttpStatus, message: ErrorMessages | string) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
