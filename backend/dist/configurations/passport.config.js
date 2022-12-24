"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportConfig = exports.PassportConfig = void 0;
const passport = require("passport");
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const Singleton_1 = require("../utils/Singleton");
const user_model_1 = require("../models/user.model");
const enums_1 = require("../types/enums");
const logger_1 = require("../loggers/logger");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
const AppError_1 = require("../utils/AppError");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const Redis_1 = require("../Redis");
class PassportConfig extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.userDao = user_sequelize_dao_1.userSequelizeDao;
        this.userModel = user_model_1.User;
        this.passport = passport;
        this.redisClient = Redis_1.redis.client;
        this.utilFunctions = UtilFunctions_1.default;
        this.attemptsAllowed = process.env.NODE_ENV === enums_1.Environment.DEVELOPMENT ? '100' : '7';
        this.assignAvailableAttempts = async (key) => {
            const loginAttemptsValue = await this.redisClient.get(key);
            if (loginAttemptsValue === null) {
                await this.redisClient.set(key, '1');
            }
            else if (loginAttemptsValue === this.attemptsAllowed) {
                // FIXME: change the value from 0.1 to 60 * 30
                await this.redisClient.setEx(key, 5, this.attemptsAllowed);
            }
            else {
                await this.redisClient.set(key, `${this.utilFunctions.makeDecimal(loginAttemptsValue) + 1}`);
            }
        };
        this.outOfAttempts = async (key) => {
            var _a;
            const loginAttemptsValue = await this.redisClient.get(key);
            return (_a = loginAttemptsValue === this.attemptsAllowed) !== null && _a !== void 0 ? _a : false;
        };
        this.handleAttempts = async (ip) => {
            const loginAttemptsKey = `${enums_1.RedisVariable.LOGIN_ATTEMPTS}:${ip}`;
            await this.assignAvailableAttempts(loginAttemptsKey);
            const outOfAttempts = await this.outOfAttempts(loginAttemptsKey);
            if (outOfAttempts) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.WAIT_TO_ATTEMPT_AGAIN);
            }
        };
        this.annualizeAttempts = async (ip) => {
            await this.redisClient.set(`${enums_1.RedisVariable.LOGIN_ATTEMPTS}:${ip}`, '0');
        };
    }
    initializePassport() {
        return this.passport.initialize();
    }
    configurePassport() {
        const tokenExtractorFromCookie = (req) => {
            let token;
            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }
            return token;
        };
        this.passport.use(new passport_local_1.Strategy({ usernameField: 'email', passwordField: 'password', session: false, passReqToCallback: true }, async (req, email, password, done) => {
            try {
                let user;
                user = await this.userModel.scope(user_model_1.UserScopes.WITH_PASSWORD).findOne({ where: { email } });
                await this.handleAttempts(req.ip);
                if (!user || !(await user.verifyPassword(user)(password))) {
                    return done(new AppError_1.default(enums_1.HttpStatus.UNAUTHORIZED, enums_1.ErrorMessages.USERNAME_OR_PASSWORD_INCORRECT), false);
                }
                user = await this.userModel.findOne({ raw: true, where: { email } });
                await this.annualizeAttempts(req.ip);
                return done(null, { id: user.id });
            }
            catch (err) {
                done(err);
                logger_1.default.error(err);
            }
        }));
        this.passport.use(new passport_jwt_1.Strategy({
            jwtFromRequest: passport_jwt_2.ExtractJwt.fromExtractors([
                tokenExtractorFromCookie,
                passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: process.env.JWT_SECRET_KEY,
            // issuer: 'spaceboo',
            // audience: 'www.spaceboo.com',
        }, async (jwt_payload, done) => {
            try {
                const user = await this.userModel
                    .scope(user_model_1.UserScopes.WITH_CONFIRMED)
                    .findOne({ where: { id: jwt_payload.id }, raw: true });
                if (!user) {
                    return done(new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.USER_NOT_FOUND), false);
                }
                else if (!user.confirmed) {
                    return done(new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.USER_NOT_CONFIRMED), false);
                }
                return done(null, { id: user.id });
            }
            catch (err) {
                return done(err, false);
            }
        }));
    }
    userSerialization() {
        this.passport.serializeUser((user, done) => {
            done(null, user.id);
        });
        this.passport.deserializeUser(async (id, done) => {
            try {
                const user = await this.userDao.findById(id);
                done(null, user);
            }
            catch (err) {
                done(err);
            }
        });
    }
}
exports.PassportConfig = PassportConfig;
exports.passportConfig = Singleton_1.SingletonFactory.produce(PassportConfig);
//# sourceMappingURL=passport.config.js.map