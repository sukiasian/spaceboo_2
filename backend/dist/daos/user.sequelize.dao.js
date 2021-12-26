"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSequelizeDao = exports.UserSequelizeDao = void 0;
const dao_config_1 = require("../configurations/dao.config");
const user_model_1 = require("../models/user.model");
const Singleton_1 = require("../utils/Singleton");
class UserSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.userModel = user_model_1.User;
        // FIXME
        this.signUpLocal = async function (data) {
            return this.model.create(data);
        };
    }
    get model() {
        return this.userModel;
    }
}
exports.UserSequelizeDao = UserSequelizeDao;
exports.userSequelizeDao = Singleton_1.SingletonFactory.produce(UserSequelizeDao);
//# sourceMappingURL=user.sequelize.dao.js.map