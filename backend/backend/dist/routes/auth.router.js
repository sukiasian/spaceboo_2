"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const auth_controller_1 = require("../controllers/auth.controller");
const logger_1 = require("../loggers/logger");
const enums_1 = require("../types/enums");
const RouteProtector_1 = require("../utils/RouteProtector");
const Singleton_1 = require("../utils/Singleton");
class AuthRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.authController = auth_controller_1.authController;
        this.routeProtector = RouteProtector_1.RouteProtector;
        this.passport = passport;
        this.router = express_1.Router();
        this.prepareRouter = () => {
            this.router
                .route('/login')
                .post(this.passport.authenticate(enums_1.PassportStrategies.LOCAL, { session: false }), this.authController.signInLocal);
            this.router.route('/signup').post(this.authController.signUpLocal);
            this.router
                .route('/passwordRecovery')
                .put(this.routeProtector.passwordRecoveryProtector, this.authController.editUserPassword);
            this.router
                .route('/passwordChange')
                .put(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.authController.editUserPassword);
            this.router.get('/userLoginState', this.authController.getUserLoginState);
            this.router.get('/logout', 
            // this.passport.authenticate(PassportStrategies.JWT, { session: false }),
            this.authController.logout);
            // нужно три разных роута - один отправлет письмо на имейл, другой должен проверить совпадает ли введенное значение, и если да - то позволить изменить пароль.
            /*
                - Если вышел с сайта, то все заново.
    
                При проверке key, если проверка проходит, то выдадим 15 минутный токен. При выходе токен можно  будет не  аннулировать, так как  это не противоречит безопасности.
                По этому токену будет происходить смена пароля - если токен действительный то пароль можно будет менять, если нет то нет.
    
                При отправке не нужно удалять из бд ничего - нам нужно это делать через крон джоб, очищать бд email-verifications.
            */
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
const authRouter = Singleton_1.SingletonFactory.produce(AuthRouter);
authRouter.prepareRouter();
exports.router = authRouter.router;
//# sourceMappingURL=auth.router.js.map