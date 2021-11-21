import { Router } from 'express';
import * as passport from 'passport';
import { StorageUploadFilenames, userAvatarUpload } from '../configurations/storage.config';
import { spaceImageUpload } from '../configurations/storage.config';
import { imageController } from '../controllers/image.controller';
import { spaceController } from '../controllers/space.controller';
import { userController } from '../controllers/user.controller';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class ImageRouter extends Singleton implements IRouter {
    private readonly routeProtector = RouteProtector;
    private readonly imageController = imageController;
    private readonly userController = userController;
    private readonly spaceController = spaceController;
    private readonly passport = passport;
    private readonly userAvatarUpload = userAvatarUpload;
    private readonly spaceImageUpload = spaceImageUpload;
    public readonly router = Router();

    public prepareRouter = (): void => {
        // FIXME если в req есть и space, и user (req.space by spaceOwnerProtector, req.user by passport.authenticate('JWT'))
        // то нет необходимости передавать req.params
        this.router
            .route('/users')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.imageController.multerUploadHandler(
                    this.userAvatarUpload.single(StorageUploadFilenames.USER_AVATAR)
                ),
                this.userController.updateUserAvatar
            )
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.imageController.destroyOutdatedUserAvatar
            );

        this.router.route('/users/:userId').get(this.imageController.getUserAvatarByFilename);

        this.router
            .route('/spaces/:spaceId')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.routeProtector.spaceOwnerProtector,
                this.imageController.multerUploadHandler(
                    this.spaceImageUpload.array(StorageUploadFilenames.SPACE_IMAGE)
                ),
                this.spaceController.updateSpaceImages
            )
            .get(this.imageController.getSpacesImageByFilename)
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.routeProtector.spaceOwnerProtector,
                this.imageController.destroyOutdatedSpaceImage
            );
    };
}

const imageRouter = SingletonFactory.produce<ImageRouter>(ImageRouter);

imageRouter.prepareRouter();

export const router = imageRouter.router;
