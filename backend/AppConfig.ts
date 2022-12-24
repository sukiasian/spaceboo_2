import * as express from 'express';
import { Sequelize } from 'sequelize-typescript';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import { router as userRouter } from './routes/user.router';
import { router as spaceRouter } from './routes/space.router';
import { router as authRouter } from './routes/auth.router';
import { router as appointmentRouter } from './routes/appointment.router';
import { router as imageRouter } from './routes/image.router';
import { router as emailVerificationRouter } from './routes/email-verification.router';
import { router as cityRouter } from './routes/city.router';
import { router as lockerRouter } from './routes/locker.router';
import { router as lockerRequestRouter } from './routes/locker-request.router';
import { router as ttLockRouter } from './routes/ttlock.router';
import { ApiRoutes, Environment } from './types/enums';
import globalErrorController from './controllers/error.controller';
import { Singleton, SingletonFactory } from './utils/Singleton';
import { User } from './models/user.model';
import { Space } from './models/space.model';
import { passportConfig, PassportConfig } from './configurations/passport.config';
import { City } from './models/city.model';
import { Appointment } from './models/appointment.model';
import { EmailVerification } from './models/email-verification.model';
import { District } from './models/district.model';
import { Region } from './models/region.model';
import * as cors from 'cors';
import CorsConfig from './configurations/cors.config';
import helmet from 'helmet';
import { Locker } from './models/locker.model';
import { LockerRequest } from './models/locker-request.model';

export class AppConfig extends Singleton {
    public readonly app: express.Express = express();
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
        models: [District, Region, City, User, Space, Appointment, EmailVerification, Locker, LockerRequest],
        logging: false,
    });
    private readonly passportConfig: PassportConfig = passportConfig;
    private readonly corsConfig: typeof CorsConfig = CorsConfig;

    public configureApp = (): void => {
        if (process.env.NODE_ENV === Environment.PRODUCTION) {
            this.app.use(cors(this.corsConfig.corsOptions));
        }

        this.app.use(helmet());
        this.app.use(express.json({ limit: '10Kb' }));
        this.app.use(express.static('assets/images'));
        this.app.use(cookieParser());
        this.app.use(this.passportConfig.initializePassport());
        this.app.use(ApiRoutes.USERS, userRouter);
        this.app.use(ApiRoutes.AUTH, authRouter);
        this.app.use(ApiRoutes.EMAIL_VERIFICATION, emailVerificationRouter);
        this.app.use(ApiRoutes.SPACES, spaceRouter);
        this.app.use(ApiRoutes.APPOINTMENTS, appointmentRouter);
        this.app.use(ApiRoutes.LOCKERS, lockerRouter);
        this.app.use(ApiRoutes.LOCKER_REQUESTS, lockerRequestRouter);
        this.app.use(ApiRoutes.TTLOCK, ttLockRouter);
        this.app.use(ApiRoutes.IMAGES, imageRouter);
        this.app.use(ApiRoutes.CITIES, cityRouter);

		if (process.env.NODE_ENV === 'production') {
			this.app.use(
				'/',
				express.static(
					path.resolve('../frontend', 'build')
				)
			)
		
			this.app.get('*', (req, res) => {
				res.sendFile(
					path.resolve(
						'../frontend',
						'build',
						'index.html'
					)
				)
			})
		}

        this.app.use(globalErrorController);
    };

    public setupPassport = (): void => {
        this.passportConfig.configurePassport();
    };
}

export const appConfig = SingletonFactory.produce<AppConfig>(AppConfig);

appConfig.setupPassport();
appConfig.configureApp();
