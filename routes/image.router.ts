import { Router } from 'express';
import * as passport from 'passport';
import { userImagesUpload } from '../configurations/storage.config';
import { imageController } from '../controllers/image.controller';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class ImageRouter extends Singleton implements IRouter {
    private readonly routeProtector = RouteProtector;
    private readonly imageController = imageController;
    private readonly userImagesUpload = userImagesUpload;
    private readonly passport = passport;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/user')
            .post(this.passport.authenticate(PassportStrategies.JWT), this.imageController.uploadUserAvatar);

        this.router
            .route('/user/userAvatar')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                userImagesUpload.single('userAvatar'),
                this.imageController.uploadUserAvatar
            );

        this.router.route('/user/userAvatar/:userId').get(this.imageController.getUserAvatar);
        this.router.route('/user/userAvatar/:spaceId').get(this.imageController.getSpacesImages);
        // the way is to send userId/spaceId and fileName in req.body and use one function only
    };
}

const imageRouter = SingletonFactory.produce<ImageRouter>(ImageRouter);

imageRouter.prepareRouter();

export const router = imageRouter.router;
