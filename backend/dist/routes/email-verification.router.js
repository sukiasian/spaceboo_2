"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.EmailPurpose = void 0;
const express_1 = require("express");
const email_verification_controller_1 = require("../controllers/email-verification.controller");
const Middleware_1 = require("../utils/Middleware");
const Singleton_1 = require("../utils/Singleton");
var EmailPurpose;
(function (EmailPurpose) {
    EmailPurpose[EmailPurpose["EMAIL_CONFIRMATION"] = 10] = "EMAIL_CONFIRMATION";
    EmailPurpose[EmailPurpose["PASSWORD_RECOVERY"] = 11] = "PASSWORD_RECOVERY";
})(EmailPurpose = exports.EmailPurpose || (exports.EmailPurpose = {}));
class EmailVerificationRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.emailVerificationController = email_verification_controller_1.emailVerificationController;
        this.middleware = Middleware_1.Middleware;
        this.router = express_1.Router();
        this.prepareRouter = () => {
            this.router
                .route('/')
                .post(this.middleware.retrieveEmailFromRequest, this.emailVerificationController.checkVerificationCodeAndProcessRequest);
            this.router
                .route('/:purpose')
                .post(this.middleware.retrieveEmailFromRequest, this.emailVerificationController.sendVerificationCodeByPurpose);
        };
    }
}
// export const router = AuthRouter.getInstance<AuthRouter>(AuthRouter).prepareRouter();
const emailVerificationRouter = Singleton_1.SingletonFactory.produce(EmailVerificationRouter);
emailVerificationRouter.prepareRouter();
exports.router = emailVerificationRouter.router;
//# sourceMappingURL=email-verification.router.js.map