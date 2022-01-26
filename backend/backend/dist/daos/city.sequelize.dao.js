"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citySequelizeDao = exports.CitySequelizeDao = void 0;
const sequelize_1 = require("sequelize");
const App_1 = require("../App");
const dao_config_1 = require("../configurations/dao.config");
const city_model_1 = require("../models/city.model");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class CitySequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.cityModel = city_model_1.City;
        this.utilFunctions = UtilFunctions_1.default;
        this.getCityByCityToSearch = async (cityToSearch) => {
            const query = cityToSearch !== null && cityToSearch !== void 0 ? cityToSearch : {};
            // FIXME wont work
            return this.model.findAll(query);
        };
        this.getCitiesByQuery = async (query) => {
            const { searchPattern } = query;
            let sequelizeQuery = {};
            if (searchPattern) {
                sequelizeQuery.where = {
                    address: {
                        [sequelize_1.Op.iLike]: searchPattern,
                    },
                };
            }
            return this.model.findAll(sequelizeQuery);
        };
        this.getMajorCities = async () => {
            // NOTE FIXME местами city.address местами city.city. Что делать ?
            let majorCities = ['Москва', 'Краснодар', 'Сочи', 'Новосибирск', 'Санкт-Петербург', 'Красноярск'];
            majorCities = majorCities.map((city) => {
                return `'${city}'`;
            });
            // const query = `SELECT * FROM "Cities" c WHERE c."city" LIKE any (array[(${majorCities})]) OR c."address" LIKE any (array[(${majorCities})]);`;
            const query = `SELECT * FROM "Cities" c WHERE c."address" LIKE (${majorCities});`;
            return (await this.utilFunctions.createSequelizeRawQuery(App_1.applicationInstance.sequelize, query));
        };
    }
    get model() {
        return this.cityModel;
    }
}
exports.CitySequelizeDao = CitySequelizeDao;
exports.citySequelizeDao = Singleton_1.SingletonFactory.produce(CitySequelizeDao);
//# sourceMappingURL=city.sequelize.dao.js.map