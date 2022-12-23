import { Router } from 'express';
import * as passport from 'passport';
import { lockerController, LockerController } from '../controllers/locker.controller';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class LockerRouter extends Singleton implements IRouter {
    private readonly controller: LockerController = lockerController;
    private readonly passport = passport;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/')
            .get(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                RouteProtector.adminOnlyProtector,
                this.controller.getLockersByQuery
            )
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                RouteProtector.adminOnlyProtector,
                this.controller.pairLockerForSpace
            )
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                RouteProtector.adminOnlyProtector,
                this.controller.unpairLockerForSpace
            );
    };
}

const lockerRouter = SingletonFactory.produce<LockerRouter>(LockerRouter);

lockerRouter.prepareRouter();

export const router = lockerRouter.router;
