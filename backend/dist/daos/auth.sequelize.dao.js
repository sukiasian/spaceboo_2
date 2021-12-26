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
        this.signUpLocal = async (data) => {
            // NOTE we do so because password and passwordConfirmation are required
            if (data.password && data.passwordConfirmation) {
                return this.model.create(data);
            }
            else {
                throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, 'Пожалуйста, введите действительный пароль');
            }
        };
    }
    get model() {
        return this.userModel;
    }
}
exports.AuthSequelizeDao = AuthSequelizeDao;
exports.authSequelizeDao = Singleton_1.SingletonFactory.produce(AuthSequelizeDao);
//# sourceMappingURL=auth.sequelize.dao.js.map