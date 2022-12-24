"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const city_controller_1 = require("../controllers/city.controller");
const Singleton_1 = require("../utils/Singleton");
class CityRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.cityController = city_controller_1.cityController;
        this.router = (0, express_1.Router)();
        this.prepareRouter = () => {
            this.router.route('/').get(this.cityController.getCitiesByQuery);
        };
    }
}
const cityRouter = Singleton_1.SingletonFactory.produce(CityRouter);
cityRouter.prepareRouter();
exports.router = cityRouter.router;
// ttlock/locker?type=0, где 0 unlock 1 lock
//# sourceMappingURL=city.router.js.map