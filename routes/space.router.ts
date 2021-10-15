import { Router } from 'express';
import { spaceController } from '../controllers/space.controller';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class SpaceRouter extends Singleton implements IRouter {
    private readonly spaceController = spaceController;
    public readonly router = Router();

    public prepareRouter = function (this: SpaceRouter): void {
        this.router.route('/').post(this.spaceController.createSpace);
        this.router.route('/').get(this.spaceController.getSpacesByQuery);
        this.router.route('/:id').get(this.spaceController.getSpaceById);
    };
}

const spaceRouter = SingletonFactory.produce<SpaceRouter>(SpaceRouter);

spaceRouter.prepareRouter();

export const router = spaceRouter.router;
