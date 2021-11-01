import { Router } from 'express';
import * as passport from 'passport';
import { spaceController } from '../controllers/space.controller';
import { PassportStrategies } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class SpaceRouter extends Singleton implements IRouter {
    private readonly spaceController = spaceController;
    private readonly passport = passport;
    public readonly router = Router();

    public prepareRouter = function (this: SpaceRouter): void {
        this.router
            .route('/')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.spaceController.createSpace
            );
        this.router.route('/');
        this.router.route('/').get(this.spaceController.getSpacesByQuery);
        this.router.route('/:id').get(this.spaceController.getSpaceById);
    };
}

const spaceRouter = SingletonFactory.produce<SpaceRouter>(SpaceRouter);

spaceRouter.prepareRouter();

export const router = spaceRouter.router;
