import { Router } from 'express';
import * as passport from 'passport';
import { authController } from '../controllers/auth.controller';
import logger from '../loggers/logger';
import { LoggerLevels, PassportStrategies } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class AuthRouter extends Singleton implements IRouter {
    private readonly authController = authController;
    private readonly passport = passport;
    public readonly router = Router();

    // FIXME this as argument
    public prepareRouter = function (this: AuthRouter): void {
        this.router
            .route('/login')
            .post(
                this.passport.authenticate(PassportStrategies.LOCAL, { session: false }),
                this.authController.signInLocal
            );
        this.router.route('/signup').post(this.authController.signUpLocal);
        this.router
            .route('/facebook')
            .get(this.passport.authenticate(PassportStrategies.FACEBOOK), () =>
                logger.log({ level: LoggerLevels.INFO, message: 'signed up in Facebook' })
            );
        this.router.route('/facebook/callback').get((req, res) => {
            res.redirect('/');
            console.log('redirected');
        });
    };
}

// export const router = AuthRouter.getInstance<AuthRouter>(AuthRouter).prepareRouter();
const authRouter = SingletonFactory.produce<AuthRouter>(AuthRouter);

authRouter.prepareRouter();

export const router = authRouter.router;
