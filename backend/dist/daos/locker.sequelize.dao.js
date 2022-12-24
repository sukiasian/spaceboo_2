"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockerSequelizeDao = exports.LockerSequelizeDao = void 0;
const dao_config_1 = require("../configurations/dao.config");
const locker_model_1 = require("../models/locker.model");
const space_model_1 = require("../models/space.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const Singleton_1 = require("../utils/Singleton");
class LockerSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.lockerModel = locker_model_1.Locker;
        this.getLockersByQuery = async (queryStr) => {
            const page = queryStr.page ? parseInt(queryStr.page, 10) : enums_1.QueryDefaultValue.PAGE;
            const limit = queryStr.limit ? parseInt(queryStr.limit, 10) : enums_1.QueryDefaultValue.LIMIT;
            const offset = (page - 1) * limit;
            return this.model.findAll({ limit, offset, include: [space_model_1.Space] });
        };
        this.createLockerForSpace = async (createLockerData) => {
            return this.model.create(createLockerData);
        };
        this.deleteLockerForSpace = async (spaceId) => {
            const locker = await this.model.findOne({ where: { spaceId } });
            if (!locker) {
                throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.LOCKER_NOT_FOUND_FOR_SPACE);
            }
            await locker.destroy();
        };
    }
    get model() {
        return this.lockerModel;
    }
}
exports.LockerSequelizeDao = LockerSequelizeDao;
exports.lockerSequelizeDao = Singleton_1.SingletonFactory.produce(LockerSequelizeDao);
//# sourceMappingURL=locker.sequelize.dao.js.map