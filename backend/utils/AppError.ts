import { ErrorMessages, HttpStatus } from '../types/enums';
import UtilFunctions from './UtilFunctions';

export default class AppError extends Error {
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
    public statusCode: HttpStatus;
    public isOperational: boolean;
    public status: string;

    constructor(statusCode: HttpStatus, message: ErrorMessages | string) {
        super(message);
        this.statusCode = statusCode;
        this.status = this.utilFunctions.defineResponseStatus(statusCode);
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
