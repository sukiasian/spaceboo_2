"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const ttlock_controller_1 = require("../controllers/ttlock.controller");
const RouteProtector_1 = require("../utils/RouteProtector");
const Singleton_1 = require("../utils/Singleton");
class TTLockRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.ttLockController = ttlock_controller_1.ttLockController;
        this.router = (0, express_1.Router)();
        this.prepareRouter = () => {
            this.router.get('/unlock', RouteProtector_1.RouteProtector.userHasActiveAppointment, this.ttLockController.unlock);
        };
    }
}
const ttLockRouter = Singleton_1.SingletonFactory.produce(TTLockRouter);
ttLockRouter.prepareRouter();
exports.router = ttLockRouter.router;
//# sourceMappingURL=ttlock.router.js.map