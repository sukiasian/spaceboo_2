import { Router } from 'express';
import * as passport from 'passport';
import { authController } from '../controllers/auth.controller';
import logger from '../loggers/logger';
import { LoggerLevels, PassportStrategies } from '../types/enums';
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

        this.router.get('/userIsLoggedIn', this.authController.userIsLoggedIn);
        // нужно три разных роута - один отправлет письмо на имейл, другой должен проверить совпадает ли введенное значение, и если да - то позволить изменить пароль.
        /* 
            - Если вышел с сайта, то все заново. 

            При проверке key, если проверка проходит, то выдадим 15 минутный токен. При выходе токен можно  будет не  аннулировать, так как  это не противоречит безопасности. 
            По этому токену будет происходить смена пароля - если токен действительный то пароль можно будет менять, если нет то нет.

            При отправке не нужно удалять из бд ничего - нам нужно это делать через крон джоб, очищать бд email-verifications.
        */
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
