"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const user_controller_1 = require("../controllers/user.controller");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
class UserRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.router = express_1.Router();
        this.passport = passport;
        this.userController = user_controller_1.userController;
        this.prepareRouter = () => {
            this.router
                .route('/')
                .put(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.userController.editUser);
        };
    }
}
const userRouter = Singleton_1.SingletonFactory.produce(UserRouter);
userRouter.prepareRouter();
exports.router = userRouter.router;
//# sourceMappingURL=user.router.js.map