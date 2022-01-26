"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const storage_config_1 = require("../configurations/storage.config");
const image_controller_1 = require("../controllers/image.controller");
const space_controller_1 = require("../controllers/space.controller");
const enums_1 = require("../types/enums");
const RouteProtector_1 = require("../utils/RouteProtector");
const Singleton_1 = require("../utils/Singleton");
class SpaceRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.spaceController = space_controller_1.spaceController;
        this.imageController = image_controller_1.imageController;
        this.passport = passport;
        this.routeProtector = RouteProtector_1.RouteProtector;
        this.multerFormDataParser = storage_config_1.multerFormDataParser;
        this.router = express_1.Router();
        this.prepareRouter = () => {
            this.router
                .route('/')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.multerFormDataParser.none(), this.spaceController.provideSpace, this.imageController.checkSpaceImagesAmount, this.imageController.uploadSpaceImageToStorageForProvideSpace, this.spaceController.sendProvideSpaceResponse)
                .get(this.spaceController.getSpacesByQuery);
            this.router
                .route('/:spaceId')
                .get(this.spaceController.getSpaceById)
                .put(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.routeProtector.spaceOwnerProtector, this.spaceController.editSpaceById)
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.routeProtector.spaceOwnerProtector, this.spaceController.deleteSpaceById);
        };
    }
}
const spaceRouter = Singleton_1.SingletonFactory.produce(SpaceRouter);
spaceRouter.prepareRouter();
exports.router = spaceRouter.router;
//# sourceMappingURL=space.router.js.map