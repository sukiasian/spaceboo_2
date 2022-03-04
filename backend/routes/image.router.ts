import { Router } from 'express';
import * as passport from 'passport';
import { imageController } from '../controllers/image.controller';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class ImageRouter extends Singleton implements IRouter {
    private readonly routeProtector = RouteProtector;
    private readonly imageController = imageController;
    private readonly passport = passport;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/user')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.imageController.uploadUserAvatarToStorage,
                this.imageController.updateUserAvatarInDb
            )
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.imageController.removeUserAvatarFromStorage,
                this.imageController.removeUserAvatarFromDb
            );
    };
}

const imageRouter = SingletonFactory.produce<ImageRouter>(ImageRouter);

imageRouter.prepareRouter();

export const router = imageRouter.router;
