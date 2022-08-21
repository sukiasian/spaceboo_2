import * as winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
        }),
        new winston.transports.File({
            dirname: './log',
            filename: 'error.log',
            level: 'error',
        }),
        new winston.transports.File({ dirname: './log', filename: 'info.log', level: 'info' }),
    ],
});

// в продакшне нужно записывать все в файл для последующего обращения к этому файлу, а в девелопменте консоль ложить через логгер
// logger.add(
// new winston.transports.Console({
//     format: winston.format.simple( ),
// })
// );

export default logger;
