"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const user_controller_1 = require("../controllers/user.controller");
const Singleton_1 = require("../utils/Singleton");
class UserRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.authController = auth_controller_1.authController;
        this.userController = user_controller_1.userController;
        this.router = express_1.Router();
        this.prepareRouter = function () {
            this.router.route('/').post(this.userController.findUserById);
            this.router.route('/').post(this.authController.signUpLocal);
        };
    }
}
const userRouter = Singleton_1.SingletonFactory.produce(UserRouter);
userRouter.prepareRouter();
exports.router = userRouter.router;
//# sourceMappingURL=user.router.js.map