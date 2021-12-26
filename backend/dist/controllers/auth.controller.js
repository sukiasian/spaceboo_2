"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const util_1 = require("util");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Singleton_1 = require("../utils/Singleton");
const enums_1 = require("../types/enums");
const auth_sequelize_dao_1 = require("../daos/auth.sequelize.dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
dotenv.config();
class AuthController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = auth_sequelize_dao_1.authSequelizeDao;
        this.signUpLocal = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const user = await this.dao.signUpLocal(req.body);
            await this.signTokenAndStoreInCookies(user.id, res);
            UtilFunctions_1.default.sendResponse(res)(201, enums_1.ResponseMessages.USER_CREATED, user);
            // NOTE not sure if we need to return the user here - need to check one more time.
        });
        this.signInLocal = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const user = await this.dao.findById(req.user.id);
            await this.signTokenAndStoreInCookies(user.id, res);
            UtilFunctions_1.default.sendResponse(res)(enums_1.HttpStatus.OK, 'Добро пожаловать на Spaceboo!', user);
        });
        this.signOut = () => { }; // NOTE NOTE NOTE this should be done on the client side
        this.signTokenAndStoreInCookies = async (userId, res) => {
            const signToken = util_1.promisify(jwt.sign);
            const token = await signToken(userId, process.env.JWT_SECRET_KEY);
            const cookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + 90 * 24 * 3600000),
                secure: false,
            };
            if (process.env.NODE_ENV === enums_1.Environment.PRODUCTION) {
                cookieOptions.secure = true;
            }
            res.cookie('jwt', token, cookieOptions);
        };
    }
}
exports.AuthController = AuthController;
exports.authController = Singleton_1.SingletonFactory.produce(AuthController);
//# sourceMappingURL=auth.controller.js.map