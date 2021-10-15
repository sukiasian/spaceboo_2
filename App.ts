import * as express from 'express';
import { Sequelize } from 'sequelize-typescript';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import { router as userRouter } from './routes/user.router';
import { router as spaceRouter } from './routes/space.router';
import { router as authRouter } from './routes/auth.router';
import { router as appointmentRouter } from './routes/appointment.router';
import { ApiRoutes } from './types/enums';
import globalErrorController from './controllers/error.controller';
import { Singleton, SingletonFactory } from './utils/Singleton';
import { User } from './models/user.model';
import { Space } from './models/space.model';
import { passportConfig, PassportConfig } from './configurations/passport.config';
import { Test } from './models/test.model';
import { City } from './models/city.model';
import { Appointment } from './models/appointment.model';

dotenv.config();

export class Application extends Singleton {
    public readonly app: express.Express = express();
    private readonly passportConfig: PassportConfig = passportConfig;
    public readonly sequelize: Sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.host || 'localhost',
        port: Number.parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'postgres',
        models: [City, User, Space, Test, Appointment],
    });

    public configureApp(): void {
        // this.app.use(express.cookieParser());
        this.app.use(express.json({ limit: '10Kb' })); // NOTE
        this.app.use(express.static('public'));
        this.app.use(this.passportConfig.initializePassport());
        this.app.use(ApiRoutes.USERS, userRouter);
        this.app.use(ApiRoutes.AUTH, authRouter);
        this.app.use(ApiRoutes.SPACES, spaceRouter);
        this.app.use(ApiRoutes.APPOINTMENTS, appointmentRouter);
        this.app.use(globalErrorController);
    }

    public setupPassport(): void {
        // 1. извлекает из req.body username, password. 2. ищет пользователя по юзернейму и сверяет пароль по password. 3. если находит то пропускает вперед, соответственно разделяет jwt в дальнейшем уже после пропуска вперед,то это авторизация. А вот passport jwt это аутентификация
        // this.passportConfig.userSerialization();
        this.passportConfig.configurePassport();
    }
}

export const applicationInstance = SingletonFactory.produce<Application>(Application);

applicationInstance.setupPassport();
applicationInstance.configureApp();

export const app = applicationInstance.app;
