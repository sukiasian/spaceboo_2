import { createClient } from 'redis';

class Redis {
    public readonly client = createClient();

    public startRedis = async (): Promise<void> => {
        this.client.on('error', (err) => {
            process.exit(1);
        });

        await this.client.connect();
    };
}

export const redis = new Redis();
