import { Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../loggers/logger';
import { applicationInstance } from '../App';
import { TIsoDatesReserved } from '../models/appointment.model';
import { ErrorMessages, HttpStatus, LoggerLevels } from '../types/enums';
import AppError from './AppError';

enum DateFormat {
    NATIVE = 'native',
    POSTGRES = 'postgres',
}

class UtilFunctions {
    public static sendResponse = (res: Response): ((statusCode: HttpStatus, message?: string, data?: any) => void) => {
        return (statusCode: number, message?: string, data?: any): void => {
            if (!message && data) {
                res.status(statusCode).json({
                    statusCode,
                    data,
                });
            } else if (message && !data) {
                res.status(statusCode).json({
                    statusCode,
                    message,
                });
            } else if (message && data) {
                res.status(statusCode).json({
                    statusCode,
                    message,
                    data,
                });
            } else {
                res.status(statusCode).json({
                    statusCode,
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
                        logger.log({ level: LoggerLevels.ERROR, message: err });
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.log({ level: LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
                        process.exit(0);
                    });
                });
            })
            .on('uncaughtException', (err) => {
                logger.log({ level: LoggerLevels.ERROR, message: 'Uncaught Exception thrown' });
                server.close((err: any) => {
                    if (err) {
                        logger.log({ level: LoggerLevels.ERROR, message: err });
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.log({ level: LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
                        process.exit(0);
                    });
                });
            })
            .on('SIGTERM', () => {
                console.info('SIGTERM signal received.');
                server.close((err: any) => {
                    if (err) {
                        logger.log({ level: LoggerLevels.ERROR, message: err });
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.log({ level: LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
                        process.exit(0);
                    });
                });
            })
            .on('SIGINT', function () {
                console.info('SIGINT signal received.');
                server.close((err: any) => {
                    if (err) {
                        logger.log({ level: LoggerLevels.ERROR, message: err });
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        logger.log({ level: LoggerLevels.INFO, message: 'Sequelize connection disconnected' });
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
        query: string,
        isPlain = false
    ): Promise<unknown | unknown[]> => {
        return sequelize.query(query, { type: QueryTypes.SELECT, plain: isPlain });
    };

    public static makeDirectory = promisify(fs.mkdir);

    public static readDirectory = promisify(fs.readdir);

    public static checkIfExists = promisify(fs.exists);

    public static removeDirectory = promisify(fs.rmdir);

    public static removeFile = promisify(fs.rm);

    public static findAndRemoveImage = async (
        id: string,
        imageToRemoveFilename: string,
        entityDirPath: string
    ): Promise<void> => {
        if (!imageToRemoveFilename || imageToRemoveFilename.length === 0) {
            // FIXME возможно нужно выкинуть ошибку "Нет изображений для поиска"
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        const pathToEntityIndividualDir = path.resolve(entityDirPath, id);
        const pathToImage = path.resolve(entityDirPath, id, imageToRemoveFilename);
        const checkIfEntityIndividualDirExists = await UtilFunctions.checkIfExists(pathToEntityIndividualDir);
        const checkIfFileExists = await UtilFunctions.checkIfExists(pathToImage);

        if (!checkIfEntityIndividualDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        } else if (!checkIfFileExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        }

        await UtilFunctions.removeFile(pathToImage);
    };
}

export default UtilFunctions;
