import * as winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.simple(),
    })
);

export default logger;
