import { Router } from 'express';
import * as passport from 'passport';
import { authController } from '../controllers/auth.controller';
import logger from '../loggers/logger';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class AuthRouter extends Singleton implements IRouter {
    private readonly authController = authController;
    private readonly routeProtector = RouteProtector;
    private readonly passport = passport;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/login')
            .post(
                this.passport.authenticate(PassportStrategies.LOCAL, { session: false }),
                this.authController.signInLocal
            );
        this.router.route('/signup').post(this.authController.signUpLocal);

        this.router
            .route('/passwordRecovery')
            .put(this.routeProtector.passwordRecoveryProtector, this.authController.editUserPassword);

        this.router
            .route('/passwordChange')
            .put(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.authController.editUserPassword
            );

        this.router.get('/userLoginState', this.authController.getUserLoginState);

        this.router.get('/logout', this.authController.logout);

        this.router
            .route('/facebook')
            .get(this.passport.authenticate(PassportStrategies.FACEBOOK), () => logger.info('signed up in Facebook'));
        this.router.route('/facebook/callback').get((req, res) => {
            res.redirect('/');
            console.log('Redirected');
        });
    };
}

const authRouter = SingletonFactory.produce<AuthRouter>(AuthRouter);

authRouter.prepareRouter();

export const router = authRouter.router;
