"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const locker_request_controller_1 = require("../controllers/locker-request.controller");
const enums_1 = require("../types/enums");
const RouteProtector_1 = require("../utils/RouteProtector");
const Singleton_1 = require("../utils/Singleton");
class LockerRequestRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.lockerRequestController = locker_request_controller_1.lockerRequestController;
        this.passport = passport;
        this.router = (0, express_1.Router)();
        this.prepareRouter = () => {
            this.router.get('/', this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.adminOnlyProtector, this.lockerRequestController.getRequestsByQuery);
            this.router
                .route('/:requestId')
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.adminOrSpaceOwnerProtector, this.lockerRequestController.deleteRequestById);
            this.router.get('/amount', this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.adminOnlyProtector, this.lockerRequestController.getRequestsAmount);
            this.router.route('/connection').post(
            // NOTE: возможно можно обойтись только spaceOwnerProtector-ом, так как если spaceOwnerProtector будет пройден, это будет означать что пользователь авторизован.
            this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.spaceOwnerProtector, this.lockerRequestController.requestLocker);
            this.router
                .route('/return')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.spaceOwnerProtector, this.lockerRequestController.createReturnRequest);
        };
    }
}
const lockerRequestRouter = Singleton_1.SingletonFactory.produce(LockerRequestRouter);
lockerRequestRouter.prepareRouter();
exports.router = lockerRequestRouter.router;
//# sourceMappingURL=locker-request.router.js.map