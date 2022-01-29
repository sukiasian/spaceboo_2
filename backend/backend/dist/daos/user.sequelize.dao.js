"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSequelizeDao = exports.UserSequelizeDao = void 0;
const dao_config_1 = require("../configurations/dao.config");
const user_model_1 = require("../models/user.model");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const App_1 = require("../App");
class UserSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.userModel = user_model_1.User;
        this.utilFunctions = UtilFunctions_1.default;
        this.signUpLocal = async (userData) => {
            return this.model.create(userData);
        };
        this.createAdmin = async () => { };
        this.editUser = async (userId, userEditData) => {
            const user = await this.model.findOne({ where: { id: userId } });
            await user.update(userEditData, { fields: user_model_1.userEditFields });
        };
        this.updateUserAvatarInDb = async (userId, avatarUrl) => {
            const updateRawQuery = `UPDATE "Users" SET "avatarUrl" = '${avatarUrl}' WHERE id = '${userId}'`;
            await this.utilFunctions.createSequelizeRawQuery(App_1.applicationInstance.sequelize, updateRawQuery);
        };
        this.removeUserAvatarFromDb = async (userId) => {
            const annualizeRawQuery = `UPDATE "Users" SET "avatarUrl" = NULL WHERE id = '${userId}'`;
            await this.utilFunctions.createSequelizeRawQuery(App_1.applicationInstance.sequelize, annualizeRawQuery);
        };
        this.updateUserLastVerificationRequest = async (user) => {
            await user.update({ lastVerificationRequested: Date.now() });
        };
    }
    get model() {
        return this.userModel;
    }
}
exports.UserSequelizeDao = UserSequelizeDao;
exports.userSequelizeDao = Singleton_1.SingletonFactory.produce(UserSequelizeDao);
//# sourceMappingURL=user.sequelize.dao.js.map