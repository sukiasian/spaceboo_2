"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class UserController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = user_sequelize_dao_1.userSequelizeDao;
        this.findUserById = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            return this.dao.findById('sdfsdfsdfsdfsf');
        });
    }
}
exports.userController = Singleton_1.SingletonFactory.produce(UserController);
//# sourceMappingURL=user.controller.js.map