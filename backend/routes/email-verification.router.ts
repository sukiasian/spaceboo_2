import { Router } from 'express';
import * as passport from 'passport';
import { authController } from '../controllers/auth.controller';
import { EmailVerificationController, emailVerificationController } from '../controllers/email-verification.controller';
import logger from '../loggers/logger';
import { LoggerLevels, PassportStrategies } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

export enum EmailPurpose {
    EMAIL_CONFIRMATION = 10,
    PASSWORD_RECOVERY = 11,
}

class EmailVerificationRouter extends Singleton implements IRouter {
    private readonly emailVerificationController: EmailVerificationController = emailVerificationController;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router.route('/').post(this.emailVerificationController.checkVerificationCode);

        this.router.route('/:purpose').post(this.emailVerificationController.sendVerificationCodeByPurpose);
    };
}

// export const router = AuthRouter.getInstance<AuthRouter>(AuthRouter).prepareRouter();
const emailVerificationRouter = SingletonFactory.produce<EmailVerificationRouter>(EmailVerificationRouter);

emailVerificationRouter.prepareRouter();

export const router = emailVerificationRouter.router;
