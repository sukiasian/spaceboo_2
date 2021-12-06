import { Router } from 'express';
import * as passport from 'passport';
import { userController } from '../controllers/user.controller';
import { PassportStrategies } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class UserRouter extends Singleton implements IRouter {
    public readonly router = Router();
    private readonly passport = passport;
    private readonly userController = userController;

    public prepareRouter = (): void => {
        this.router
            .route('/')
            .put(this.passport.authenticate(PassportStrategies.JWT, { session: false }), this.userController.editUser);
    };
}

const userRouter = SingletonFactory.produce<UserRouter>(UserRouter);

userRouter.prepareRouter();

export const router = userRouter.router;
