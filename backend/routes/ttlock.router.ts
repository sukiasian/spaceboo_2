import { Router } from 'express';
import { ttLockController, TTLockController } from '../controllers/ttlock.controller';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class TTLockRouter extends Singleton implements IRouter {
    private readonly ttLockController: TTLockController = ttLockController;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router.get('/unlock', RouteProtector.userHasActiveAppointment, this.ttLockController.unlock);
    };
}

const ttLockRouter = SingletonFactory.produce<TTLockRouter>(TTLockRouter);

ttLockRouter.prepareRouter();

export const router = ttLockRouter.router;
