"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
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
        this.router = express_1.Router();
        this.prepareRouter = () => {
            this.router
                .route('/')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.imageController.uploadSpaceImagesToStorage, this.spaceController.provideSpace, this.imageController.updateSpaceImagesInDb)
                .get(this.spaceController.getSpacesByQuery);
            this.router
                .route('/user')
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.spaceController.getSpacesByUserId);
            this.router
                .route('/:spaceId')
                .get(this.spaceController.getSpaceById)
                .put(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.routeProtector.spaceOwnerProtector, this.imageController.checkSpaceImagesAvailableAmount, this.imageController.uploadSpaceImagesToStorage, this.spaceController.editSpaceById, this.imageController.updateSpaceImagesInDb)
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.routeProtector.spaceOwnerProtector, this.spaceController.deleteSpaceById);
            this.router
                .route('/appointed/outdated')
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.spaceController.getSpacesForUserOutdatedAppointmentsIds);
            this.router
                .route('/appointed/active')
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.spaceController.getSpacesForUserActiveAppointmentsIds);
            this.router
                .route('/appointed/upcoming')
                .get(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.spaceController.getSpacesForUserUpcomingAppointmentsIds);
            this.router.route('appointed/keyControl');
        };
    }
}
const spaceRouter = Singleton_1.SingletonFactory.produce(SpaceRouter);
spaceRouter.prepareRouter();
exports.router = spaceRouter.router;
//# sourceMappingURL=space.router.js.map