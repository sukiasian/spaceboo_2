"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citySequelizeDao = exports.CitySequelizeDao = void 0;
const dao_config_1 = require("../configurations/dao.config");
const city_model_1 = require("../models/city.model");
const Singleton_1 = require("../utils/Singleton");
class CitySequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.cityModel = city_model_1.City;
        this.getCitiesByCityToSearch = async (cityToSearch) => {
            const query = cityToSearch !== null && cityToSearch !== void 0 ? cityToSearch : {};
            return this.model.findAll(query);
        };
        // public getTimezoneByCityName = async (cityName: string): Promise<string> => {};
    }
    get model() {
        return this.cityModel;
    }
}
exports.CitySequelizeDao = CitySequelizeDao;
exports.citySequelizeDao = Singleton_1.SingletonFactory.produce(CitySequelizeDao);
//# sourceMappingURL=city.sequelize.dao.js.map