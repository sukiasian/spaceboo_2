"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const auth_controller_1 = require("../controllers/auth.controller");
const logger_1 = require("../loggers/logger");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
class AuthRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.authController = auth_controller_1.authController;
        this.passport = passport;
        this.router = express_1.Router();
        // FIXME this as argument
        this.prepareRouter = function () {
            this.router
                .route('/login')
                .post(this.passport.authenticate(enums_1.PassportStrategies.LOCAL, { session: false }), this.authController.signInLocal);
            this.router.route('/signup').post(this.authController.signUpLocal);
            this.router
                .route('/facebook')
                .get(this.passport.authenticate(enums_1.PassportStrategies.FACEBOOK), () => logger_1.default.log({ level: enums_1.LoggerLevels.INFO, message: 'signed up in Facebook' }));
            this.router.route('/facebook/callback').get((req, res) => {
                res.redirect('/');
                console.log('redirected');
            });
        };
    }
}
// export const router = AuthRouter.getInstance<AuthRouter>(AuthRouter).prepareRouter();
const authRouter = Singleton_1.SingletonFactory.produce(AuthRouter);
authRouter.prepareRouter();
exports.router = authRouter.router;
//# sourceMappingURL=auth.router.js.map