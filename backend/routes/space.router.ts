import { Router } from 'express';
import multer = require('multer');
import * as passport from 'passport';
import { multerFormDataParser, spaceImagesUpload, StorageUploadFilenames } from '../configurations/storage.config';
import { ImageController, imageController } from '../controllers/image.controller';
import { SpaceController, spaceController } from '../controllers/space.controller';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class SpaceRouter extends Singleton implements IRouter {
    private readonly spaceController: SpaceController = spaceController;
    private readonly imageController: ImageController = imageController;
    private readonly passport = passport;
    private readonly routeProtector = RouteProtector;
    private readonly multerFormDataParser = multerFormDataParser;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                // this.multerFormDataParser.any(),
                this.spaceController.provideSpace,
                this.imageController.checkSpaceImagesAmount,
                this.imageController.uploadSpaceImageToStorageForProvideSpace,
                this.spaceController.sendProvideSpaceResponse
            )
            .get(this.spaceController.getSpacesByQuery);

        this.router
            .route('/:spaceId')
            .get(this.spaceController.getSpaceById)
            .put(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.routeProtector.spaceOwnerProtector,
                this.spaceController.editSpaceById
            )
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.routeProtector.spaceOwnerProtector,
                this.spaceController.deleteSpaceById
            );
    };
}

const spaceRouter = SingletonFactory.produce<SpaceRouter>(SpaceRouter);

spaceRouter.prepareRouter();

export const router = spaceRouter.router;
