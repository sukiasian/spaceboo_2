import { createClient } from 'redis';
import * as childProcess from 'child_process';
import { promisify } from 'util';
import logger from './loggers/logger';
import { Environment } from './types/enums';

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

    private executeCommand = (command: string): Promise<{ stdout: string; stderr: string }> => {
        if (process.env.NODE_ENV === Environment.DEVELOPMENT) {
            try {
                const exec = promisify(childProcess.exec);

                return exec(command);
            } catch (err) {
                this.logger.error(err);
            }
        }
    };

    public startRedisServerOnMachine = (): void => {
        this.executeCommand('redis-cli shutdown & redis-server');
    };

    public shutdownRedisServerOnMachine = async (): Promise<void> => {
        this.executeCommand('redis-cli shutdown');
    };
}

export const redis = new Redis();
