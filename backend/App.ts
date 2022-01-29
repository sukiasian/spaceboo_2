import * as express from 'express';
import { Sequelize } from 'sequelize-typescript';
import * as cookieParser from 'cookie-parser';
import { router as userRouter } from './routes/user.router';
import { router as spaceRouter } from './routes/space.router';
import { router as authRouter } from './routes/auth.router';
import { router as appointmentRouter } from './routes/appointment.router';
import { router as imageRouter } from './routes/image.router';
import { router as emailVerificationRouter } from './routes/email-verification.router';
import { router as cityRouter } from './routes/city.router';
import { ApiRoutes } from './types/enums';
import globalErrorController from './controllers/error.controller';
import { Singleton, SingletonFactory } from './utils/Singleton';
import { User } from './models/user.model';
import { Space } from './models/space.model';
import { passportConfig, PassportConfig } from './configurations/passport.config';
import { City } from './models/city.model';
import { Appointment } from './models/appointment.model';
import { EmailVerification } from './models/email-verification.model';

export class Application extends Singleton {
    public readonly app: express.Express = express();
    private readonly passportConfig: PassportConfig = passportConfig;

    public readonly sequelize: Sequelize = new Sequelize({
        dialect: 'postgres',
        dialectOptions: {
            multipleStatements: true,
        },
        host: process.env.host || 'localhost',
        port: Number.parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'postgres',
        models: [City, User, Space, Appointment, EmailVerification],
        logging: false,
    });

    public configureApp(): void {
        this.app.use(express.json({ limit: '10Kb' })); // NOTE
        this.app.use(express.static('public'));
        this.app.use(cookieParser());
        this.app.use(this.passportConfig.initializePassport());
        this.app.use(ApiRoutes.USERS, userRouter);
        this.app.use(ApiRoutes.AUTH, authRouter);
        this.app.use(ApiRoutes.EMAIL_VERIFICATION, emailVerificationRouter);
        this.app.use(ApiRoutes.SPACES, spaceRouter);
        this.app.use(ApiRoutes.APPOINTMENTS, appointmentRouter);
        this.app.use(ApiRoutes.IMAGES, imageRouter);
        this.app.use(ApiRoutes.CITIES, cityRouter);
        this.app.use(globalErrorController);
    }

    public setupPassport(): void {
        this.passportConfig.configurePassport();
    }
}

export const applicationInstance = SingletonFactory.produce<Application>(Application);

applicationInstance.setupPassport();
applicationInstance.configureApp();

export const app = applicationInstance.app;
