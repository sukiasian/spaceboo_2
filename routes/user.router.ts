import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class UserRouter extends Singleton implements IRouter {
    private readonly authController = authController;
    private readonly userController = userController;
    public readonly router = Router();

    public prepareRouter = function (this: UserRouter): void {
        // FIXME 2 routes with same request type ?
        this.router.route('/').post(this.userController.findUserById);
        this.router.route('/').post(this.authController.signUpLocal);
    };
}

const userRouter = SingletonFactory.produce<UserRouter>(UserRouter);

userRouter.prepareRouter();

export const router = userRouter.router;
