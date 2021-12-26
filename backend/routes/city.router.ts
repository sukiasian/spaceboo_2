import { Router } from 'express';
import { cityController, CityController } from '../controllers/city.controller';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class CityRouter extends Singleton implements IRouter {
    private readonly cityController: CityController = cityController;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router.route('/').get(this.cityController.getCitiesByQuery);
    };
}

const cityRouter = SingletonFactory.produce<CityRouter>(CityRouter);

cityRouter.prepareRouter();

export const router = cityRouter.router;
