"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class UserController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = user_sequelize_dao_1.userSequelizeDao;
        this.utilFunctions = UtilFunctions_1.default;
        this.editUser = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const { userEditData } = req.body;
            // TODO чтобы решить проблему раздвоения методов (пароль можно изменить и с помощью даного метода и с помощью )
            // кстати при смене пароля нужно учитывать старый пароль
            await this.dao.editUser(userId, userEditData);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.DATA_UPDATED);
        });
    }
}
exports.userController = Singleton_1.SingletonFactory.produce(UserController);
//# sourceMappingURL=user.controller.js.map