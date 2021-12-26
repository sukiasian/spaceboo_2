"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityController = exports.CityController = void 0;
const dotenv = require("dotenv");
const Singleton_1 = require("../utils/Singleton");
const enums_1 = require("../types/enums");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const city_sequelize_dao_1 = require("../daos/city.sequelize.dao");
dotenv.config();
class CityController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = city_sequelize_dao_1.citySequelizeDao;
        this.getCitiesByCityToSearch = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            // NOTE we need to get cities by query - as if we type it in an input field with drop down list of cities as a result
            const cities = await this.dao.getCitiesByCityToSearch(req.body.cityToSearch);
            UtilFunctions_1.default.sendResponse(res)(201, enums_1.ResponseMessages.USER_CREATED, cities);
        });
    }
}
exports.CityController = CityController;
exports.cityController = Singleton_1.SingletonFactory.produce(CityController);
//# sourceMappingURL=city.controller.js.map