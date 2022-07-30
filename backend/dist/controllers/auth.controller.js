"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const util_1 = require("util");
const jwt = require("jsonwebtoken");
const Singleton_1 = require("../utils/Singleton");
const enums_1 = require("../types/enums");
const auth_sequelize_dao_1 = require("../daos/auth.sequelize.dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const Email_1 = require("../emails/Email");
const user_model_1 = require("../models/user.model");
const AppError_1 = require("../utils/AppError");
class AuthController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.authSequelizeDao = auth_sequelize_dao_1.authSequelizeDao;
        this.utilFunctions = UtilFunctions_1.default;
        this.sendEmail = Email_1.sendMail;
        this.signUpLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
            const user = await this.authSequelizeDao.signUpLocal(req.body);
            await this.utilFunctions.signTokenAndStoreInCookies(res, { id: user.id });
            this.utilFunctions.sendResponse(res)(201, enums_1.ResponseMessages.USER_CREATED, user);
        });
        this.signInLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
            const user = await this.authSequelizeDao.findById(req.user.id);
            await this.utilFunctions.signTokenAndStoreInCookies(res, { id: user.id });
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, 'Добро пожаловать на Spaceboo!', user);
        });
        this.editUserPassword = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const recovery = req.user.recovery || false;
            const passwordData = req.body.passwordData;
            await this.authSequelizeDao.editUserPassword(userId, passwordData, recovery);
            recovery
                ? this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.PASSWORD_RECOVERED)
                : this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.PASSWORD_EDITED);
        });
        this.getUserLoginState = this.utilFunctions.catchAsync(async (req, res, next) => {
            const token = req.cookies['jwt'];
            let userLoginState = {
                loggedIn: false,
                confirmed: false,
            };
            if (token) {
                const verifyToken = util_1.promisify(jwt.verify);
                const payload = jwt.decode(token);
                const user = await this.authSequelizeDao.model.scope(user_model_1.UserScopes.WITH_CONFIRMED).findOne({
                    where: {
                        id: payload.id,
                    },
                });
                if (!user) {
                    userLoginState = {
                        loggedIn: false,
                        confirmed: false,
                    };
                    return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_NOT_FOUND, userLoginState);
                }
                const verifiedToken = await verifyToken(token, process.env.JWT_SECRET_KEY);
                if (verifiedToken) {
                    if (user.confirmed) {
                        userLoginState = {
                            loggedIn: true,
                            confirmed: true,
                        };
                        return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IS_CONFIRMED, userLoginState);
                    }
                    else {
                        userLoginState = {
                            loggedIn: true,
                            confirmed: false,
                        };
                        return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IS_LOGGED_IN, userLoginState);
                    }
                }
            }
            return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IS_NOT_LOGGED_IN, userLoginState);
            // FIXME нужно при ошибке отправлять еще один запрос на проверку - делаться должно это в саге
        });
        this.logout = this.utilFunctions.catchAsync(async (req, res, next) => {
            const cookie = req.cookies['jwt'];
            if (cookie) {
                res.clearCookie('jwt');
                return this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.LOGGED_OUT);
            }
            throw new AppError_1.default(enums_1.HttpStatus.UNAUTHORIZED, enums_1.ErrorMessages.NOT_AUTHORIZED);
        });
    }
}
exports.AuthController = AuthController;
exports.authController = Singleton_1.SingletonFactory.produce(AuthController);
//# sourceMappingURL=auth.controller.js.map