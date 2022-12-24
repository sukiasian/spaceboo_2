"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const locker_controller_1 = require("../controllers/locker.controller");
const enums_1 = require("../types/enums");
const RouteProtector_1 = require("../utils/RouteProtector");
const Singleton_1 = require("../utils/Singleton");
class LockerRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.controller = locker_controller_1.lockerController;
        this.passport = passport;
        this.router = (0, express_1.Router)();
        this.prepareRouter = () => {
            this.router
                .route('/')
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.adminOnlyProtector, this.controller.getLockersByQuery)
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.adminOnlyProtector, this.controller.pairLockerForSpace)
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), RouteProtector_1.RouteProtector.adminOnlyProtector, this.controller.unpairLockerForSpace);
        };
    }
}
const lockerRouter = Singleton_1.SingletonFactory.produce(LockerRouter);
lockerRouter.prepareRouter();
exports.router = lockerRouter.router;
//# sourceMappingURL=locker.router.js.map