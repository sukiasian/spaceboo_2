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
                .route('/users')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.imageController.uploadUserAvatarToStorage, this.imageController.updateUserAvatarInDb)
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.imageController.removeUserAvatarFromDb, this.imageController.removeUserAvatarFromStorage);
            this.router.route('/users/:userId').get(this.imageController.getUserAvatarByFilename);
            this.router
                .route('/spaces/:spaceId')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.routeProtector.spaceOwnerProtector, this.imageController.checkSpaceImagesAmount, this.imageController.uploadSpaceImagesToStorageGeneral, this.imageController.updateSpaceImagesInDb)
                .get(this.imageController.getSpacesImageByFilename)
                .delete(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.routeProtector.spaceOwnerProtector, this.imageController.removeSpaceImagesFromDb, this.imageController.removeSpaceImagesFromStorage);
            this.router.get('/hello', (req, res) => {
                res.status(200).json({
                    data: 'helloworld',
                    message: 'some message',
                });
            });
        };
    }
}
const imageRouter = Singleton_1.SingletonFactory.produce(ImageRouter);
imageRouter.prepareRouter();
exports.router = imageRouter.router;
//# sourceMappingURL=image.router.js.map