import { Response } from 'express';
import { applicationInstance } from '../App';
import { TIsoDatesToFindAppointments, TIsoDatesReserved } from '../models/appointment.model';
import { Space } from '../models/space.model';
import { HttpStatus } from '../types/enums';

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
                        console.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        console.log('Sequelize connection disconnected');
                        process.exit(0);
                    });
                });
            })
            .on('uncaughtException', (err) => {
                console.error(err, 'Uncaught Exception thrown');
                server.close((err: any) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        console.log('Sequelize connection disconnected');
                        process.exit(0);
                    });
                });
            })
            .on('SIGTERM', () => {
                console.info('SIGTERM signal received.');
                server.close((err: any) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        console.log('Sequelize connection disconnected');
                        process.exit(0);
                    });
                });
            })
            .on('SIGINT', function () {
                console.info('SIGINT signal received.');
                server.close((err: any) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    applicationInstance.sequelize.close().then(() => {
                        console.log('Sequelize connection disconnected');
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

    // public static timezoneParserPostgresFormat = (timezone: string): string => {
    //     const timezoneSignAndValue = timezone.match(/[+-]\d/g)[0];
    //     const timezoneSign = timezoneSignAndValue[0];
    //     const timezoneValue = parseInt(timezoneSignAndValue.substring(1), 10);

    //     return timezoneValue < 10 ? `${timezoneSign}0${timezoneValue}:00` : `${timezoneSign}${timezoneValue}:00`;
    // };

    // public static timezoneParserNativeFormat = (timezone: string): string => {
    //     const timezoneSignAndValue = timezone.match(/[+-]\d/g)[0];
    //     const timezoneSign = timezoneSignAndValue[0];
    //     const timezoneValue = parseInt(timezoneSignAndValue.substring(1), 10);

    //     return timezoneValue < 10 ? `${timezoneSign}0${timezoneValue}00` : `${timezoneSign}${timezoneValue}00`;
    // };

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

    // NOTE PROBABLY make timezoneParser private and create here dateToPostgresFormat which will format a date into a postgres format date (iso)

    private static timeValueToDoubleDigitParser = (value: number): string => {
        return value > 9 ? `${value}` : `0${value}`;
    };

    public static createIsoDate = (dateRawValue: string, timeRawValue: string, timezone: string): string => {
        const date = new Date(
            `${dateRawValue} ${timeRawValue} ${UtilFunctions.timezoneParserByFormat(timezone, DateFormat.NATIVE)}`
        );
        const year = date.getFullYear();
        const month = UtilFunctions.timeValueToDoubleDigitParser(date.getMonth() + 1);
        const day = UtilFunctions.timeValueToDoubleDigitParser(date.getDate());
        const hours = UtilFunctions.timeValueToDoubleDigitParser(date.getHours());
        const minutes = UtilFunctions.timeValueToDoubleDigitParser(date.getMinutes());
        const seconds = UtilFunctions.timeValueToDoubleDigitParser(date.getSeconds());
        let milliseconds: any = date.getMilliseconds() / 1000;
        milliseconds = Math.floor(milliseconds.toFixed(2) * 100);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${UtilFunctions.timezoneParserByFormat(
            timezone,
            DateFormat.POSTGRES
        )}`;

        // NOTE probably we will always use timezone so we will not need if timezone === true.
        // To check that we need to check if postgres allows format ...T15:00:00.234+0000 instead of Z
        // return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds * 1000}Z`;
    };

    public static createIsoUtcZeroDate = (dateRawValue: string, timeRawValue: string, timezone: string): string => {
        const date = new Date(
            `${dateRawValue} ${timeRawValue} ${UtilFunctions.timezoneParserByFormat(timezone, DateFormat.NATIVE)}`
        );
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
        endingTime: string,
        timezone: string
    ): TIsoDatesReserved => {
        return [
            { inclusive: true, value: UtilFunctions.createIsoDate(beginningDate, beginningTime, timezone) },
            { inclusive: false, value: UtilFunctions.createIsoDate(endingDate, endingTime, timezone) },
        ];
    };

    // public static createIsoDatesRangeToFindAppointments = (
    //     beginningDate: string,
    //     beginningTime: string,
    //     endingDate: string,
    //     endingTime: string,
    //     timezone: string
    // ): TIsoDatesToFindAppointments => {
    //     return [
    //         UtilFunctions.createIsoDate(beginningDate, beginningTime, timezone),
    //         UtilFunctions.createIsoDate(endingDate, endingTime, timezone),
    //     ];
    // };
    public static createIsoDatesRangeToFindAppointments = (
        beginningDate: string,
        beginningTime: string,
        endingDate: string,
        endingTime: string,
        timezone: string
    ): TIsoDatesToFindAppointments => {
        return [
            UtilFunctions.createIsoUtcZeroDate(beginningDate, beginningTime, timezone),
            UtilFunctions.createIsoUtcZeroDate(endingDate, endingTime, timezone),
        ];
    };
}

export default UtilFunctions;
