"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSequelizeDao = exports.AuthSequelizeDao = void 0;
const dao_config_1 = require("../configurations/dao.config");
const user_model_1 = require("../models/user.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const Singleton_1 = require("../utils/Singleton");
class AuthSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.userModel = user_model_1.User;
        // FIXME fix data - use userData and pick a proper datatype
        this.signUpLocal = async (userData) => {
            if (userData.password && userData.passwordConfirmation) {
                return this.model.create(userData, { fields: user_model_1.userCreateFields });
            }
            else {
                throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.PASSWORD_IS_NOT_VALID);
            }
        };
        this.editUserPassword = async (userId, passwordResetData, recovery = false) => {
            const user = await this.model.scope(user_model_1.UserScopes.WITH_PASSWORD).findOne({ where: { id: userId } });
            if (!recovery) {
                if (passwordResetData.oldPassword && !(await user.verifyPassword(user)(passwordResetData.oldPassword))) {
                    throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.PASSWORDS_DO_NOT_MATCH);
                }
                else if (!passwordResetData.oldPassword) {
                    throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.PASSWORD_INCORRECT);
                }
            }
            await user.update({
                password: passwordResetData.password,
                passwordConfirmation: passwordResetData.passwordConfirmation,
            }, { fields: user_model_1.changeUserPasswordFields });
        };
        this.confirmAccount = async (userId) => {
            const user = await this.model.scope(user_model_1.UserScopes.WITH_CONFIRMED).findOne({ where: { id: userId } });
            await user.update({ confirmed: true }, { fields: user_model_1.userConfirmedField });
        };
    }
    get model() {
        return this.userModel;
    }
}
exports.AuthSequelizeDao = AuthSequelizeDao;
exports.authSequelizeDao = Singleton_1.SingletonFactory.produce(AuthSequelizeDao);
//# sourceMappingURL=auth.sequelize.dao.js.map