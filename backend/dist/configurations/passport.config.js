"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportConfig = exports.PassportConfig = void 0;
const passport = require("passport");
const passport_facebook_1 = require("passport-facebook");
const passport_local_1 = require("passport-local");
const passport_vkontakte_1 = require("passport-vkontakte");
const passport_odnoklassniki_1 = require("passport-odnoklassniki");
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const Singleton_1 = require("../utils/Singleton");
const user_model_1 = require("../models/user.model");
const enums_1 = require("../types/enums");
const logger_1 = require("../loggers/logger");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
class PassportConfig extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.userDao = user_sequelize_dao_1.userSequelizeDao;
        this.userModel = user_model_1.User;
        this.passport = passport;
    }
    initializePassport() {
        return this.passport.initialize();
    }
    configurePassport() {
        this.passport.use(new passport_local_1.Strategy({ usernameField: 'email', passwordField: 'password', session: false }, async (email, password, done) => {
            try {
                let user;
                user = await this.userModel.scope(user_model_1.UserScopes.WITH_PASSWORD).findOne({ where: { email } });
                if (!user) {
                    return done(null, false);
                }
                if (!(await user.verifyPassword(user)(password))) {
                    return done(null);
                }
                user = await this.userModel.findOne({ raw: true, where: { email } });
                return done(null, { id: user.id });
            }
            catch (err) {
                done(err);
                logger_1.default.log({ level: enums_1.LoggerLevels.ERROR, message: err });
            }
        }));
        this.passport.use(new passport_facebook_1.Strategy({
            clientID: '890851108189818',
            clientSecret: 'f6a91a16da6c4eb4c376895afed8b9cf',
            callbackURL: 'http://localhost:8000/auth/facebook/callback', // NOTE http or https?
        }, async function (accessToken, refreshToken, profile, cb) {
            await this.userModel
                .findOrCreate({ where: { facebookId: profile.id } })
                .then(function (user) {
                return cb(null, user);
            });
        }));
        // FIXME
        this.passport.use(new passport_vkontakte_1.Strategy({
            clientID: 'VKONTAKTE_APP_ID',
            clientSecret: 'VKONTAKTE_APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/vkontakte/callback',
        }, function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
            this.userModel
                .findOrCreate({ where: { vkontakteId: profile.id } })
                .then(function (user) {
                done(null, user);
            })
                .catch(done);
        }));
        this.passport.use(new passport_odnoklassniki_1.Strategy({
            clientID: 'ODNOKLASSNIKI_APP_ID',
            clientPublic: 'ODNOKLASSNIKI_APP_PUBLIC_KEY',
            clientSecret: 'ODNOKLASSNIKI_APP_SECRET_KEY',
            callbackURL: 'http://localhost:3000/auth/odnoklassniki/callback',
        }, function (accessToken, refreshToken, profile, done) {
            this.userModel.findOrCreate({ where: { odnoklassnikiId: profile.id } }).then(function (user) {
                return done(null, user);
            });
        }));
        this.passport.use(new passport_jwt_1.Strategy({
            jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
            // issuer: 'spaceboo',
            // audience: 'www.spaceboo.com',
        }, async (jwt_payload, done) => {
            try {
                const user = await this.userModel.findOne({ where: { id: jwt_payload }, raw: true });
                return user ? done(null, { id: user.id }) : done(null, false);
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