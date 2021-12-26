"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const space_controller_1 = require("../controllers/space.controller");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
class SpaceRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.spaceController = space_controller_1.spaceController;
        this.router = express_1.Router();
        this.passport = passport;
        this.prepareRouter = function () {
            this.router
                .route('/')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.spaceController.createSpace);
            this.router.route('/').get(this.spaceController.getSpacesByQuery);
            this.router.route('/:id').get(this.spaceController.getSpaceById);
        };
    }
}
const spaceRouter = Singleton_1.SingletonFactory.produce(SpaceRouter);
spaceRouter.prepareRouter();
exports.router = spaceRouter.router;
//# sourceMappingURL=space.router.js.map