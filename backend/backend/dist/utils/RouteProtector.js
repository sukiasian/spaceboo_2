"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteProtector = void 0;
const jwt = require("jsonwebtoken");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
const space_model_1 = require("../models/space.model");
const user_model_1 = require("../models/user.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("./AppError");
const UtilFunctions_1 = require("./UtilFunctions");
class RouteProtector {
}
exports.RouteProtector = RouteProtector;
RouteProtector.userModel = user_model_1.User;
RouteProtector.spaceModel = space_model_1.Space;
RouteProtector.jwt = jwt;
RouteProtector.spaceDao = space_sequelize_dao_1.spaceSequelizeDao;
RouteProtector.userDao = user_sequelize_dao_1.userSequelizeDao;
RouteProtector.utilFunctions = UtilFunctions_1.default;
// TODO регистрация админов не должна быть доступна для каждого - возможно только авторизованный админ должен уметь это делатьы
RouteProtector.adminOnlyProtector = this.utilFunctions.catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const user = await this.userDao.findById(userId);
    if (user.role !== user_model_1.UserRoles.ADMIN) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    next();
});
RouteProtector.spaceOwnerProtector = this.utilFunctions.catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const { spaceId } = req.params;
    const space = await this.spaceDao.findById(spaceId);
    if (space.userId !== userId) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    req.space = {
        id: space.id,
    };
    next();
});
RouteProtector.passwordRecoveryProtector = this.utilFunctions.catchAsync(async (req, res, next) => {
    const token = req.cookies['jwt'];
    if (!jwt.verify(token, process.env.JWT_SECRET_KEY)) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    const payload = this.jwt.decode(token);
    if (!payload.recovery) {
        throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NOT_ENOUGH_RIGHTS);
    }
    const user = await this.userModel.findOne({ where: { id: payload.id } });
    if (!user) {
        throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.USER_NOT_FOUND);
    }
    req.user = {
        id: user.id,
        recovery: true,
    };
    next();
});
//# sourceMappingURL=RouteProtector.js.map