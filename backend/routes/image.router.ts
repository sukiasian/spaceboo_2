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
            .route('/users')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.imageController.uploadUserAvatarToStorage,
                this.imageController.updateUserAvatarInDb
            )
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.imageController.removeUserAvatarFromDb,
                this.imageController.removeUserAvatarFromStorage
            );

        this.router.route('/users/:userId').get(this.imageController.getUserAvatarByFilename);

        this.router
            .route('/spaces/:spaceId')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.routeProtector.spaceOwnerProtector,
                this.imageController.checkSpaceImagesAmount,
                this.imageController.uploadSpaceImagesToStorageGeneral,
                this.imageController.updateSpaceImagesInDb
            )
            .get(this.imageController.getSpacesImageByFilename)
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.routeProtector.spaceOwnerProtector,
                this.imageController.removeSpaceImagesFromDb,
                this.imageController.removeSpaceImagesFromStorage
            );

        this.router.get('/hello', (req, res) => {
            res.status(200).json({
                data: 'helloworld',
                message: 'some message',
            });
        });
    };
}

const imageRouter = SingletonFactory.produce<ImageRouter>(ImageRouter);

imageRouter.prepareRouter();

export const router = imageRouter.router;
