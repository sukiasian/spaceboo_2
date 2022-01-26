"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityController = exports.CityController = void 0;
const Singleton_1 = require("../utils/Singleton");
const enums_1 = require("../types/enums");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const city_sequelize_dao_1 = require("../daos/city.sequelize.dao");
class CityController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = city_sequelize_dao_1.citySequelizeDao;
        this.utilFunctions = UtilFunctions_1.default;
        this.getCityByCityToSearch = this.utilFunctions.catchAsync(async (req, res, next) => {
            // NOTE we need to get cities by query - as if we type it in an input field with drop down list of cities as a result
            const cities = await this.dao.getCityByCityToSearch(req.body.cityToSearch);
            this.utilFunctions.sendResponse(res)(201, enums_1.ResponseMessages.USER_CREATED, cities);
        });
        this.getCitiesByQuery = this.utilFunctions.catchAsync(async (req, res, next) => {
            const cities = await this.dao.getCitiesByQuery(req.query);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, cities);
        });
        this.getMajorCities = this.utilFunctions.catchAsync(async (req, res, next) => {
            const cities = await this.dao.getMajorCities();
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, cities);
        });
    }
}
exports.CityController = CityController;
exports.cityController = Singleton_1.SingletonFactory.produce(CityController);
//# sourceMappingURL=city.controller.js.map