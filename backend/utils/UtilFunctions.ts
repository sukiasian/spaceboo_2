import { CookieOptions, Response } from 'express';
import * as express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { QueryOptions, QueryTypes } from 'sequelize';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import logger from '../loggers/logger';
import { TIsoDatesReserved } from '../models/appointment.model';
import { Environment, ErrorMessages, HttpStatus, ResponseMessages, ResponseStatus } from '../types/enums';
import { redis } from '../Redis';

enum DateFormat {
    NATIVE = 'native',
    POSTGRES = 'postgres',
}

class UtilFunctions {
    private static readonly signToken = jwt.sign;
    private static readonly logger = logger;
    private static readonly redis = redis;

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

    private static shutdownOpenProcesses = async (server: any, sequelize: Sequelize): Promise<void> => {
        let errorExists: any;

        server.close((err: any) => {
            if (err) {
                logger.error(err);

                errorExists = err;
            }
        });

        await sequelize.close();

        logger.info('Sequelize disconnected.');

        await this.redis.client.quit();
        await this.redis.shutdownRedisServerOnMachine();

        logger.info('Redis disconnected.');

        process.exit(errorExists ? 1 : 0);
    };

    public static exitHandler = (server: any, sequelize: Sequelize) => {
        process
            .on('unhandledRejection', (reason, p) => {
                logger.error('Unhandled Rejection: ', reason, p);

                this.shutdownOpenProcesses(server, sequelize);
            })
            .on('uncaughtException', (err) => {
                logger.error('Uncaught Exception thrown');

                this.shutdownOpenProcesses(server, sequelize);
            })
            .on('SIGTERM', () => {
                logger.info('SIGTERM signal received.');

                this.shutdownOpenProcesses(server, sequelize);
            })
            .on('SIGINT', () => {
                logger.info('SIGINT signal received.');

                this.shutdownOpenProcesses(server, sequelize);
            })
            .on('beforeExit', () => {
                logger.info('Exit occured.');

                this.shutdownOpenProcesses(server, sequelize);
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
        query: string,
        options: QueryOptions = {}
    ): Promise<unknown | unknown[]> => {
        return sequelize.query(query, { type: QueryTypes.SELECT, ...options });
    };

    public static makeDirectory = promisify(fs.mkdir);

    public static readDirectory = promisify(fs.readdir);

    public static checkIfExists = promisify(fs.exists);

    public static removeDirectory = promisify(fs.rmdir);

    public static removeFile = promisify(fs.rm);

    public static findAndRemoveImage = async (userId: string, imageToRemoveFilename: string): Promise<void> => {
        const pathToFile = path.resolve('assets/images', imageToRemoveFilename);
        const checkIfFileExists = await UtilFunctions.checkIfExists(pathToFile);

        if (!checkIfFileExists) {
            this.logger.error(ErrorMessages.NO_IMAGE_FOUND);

            return;
        }

        await UtilFunctions.removeFile(pathToFile);
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

    public static makeDecimal = (valueToNumber: string): number => {
        return parseInt(valueToNumber, 10);
    };

    public static isUUID = (id: string): boolean => {
        // NOTE: does not work
        // return uuid.validate(id);

        return id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? true : false;
    };
}

export default UtilFunctions;
