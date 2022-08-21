import { createClient } from 'redis';
import logger from './loggers/logger';

class Redis {
    public readonly client = createClient();
    private readonly logger = logger;

    public startRedis = async (): Promise<void> => {
        this.client.on('error', (err) => {
            this.logger.error(err);

            process.exit(1);
        });

        await this.client.connect();
    };
}

export const redis = new Redis();
