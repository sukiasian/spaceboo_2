"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteProtector = void 0;
const jwt = require("jsonwebtoken");
const appointment_sequelize_dao_1 = require("../daos/appointment.sequelize.dao");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
const user_model_1 = require("../models/user.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("./AppError");
const UtilFunctions_1 = require("./UtilFunctions");
class RouteProtector {
}
exports.RouteProtector = RouteProtector;
_a = RouteProtector;
RouteProtector.userModel = user_model_1.User;
RouteProtector.spaceDao = space_sequelize_dao_1.spaceSequelizeDao;
RouteProtector.userDao = user_sequelize_dao_1.userSequelizeDao;
RouteProtector.appointmentDao = appointment_sequelize_dao_1.appointmentSequelizeDao;
RouteProtector.jwt = jwt;
// private static readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
// TODO регистрация админов не должна быть доступна для каждого - возможно только авторизованный админ должен уметь это делатьы
RouteProtector.adminOnlyProtector = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const user = await _a.userModel.scope(user_model_1.UserScopes.WITH_ROLE).findOne({ where: { id: userId } });
    if (user.role !== user_model_1.UserRoles.ADMIN) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    next();
});
// NOTE: if endpoints can be accessed both by users and admins
RouteProtector.adminOrSpaceOwnerProtector = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const { spaceId } = req.params || req.body || req.query;
    const user = await _a.userDao.findById(userId);
    const space = await _a.spaceDao.findById(spaceId);
    if (user.role !== user_model_1.UserRoles.ADMIN || space.userId !== user.id) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    next();
});
RouteProtector.spaceOwnerProtector = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const spaceId = req.params.spaceId || req.body.spaceId || req.query.spaceId;
    const space = await _a.spaceDao.findById(spaceId);
    if (space.userId !== userId) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    req.space = {
        id: space.id,
    };
    next();
});
RouteProtector.confirmedUserProtector = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
    const user = await _a.userModel.scope(user_model_1.UserScopes.WITH_CONFIRMED).findOne({
        where: {
            id: req.user.id,
        },
    });
    if (!user.confirmed) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.VERIFY_ACCOUNT);
    }
    next();
});
// FIXME: this is realized in passport JWT but in case if we need to allow access for unconfirmed users through passport jwt then we need to use this one.
RouteProtector.passwordRecoveryProtector = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
    const token = req.cookies['jwt'];
    if (!jwt.verify(token, process.env.JWT_SECRET_KEY)) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    const payload = _a.jwt.decode(token);
    if (!payload.recovery) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    const user = await _a.userModel.findOne({ where: { id: payload.id } });
    if (!user) {
        throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.USER_NOT_FOUND);
    }
    req.user = {
        id: user.id,
        recovery: true,
    };
    next();
});
RouteProtector.userHasActiveAppointment = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const { spaceId } = req.body;
    const hasActiveAppointment = await _a.appointmentDao.userHasActiveAppointmentsForSpace(userId, spaceId);
    if (hasActiveAppointment) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    next();
});
//# sourceMappingURL=RouteProtector.js.map