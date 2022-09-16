import { Router } from 'express';
import * as passport from 'passport';
import { lockerRequestController, LockerRequestController } from '../controllers/locker-request.controller';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class LockerRequestRouter extends Singleton implements IRouter {
    private readonly controller: LockerRequestController = lockerRequestController;
    private readonly passport = passport;

    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/connection')
            .post(
                // NOTE: возможно можно обойтись только spaceOwnerProtector-ом, так как если spaceOwnerProtector будет пройден, это будет означать что пользователь авторизован.
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                RouteProtector.spaceOwnerProtector,
                this.controller.requestLocker
            )
            .get(RouteProtector.adminOnlyProtector, this.controller.getConnectionRequests);

        this.router
            .route('/return')
            .post(this.controller.requestLocker)
            .get(RouteProtector.adminOnlyProtector, () => {});
    };
}

const lockerRequestRouter = SingletonFactory.produce<LockerRequestRouter>(LockerRequestRouter);

lockerRequestRouter.prepareRouter();

export const router = lockerRequestRouter.router;
