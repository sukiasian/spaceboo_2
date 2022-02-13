import { CookieOptions, Response } from 'express';
import * as express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import logger from '../loggers/logger';
import { applicationInstance } from '../App';
import { Appointment, TIsoDatesReserved } from '../models/appointment.model';
import { Environment, ErrorMessages, HttpStatus, ResponseMessages, ResponseStatus } from '../types/enums';
import AppError from './AppError';

enum DateFormat {
    NATIVE = 'native',
    POSTGRES = 'postgres',
}

class UtilFunctions {
    private static readonly signToken = jwt.sign;

    public static defineResponseStatus = (httpStatus: number): ResponseStatus => {
        if (httpStatus >= HttpStatus.OK && httpStatus < HttpStatus.FORBIDDEN) {
            return ResponseStatus.SUCCESS;
        } else if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
            return ResponseStatus.ERROR;
        }

        return ResponseStatus.FAILURE;
    };

    public static sendResponse = (
        res: Response
    ): ((statusCode: HttpStatus, message?: ResponseMessages | string, data?: any) => void) => {
        return (statusCode: number, message?: string, data?: any): void => {
            if (!message && data) {
                res.status(statusCode).json({
                    status: this.defineResponseStatus(statusCode),
                    data,
                });
            } else if (message && data !== undefined) {
                res.status(statusCode).json({
                    status: this.defineResponseStatus(statusCode),
                    message,
                    data,
                });
            } else if (message && data === undefined) {
                res.status(statusCode).json({
                    status: this.defineResponseStatus(statusCode),
                    message,
                });
            } else {
                res.status(statusCode).json({
                    status: this.defineResponseStatus(statusCode),
                });
            }
        };
    };

    public static exitHandler = (server: any) => {
        process
            .on('unhandledRejection', (reason, p) => {
                console.error(reason, 'Unhandled Rejection at Promise', p);
                server.close((err: any) => {
                    if (err) {
                        logger.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.error('Sequelize connection disconnected');
                        process.exit(0);
                    });
                });
            })
            .on('uncaughtException', (err) => {
                logger.error('Uncaught Exception thrown');
                server.close((err: any) => {
                    if (err) {
                        logger.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.info('Sequelize connection disconnected');
                        process.exit(0);
                    });
                });
            })
            .on('SIGTERM', () => {
                console.info('SIGTERM signal received.');
                server.close((err: any) => {
                    if (err) {
                        logger.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.info('Sequelize connection disconnected');
                        process.exit(0);
                    });
                });
            })
            .on('SIGINT', function () {
                console.info('SIGINT signal received.');
                server.close((err: any) => {
                    if (err) {
                        logger.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.info('Sequelize connection disconnected');
                        process.exit(0);
                    });
                });
            });
    };

    public static catchAsync = (fn) => {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    };

    public static timezoneParserByFormat = (timezone: string, format: DateFormat) => {
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

    private static timeValueToDoubleDigitParser = (value: number): string => {
        return value > 9 ? `${value}` : `0${value}`;
    };

    public static createIsoUtcZeroDate = (dateRawValue: string, timeRawValue: string): string => {
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

    public static createIsoDatesRangeToCreateAppointments = (
        beginningDate: string,
        beginningTime: string,
        endingDate: string,
        endingTime: string
    ): TIsoDatesReserved => {
        return [
            { inclusive: true, value: UtilFunctions.createIsoUtcZeroDate(beginningDate, beginningTime) },
            { inclusive: false, value: UtilFunctions.createIsoUtcZeroDate(endingDate, endingTime) },
        ];
    };

    public static createIsoDatesRangeToFindAppointments = (
        beginningDate: string,
        beginningTime: string,
        endingDate: string,
        endingTime: string
    ): string => {
        return `[${UtilFunctions.createIsoUtcZeroDate(beginningDate, beginningTime)},
            ${UtilFunctions.createIsoUtcZeroDate(endingDate, endingTime)}
        )`;
    };

    public static createSequelizeRawQuery = async (
        sequelize: Sequelize,
        query: string
    ): Promise<unknown | unknown[]> => {
        return sequelize.query(query, { type: QueryTypes.SELECT });
    };

    public static makeDirectory = promisify(fs.mkdir);

    public static readDirectory = promisify(fs.readdir);

    public static checkIfExists = promisify(fs.exists);

    public static removeDirectory = promisify(fs.rmdir);

    public static removeFile = promisify(fs.rm);

    public static findAndRemoveImage = async (userId: string, imageToRemoveFilename: string): Promise<void> => {
        const pathToImageParentDir = path.resolve('assets/images', userId);
        const pathToImage = path.join(pathToImageParentDir, imageToRemoveFilename);
        const checkIfImageParentDivExists = await UtilFunctions.checkIfExists(pathToImageParentDir);
        const checkIfFileExists = await UtilFunctions.checkIfExists(pathToImage);

        if (!checkIfImageParentDivExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        } else if (!checkIfFileExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        await UtilFunctions.removeFile(pathToImage);
    };

    public static signTokenAndStoreInCookies = async (
        res: express.Response,
        jwtPayload: object,
        signOptions: jwt.SignOptions = {}
    ): Promise<void> => {
        const token = this.signToken(jwtPayload, process.env.JWT_SECRET_KEY, signOptions);
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 90 * 24 * 3600000),
            secure: false,
        };

        if (process.env.NODE_ENV === Environment.PRODUCTION) {
            cookieOptions.secure = true;
        }

        res.cookie('jwt', token, cookieOptions);
    };
}

export default UtilFunctions;
