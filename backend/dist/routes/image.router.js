"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const image_controller_1 = require("../controllers/image.controller");
const enums_1 = require("../types/enums");
const RouteProtector_1 = require("../utils/RouteProtector");
const Singleton_1 = require("../utils/Singleton");
class ImageRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.routeProtector = RouteProtector_1.RouteProtector;
        this.imageController = image_controller_1.imageController;
        this.passport = passport;
        this.router = express_1.Router();
        this.prepareRouter = () => {
            this.router
                .route('/user')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.imageController.uploadUserAvatarToStorage, this.imageController.updateUserAvatarInDb)
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.imageController.removeUserAvatarFromStorage, this.imageController.removeUserAvatarFromDb);
        };
    }
}
const imageRouter = Singleton_1.SingletonFactory.produce(ImageRouter);
imageRouter.prepareRouter();
exports.router = imageRouter.router;
//# sourceMappingURL=image.router.js.map