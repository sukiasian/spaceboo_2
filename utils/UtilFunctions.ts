import { Response } from 'express';
import { applicationInstance } from '../App';
import { HttpStatus } from '../types/enums';

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

    public static timezoneParser = (timezone: string): string => {
        const timezoneSignAndValue = timezone.match(/[+-]\d/g)[0];
        const timezoneSign = timezoneSignAndValue[0];
        const timezoneValue = parseInt(timezoneSignAndValue.substring(1), 10);

        return timezoneValue < 10 ? `${timezoneSign}0${timezoneValue}:00` : `${timezoneSign}${timezoneValue}:00`;
    };

    // NOTE PROBABLY make timezoneParser private and create here dateToPostgresFormat which will format a date into a postgres format date (iso)

    private static timeValueToDoubleDigitParser = (value) => {
        return value > 9 ? `${value}` : `0${value}`;
    };

    public static createCustomDate = (date: Date, timezone: string): string => {
        const year = date.getFullYear();
        const month = UtilFunctions.timeValueToDoubleDigitParser(date.getMonth() + 1);
        const day = UtilFunctions.timeValueToDoubleDigitParser(date.getDate());
        const hours = UtilFunctions.timeValueToDoubleDigitParser(date.getHours());
        const minutes = UtilFunctions.timeValueToDoubleDigitParser(date.getMinutes());
        const seconds = UtilFunctions.timeValueToDoubleDigitParser(date.getSeconds());
        let milliseconds: any = date.getMilliseconds() / 1000;
        milliseconds = Math.floor(milliseconds.toFixed(2) * 100);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${UtilFunctions.timezoneParser(
            timezone
        )}`;
    };
}

export default UtilFunctions;
