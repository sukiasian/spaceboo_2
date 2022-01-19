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
    ],
});

// в продакшне нужно записывать все в файл для последующего обращения к этому файлу, а в девелопменте консоль ложить через логгер
// logger.add(
// new winston.transports.Console({
//     format: winston.format.simple( ),
// })
// );

export default logger;
