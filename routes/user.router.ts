import { Router } from 'express';
import * as passport from 'passport';
import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { PassportStrategies } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class UserRouter extends Singleton implements IRouter {
    public readonly router = Router();
    private readonly passport = passport;
    private readonly authController = authController;
    private readonly userController = userController;

    public prepareRouter = function (this: UserRouter): void {
        // this.router.route('/avatar').post(this.passport.authenticate(PassportStrategies.JWT), this.userController.updateUserAvatar)
    };
}

const userRouter = SingletonFactory.produce<UserRouter>(UserRouter);

userRouter.prepareRouter();

export const router = userRouter.router;
