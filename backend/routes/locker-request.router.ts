import { Router } from 'express';
import * as passport from 'passport';
import { lockerRequestController, LockerRequestController } from '../controllers/locker-request.controller';
import { PassportStrategies } from '../types/enums';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class LockerRequestRouter extends Singleton implements IRouter {
    private readonly lockerRequestController: LockerRequestController = lockerRequestController;
    private readonly passport = passport;

    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router.get(
            '/',
            this.passport.authenticate(PassportStrategies.JWT, { session: false }),
            RouteProtector.adminOnlyProtector,
            this.lockerRequestController.getRequestsByQuery
        );

        this.router.get(
            '/amount',
            this.passport.authenticate(PassportStrategies.JWT, { session: false }),
            RouteProtector.adminOnlyProtector,
            this.lockerRequestController.getRequestsAmount
        );

        this.router
            .route('/:requestId')
            .delete(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                RouteProtector.adminOrSpaceOwnerProtector,
                this.lockerRequestController.deleteRequestById
            );

        this.router.route('/connection').post(
            // NOTE: возможно можно обойтись только spaceOwnerProtector-ом, так как если spaceOwnerProtector будет пройден, это будет означать что пользователь авторизован.
            this.passport.authenticate(PassportStrategies.JWT, { session: false }),
            RouteProtector.spaceOwnerProtector,
            this.lockerRequestController.requestLocker
        );

        this.router.route('/return').post(this.lockerRequestController.requestLocker);
    };
}

const lockerRequestRouter = SingletonFactory.produce<LockerRequestRouter>(LockerRequestRouter);

lockerRequestRouter.prepareRouter();

export const router = lockerRequestRouter.router;
